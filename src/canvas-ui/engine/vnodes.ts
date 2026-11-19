import type { VNode } from '../types';
import { number } from '../components/draw-utils';
import type { CarouselTransition } from './state';

/**
 * Pure helpers that rewrite a VNode tree during the `prepare` normalization pass,
 * plus metrics used by grid scrolling. They never touch engine state.
 */

export function layoutGridChildren(vnode: VNode): {
    children: VNode[];
    contentHeight: number;
    width: number;
} {
    const columns = vnode.props.columns;
    const explicitCellWidth = vnode.props.cellWidth;
    const gridWidth = vnode.props.width;
    const cellHeight = vnode.props.cellHeight;
    const gap = vnode.props.gap ?? 0;
    if (!Number.isInteger(columns) || (columns as number) < 1) {
        throw new RangeError('Grid columns must be a positive integer.');
    }
    if (typeof cellHeight !== 'number' || !Number.isFinite(cellHeight) || cellHeight <= 0) {
        throw new RangeError('Grid cellHeight must be a positive finite number.');
    }
    if (typeof gap !== 'number' || !Number.isFinite(gap) || gap < 0) {
        throw new RangeError('Grid gap must be a non-negative finite number.');
    }
    if (
        gridWidth !== undefined &&
        (typeof gridWidth !== 'number' || !Number.isFinite(gridWidth) || gridWidth <= 0)
    ) {
        throw new RangeError('Grid width must be a positive finite number when provided.');
    }
    if (
        vnode.props.height !== undefined &&
        (typeof vnode.props.height !== 'number' ||
            !Number.isFinite(vnode.props.height) ||
            vnode.props.height <= 0)
    ) {
        throw new RangeError('Grid height must be a positive finite number when provided.');
    }
    const cellWidth =
        explicitCellWidth === undefined
            ? typeof gridWidth === 'number' && Number.isFinite(gridWidth) && gridWidth > 0
                ? (gridWidth - gap * ((columns as number) - 1)) / (columns as number)
                : NaN
            : explicitCellWidth;
    if (typeof cellWidth !== 'number' || !Number.isFinite(cellWidth) || cellWidth <= 0) {
        throw new RangeError(
            'Grid requires a positive finite cellWidth, or a positive width large enough for its columns and gaps.',
        );
    }

    const width =
        typeof gridWidth === 'number' && Number.isFinite(gridWidth)
            ? gridWidth
            : cellWidth * (columns as number) + gap * ((columns as number) - 1);
    const occupied = new Set<string>();
    let cursor = 0;
    let contentHeight = 0;
    const children = vnode.children.map((child) => {
        const isGridItem = child.type === 'gridItem';
        const columnSpan = isGridItem ? (child.props.columnSpan ?? 1) : 1;
        const rowSpan = isGridItem ? (child.props.rowSpan ?? 1) : 1;
        if (
            !Number.isInteger(columnSpan) ||
            (columnSpan as number) < 1 ||
            (columnSpan as number) > (columns as number)
        ) {
            throw new RangeError(
                'GridItem columnSpan must be a positive integer no greater than Grid columns.',
            );
        }
        if (!Number.isInteger(rowSpan) || (rowSpan as number) < 1) {
            throw new RangeError('GridItem rowSpan must be a positive integer.');
        }

        let row = Math.floor(cursor / (columns as number));
        let column = cursor % (columns as number);
        while (
            column + (columnSpan as number) > (columns as number) ||
            !gridAreaIsFree(occupied, row, column, columnSpan as number, rowSpan as number)
        ) {
            cursor++;
            row = Math.floor(cursor / (columns as number));
            column = cursor % (columns as number);
        }
        for (let itemRow = row; itemRow < row + (rowSpan as number); itemRow++) {
            for (
                let itemColumn = column;
                itemColumn < column + (columnSpan as number);
                itemColumn++
            ) {
                occupied.add(`${itemRow}:${itemColumn}`);
            }
        }
        contentHeight = Math.max(
            contentHeight,
            row * ((cellHeight as number) + (gap as number)) +
                (rowSpan as number) * (cellHeight as number) +
                ((rowSpan as number) - 1) * (gap as number),
        );
        cursor++;

        // The box this child has to fit in: one cell, or the span-expanded area for a GridItem.
        // Content nodes read it as their wrap width and line budget unless they declare their own,
        // so `cellWidth`/`cellHeight` no longer have to be copied into every child by hand.
        const areaWidth = cellWidth * (columnSpan as number) + gap * ((columnSpan as number) - 1);
        const areaHeight = cellHeight * (rowSpan as number) + gap * ((rowSpan as number) - 1);

        return {
            ...child,
            props: {
                ...child.props,
                x: number(child.props.x, 0) + column * (cellWidth + gap),
                y: number(child.props.y, 0) + row * (cellHeight + gap),
                _availableWidth: areaWidth,
                _availableHeight: areaHeight,
                ...(isGridItem ? { _gridItemWidth: areaWidth, _gridItemHeight: areaHeight } : {}),
            },
            // A GridItem paints nothing itself, so the controls it groups inherit its box. Only one
            // level deep: a nested Group has no size of its own to hand down.
            children: isGridItem
                ? stampAvailable(child.children, areaWidth, areaHeight)
                : child.children,
        };
    });
    return { children, contentHeight, width };
}

/** Rewrites `children` with the content box of the container they live in. */
function stampAvailable(children: VNode[], width: number, height: number): VNode[] {
    return children.map((child) => ({
        ...child,
        props: { ...child.props, _availableWidth: width, _availableHeight: height },
    }));
}

function gridAreaIsFree(
    occupied: Set<string>,
    row: number,
    column: number,
    columnSpan: number,
    rowSpan: number,
): boolean {
    for (let itemRow = row; itemRow < row + rowSpan; itemRow++) {
        for (let itemColumn = column; itemColumn < column + columnSpan; itemColumn++) {
            if (occupied.has(`${itemRow}:${itemColumn}`)) return false;
        }
    }
    return true;
}

export function translateChildren(children: VNode[], offsetX: number, offsetY: number): VNode[] {
    return children.map((child) => ({
        ...child,
        props: {
            ...child.props,
            x: number(child.props.x, 0) + offsetX,
            y: number(child.props.y, 0) + offsetY,
        },
    }));
}

export function setVNodeVisibility(children: VNode[], parentVisible: boolean): VNode[] {
    return children.map((child) => {
        const userVisible =
            typeof child.props._userVisible === 'boolean'
                ? child.props._userVisible
                : child.props.visible !== false;
        const visible = parentVisible && userVisible;
        return {
            ...child,
            props: { ...child.props, visible, _userVisible: userVisible },
            children: setVNodeVisibility(child.children, visible),
        };
    });
}

export function carouselItemOffset(
    index: number,
    transition: CarouselTransition | undefined | null,
    progress: number,
    width: number,
): number {
    if (!transition) return 0;
    if (index === transition.from) return -transition.direction * width * progress;
    if (index === transition.to) return transition.direction * width * (1 - progress);
    return 0;
}

export function gridScrollbarMetrics(props: Record<string, unknown>) {
    const height = number(props.height, 0);
    const contentHeight = number(props._gridContentHeight, height);
    const width = number(props._gridWidth, number(props.width, 0));
    const maxScroll = Math.max(0, contentHeight - height);
    const thumbHeight =
        maxScroll > 0 ? Math.min(height, Math.max(18, (height * height) / contentHeight)) : height;
    const trackX = Math.max(0, width - 6);
    const thumbY =
        maxScroll > 0 ? ((height - thumbHeight) * number(props._scrollTop, 0)) / maxScroll : 0;
    return { width, height, maxScroll, thumbHeight, trackX, thumbY };
}
