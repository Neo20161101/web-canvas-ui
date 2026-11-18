import type { SceneNode } from '../scene';
import type { Transform } from '../types';
import { IDENTITY_TRANSFORM } from '../types';
import { number } from '../components/draw-utils';
import { normalizeDropdownOptions } from '../components/Dropdown';
import { carouselControlIndex } from '../components/Carousel';
import {
    controlSize,
    hasVisibleAncestors,
    isCanvasElement,
    isDescendantOf,
    isInteractive,
} from './nodes';
import { invertPoint, multiplyTransform } from './transform';
import { gridScrollbarMetrics } from './vnodes';
import type { EngineCore } from './state';

/**
 * Geometry: resolve client (viewport) coordinates to canvas / node-local space and
 * determine which interactive node, if any, is under a pointer, honouring modal
 * dialogs and grid/carousel clipping. Pure apart from reading the live scene graph.
 */

export interface HitResult {
    node: SceneNode;
    x: number;
    y: number;
}

export function canvasPoint(
    core: EngineCore,
    canvas: HTMLCanvasElement,
    clientX: number,
    clientY: number,
): { x: number; y: number } | null {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    return {
        x: ((clientX - rect.left) * canvas.width) / rect.width / core.pixelRatio,
        y: ((clientY - rect.top) * canvas.height) / rect.height / core.pixelRatio,
    };
}

export function localPoint(
    core: EngineCore,
    canvas: HTMLCanvasElement,
    clientX: number,
    clientY: number,
    target: SceneNode,
): { x: number; y: number } | null {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const x = ((clientX - rect.left) * canvas.width) / rect.width / core.pixelRatio;
    const y = ((clientY - rect.top) * canvas.height) / rect.height / core.pixelRatio;
    let result: { x: number; y: number } | null = null;
    const find = (node: SceneNode, parent: Transform): boolean => {
        const transform = multiplyTransform(parent, node.props);
        if (node === target) {
            result = invertPoint(x, y, transform);
            return true;
        }
        for (const child of node.children) {
            if (find(child, transform)) return true;
        }
        return false;
    };
    find(core.scene, IDENTITY_TRANSFORM);
    return result;
}

export function isWithinClip(
    core: EngineCore,
    canvas: HTMLCanvasElement,
    clientX: number,
    clientY: number,
    node: SceneNode,
): boolean {
    let parent = node.parent;
    while (parent) {
        if (
            (parent.type === 'grid' && typeof parent.props.height === 'number') ||
            parent.type === 'carousel'
        ) {
            const point = localPoint(core, canvas, clientX, clientY, parent);
            const width =
                parent.type === 'grid'
                    ? number(parent.props._gridWidth, number(parent.props.width, 0))
                    : number(parent.props.width, 300);
            const height = number(parent.props.height, parent.type === 'carousel' ? 180 : 0);
            if (!point || point.x < 0 || point.x > width || point.y < 0 || point.y > height) {
                return false;
            }
        }
        parent = parent.parent;
    }
    return true;
}

export function findHit(
    core: EngineCore,
    canvas: HTMLCanvasElement,
    clientX: number,
    clientY: number,
): HitResult | null {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const pointX = ((clientX - rect.left) * canvas.width) / rect.width / core.pixelRatio;
    const pointY = ((clientY - rect.top) * canvas.height) / rect.height / core.pixelRatio;
    const candidates: Array<{ node: SceneNode; transform: Transform }> = [];
    const collect = (node: SceneNode, parent: Transform, parentVisible: boolean) => {
        const visible = parentVisible && node.props.visible !== false;
        if (!visible) return;
        // Dialogs render in viewport space, outside their enclosing group transforms.
        const transform =
            node.type === 'dialog'
                ? multiplyTransform(IDENTITY_TRANSFORM, node.props)
                : multiplyTransform(parent, node.props);
        if (isInteractive(node.type) || (node.type === 'dialog' && node.props.open === true)) {
            candidates.push({ node, transform });
        }
        node.children.forEach((child) => collect(child, transform, visible));
    };
    collect(core.scene, IDENTITY_TRANSFORM, true);
    const modal = [...candidates].reverse().find((candidate) => candidate.node.type === 'dialog');

    for (let index = candidates.length - 1; index >= 0; index--) {
        const candidate = candidates[index];
        if (modal && candidate.node !== modal.node && !isDescendantOf(candidate.node, modal.node))
            continue;
        if (
            candidate.node.type !== 'dropdown' ||
            !candidate.node.props.open ||
            candidate.node.props.disabled
        )
            continue;
        if (!isWithinClip(core, canvas, clientX, clientY, candidate.node)) continue;
        const local = invertPoint(pointX, pointY, candidate.transform);
        if (!local) continue;
        const { width, height } = controlSize(candidate.node);
        const popupHeight = normalizeDropdownOptions(candidate.node.props.options).length * height;
        if (
            local.x >= 0 &&
            local.x <= width &&
            local.y >= height &&
            local.y <= height + popupHeight
        ) {
            return { node: candidate.node, x: local.x, y: local.y };
        }
    }

    for (let index = candidates.length - 1; index >= 0; index--) {
        const candidate = candidates[index];
        if (modal && candidate.node !== modal.node && !isDescendantOf(candidate.node, modal.node))
            continue;
        if (!isWithinClip(core, canvas, clientX, clientY, candidate.node)) continue;
        const local = invertPoint(pointX, pointY, candidate.transform);
        if (!local) continue;
        if (candidate.node.type === 'customDraw') {
            const { width, height } = controlSize(candidate.node);
            if (local.x < 0 || local.x > width || local.y < 0 || local.y > height) continue;
            const hitTest = candidate.node.props.hitTest;
            if (
                typeof hitTest === 'function' &&
                !(
                    hitTest as (
                        x: number,
                        y: number,
                        size: { width: number; height: number },
                    ) => boolean
                )(local.x, local.y, { width, height })
            )
                continue;
            return { node: candidate.node, x: local.x, y: local.y };
        }
        if (candidate.node.type === 'canvasView') {
            const source = candidate.node.props.source;
            if (!isCanvasElement(source) || !source.width || !source.height) continue;
            const { width, height } = controlSize(candidate.node);
            if (local.x < 0 || local.x > width || local.y < 0 || local.y > height) continue;
            const fit = candidate.node.props.fit ?? 'contain';
            if (fit === 'contain') {
                const scale = Math.min(width / source.width, height / source.height);
                const drawnWidth = source.width * scale;
                const drawnHeight = source.height * scale;
                const offsetX = (width - drawnWidth) / 2;
                const offsetY = (height - drawnHeight) / 2;
                if (
                    local.x < offsetX ||
                    local.x > offsetX + drawnWidth ||
                    local.y < offsetY ||
                    local.y > offsetY + drawnHeight
                )
                    continue;
            }
            return { node: candidate.node, x: local.x, y: local.y };
        }
        if (candidate.node.type === 'dialog') {
            return { node: candidate.node, x: local.x, y: local.y };
        }
        if (candidate.node.type === 'tabs') {
            const width = number(candidate.node.props.width, 300);
            const height = number(candidate.node.props.height, 200);
            if (local.x >= 0 && local.x <= width && local.y >= 0 && local.y <= height) {
                return { node: candidate.node, x: local.x, y: local.y };
            }
            continue;
        }
        if (candidate.node.type === 'carousel') {
            const width = number(candidate.node.props.width, 300);
            const height = number(candidate.node.props.height, 180);
            if (local.x >= 0 && local.x <= width && local.y >= 0 && local.y <= height) {
                return { node: candidate.node, x: local.x, y: local.y };
            }
            continue;
        }
        if (candidate.node.type === 'grid') {
            if (typeof candidate.node.props.height !== 'number') continue;
            const width = number(
                candidate.node.props._gridWidth,
                number(candidate.node.props.width, 0),
            );
            const height = number(candidate.node.props.height, 0);
            if (local.x >= 0 && local.x <= width && local.y >= 0 && local.y <= height) {
                return { node: candidate.node, x: local.x, y: local.y };
            }
            continue;
        }
        if (candidate.node.type === 'collapse') {
            const width = number(candidate.node.props.width, 300);
            const height = candidate.node.children.reduce(
                (total, child) =>
                    total +
                    number(child.props._collapseHeaderHeight, 40) +
                    (child.props._expanded ? number(child.props.height, 100) : 0),
                0,
            );
            if (local.x >= 0 && local.x <= width && local.y >= 0 && local.y <= height) {
                return { node: candidate.node, x: local.x, y: local.y };
            }
            continue;
        }
        const { width, height } = controlSize(candidate.node);
        const popupHeight =
            candidate.node.type === 'dropdown' && candidate.node.props.open
                ? normalizeDropdownOptions(candidate.node.props.options).length * height
                : 0;
        if (local.x >= 0 && local.x <= width && local.y >= 0 && local.y <= height + popupHeight) {
            return { node: candidate.node, x: local.x, y: local.y };
        }
    }
    return null;
}

export function findCarouselControlHit(
    core: EngineCore,
    canvas: HTMLCanvasElement,
    clientX: number,
    clientY: number,
): { node: SceneNode; index: number } | null {
    const carousels: SceneNode[] = [];
    const dialogs: SceneNode[] = [];
    core.scene.traverse((node) => {
        if (node.type === 'dialog' && node.props.open === true && hasVisibleAncestors(node)) {
            dialogs.push(node);
        }
        if (node.type === 'carousel' && hasVisibleAncestors(node)) carousels.push(node);
    });
    const modal = dialogs[dialogs.length - 1];
    for (const node of carousels.reverse()) {
        if (modal && !isDescendantOf(node, modal)) continue;
        const point = localPoint(core, canvas, clientX, clientY, node);
        if (!point) continue;
        const width = number(node.props.width, 300);
        const height = number(node.props.height, 180);
        const count = node.children.filter((child) => child.type === 'carouselItem').length;
        const current = number(node.props._activeIndex, 0);
        const index = carouselControlIndex(
            node.props,
            point.x,
            point.y,
            count,
            current,
            width,
            height,
        );
        if (index !== undefined) return { node, index };
    }
    return null;
}

export function findGridScrollbarHit(
    core: EngineCore,
    canvas: HTMLCanvasElement,
    clientX: number,
    clientY: number,
): { node: SceneNode; pointerY: number; scrollTop: number } | null {
    const grids: SceneNode[] = [];
    core.scene.traverse((node) => {
        if (node.type === 'grid' && typeof node.props.height === 'number') grids.push(node);
    });
    for (const grid of grids.reverse()) {
        if (!isWithinClip(core, canvas, clientX, clientY, grid)) continue;
        const point = localPoint(core, canvas, clientX, clientY, grid);
        if (!point) continue;
        const metrics = gridScrollbarMetrics(grid.props);
        if (
            metrics.maxScroll <= 0 ||
            point.x < metrics.trackX ||
            point.x > metrics.width ||
            point.y < metrics.thumbY ||
            point.y > metrics.thumbY + metrics.thumbHeight
        )
            continue;
        return {
            node: grid,
            pointerY: point.y,
            scrollTop: number(grid.props._scrollTop, 0),
        };
    }
    return null;
}
