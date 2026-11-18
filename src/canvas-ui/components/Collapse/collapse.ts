import type { TransformProps } from '../../types';
import { number, string, themeColor } from '../draw-utils';
import { createComponent } from '../shared';

export interface CollapseProps extends TransformProps {
    width: number;
    activeKeys?: string[];
    defaultActiveKeys?: string[];
    accordion?: boolean;
    headerHeight?: number;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    children?: unknown;
    onChange?: (keys: string[]) => void;
}

export interface CollapseItemProps extends TransformProps {
    id: string;
    title: string;
    height?: number;
    disabled?: boolean;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    children?: unknown;
}

export const Collapse = createComponent<CollapseProps>('collapse');
export const CollapseItem = createComponent<CollapseItemProps>('collapseItem');

/** Public props plus the engine-injected layout/expand state consumed by the draw layer. */
export type CollapseItemDrawProps = CollapseItemProps & {
    _collapseWidth?: number;
    _collapseHeaderHeight?: number;
    _expanded?: boolean;
};

export function drawCollapseItem(
    context: CanvasRenderingContext2D,
    props: CollapseItemDrawProps,
): void {
    const width = number(props._collapseWidth, 300);
    const headerHeight = number(props._collapseHeaderHeight, 40);
    context.fillStyle = string(
        props.backgroundColor,
        themeColor(context, '--canvas-ui-collapse-header-background', '#fafafa'),
    );
    context.fillRect(0, 0, width, headerHeight);
    context.strokeStyle = string(
        props.borderColor,
        themeColor(context, '--canvas-ui-collapse-border', '#d9d9d9'),
    );
    context.strokeRect(0, 0, width, headerHeight);
    context.font = '14px sans-serif';
    context.textBaseline = 'middle';
    context.fillStyle = props.disabled
        ? themeColor(context, '--canvas-ui-collapse-disabled-color', '#bfbfbf')
        : string(props.textColor, themeColor(context, '--canvas-ui-collapse-color', '#262626'));
    context.fillText(
        `${props._expanded ? '−' : '+'}  ${String(props.title ?? '')}`,
        12,
        headerHeight / 2,
    );
}
