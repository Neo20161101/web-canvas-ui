import type { SceneNode } from '../scene';
import type { CanvasUIEventTarget, InputLayout } from '../types';
import { number } from '../components/draw-utils';
import { choiceGroupSize } from '../components/ChoiceGroup';
import { componentHeight, componentWidth } from '../components/size';
import { invertPoint, nodeTransform } from './transform';

/**
 * Pure predicates and derived getters over a {@link SceneNode} subtree.
 * None of these read engine-level mutable state — they only inspect nodes.
 */

export function hasVisibleAncestors(node: SceneNode): boolean {
    let current: SceneNode | null = node;
    while (current) {
        if (current.props.visible === false) return false;
        current = current.parent;
    }
    return true;
}

export function hasVisibleOpenDialog(node: SceneNode, parentVisible: boolean): boolean {
    const visible = parentVisible && node.props.visible !== false;
    if (!visible) return false;
    if (node.type === 'dialog' && node.props.open === true) return true;
    return node.children.some((child) => hasVisibleOpenDialog(child, visible));
}

export function eventTarget(node: SceneNode): CanvasUIEventTarget {
    if (node.type === 'root') throw new Error('The Canvas root is not an event target.');
    const storedKey = node.props._key;
    const separator = typeof storedKey === 'string' ? storedKey.indexOf(':') : -1;
    return {
        type: node.type,
        key: typeof storedKey !== 'string' || separator < 0 ? null : storedKey.slice(separator + 1),
    };
}

export function isCanvasElement(value: unknown): value is HTMLCanvasElement {
    return (
        typeof value === 'object' &&
        value !== null &&
        'nodeName' in value &&
        value.nodeName === 'CANVAS' &&
        'width' in value &&
        typeof value.width === 'number' &&
        'height' in value &&
        typeof value.height === 'number'
    );
}

export function isInteractive(type: string): boolean {
    return (
        type === 'button' ||
        type === 'upload' ||
        type === 'switch' ||
        type === 'slider' ||
        type === 'dropdown' ||
        type === 'tabs' ||
        type === 'collapse' ||
        type === 'grid' ||
        type === 'radio' ||
        type === 'checkbox' ||
        type === 'carousel' ||
        type === 'customDraw' ||
        type === 'canvasView'
    );
}

export function isDescendantOf(node: SceneNode, ancestor: SceneNode): boolean {
    let current = node.parent;
    while (current) {
        if (current === ancestor) return true;
        current = current.parent;
    }
    return false;
}

export function setTreeVisibility(node: SceneNode, visible: boolean): void {
    const effectiveVisibility = visible && node.props._userVisible !== false;
    node.setProps({ visible: effectiveVisibility });
    node.children.forEach((child) => setTreeVisibility(child, effectiveVisibility));
}

export function controlSize(node: SceneNode): { width: number; height: number } {
    if (node.type === 'radio' || node.type === 'checkbox') return choiceGroupSize(node.props);
    if (node.type === 'icon') {
        const size = number(node.props.size, 24);
        return { width: size, height: size };
    }
    if (node.type === 'customDraw') {
        return {
            width: number(node.props.width, 0),
            height: number(node.props.height, 0),
        };
    }
    const widthFallback =
        node.type === 'upload'
            ? 120
            : node.type === 'switch'
              ? 44
              : node.type === 'slider'
                ? 160
                : node.type === 'button'
                  ? 120
                  : 200;
    const heightFallback =
        node.type === 'upload'
            ? 40
            : node.type === 'switch'
              ? 24
              : node.type === 'slider'
                ? 32
                : node.type === 'button'
                  ? 40
                  : 36;
    if (node.type === 'switch' || node.type === 'slider') {
        return {
            width: number(node.props.width, widthFallback),
            height: number(node.props.height, heightFallback),
        };
    }
    if (
        node.type === 'button' ||
        node.type === 'upload' ||
        node.type === 'dropdown' ||
        node.type === 'datePicker'
    ) {
        return {
            width: number(node.props.width, widthFallback),
            height: number(node.props.height, heightFallback),
        };
    }
    return {
        width: componentWidth(node.props, widthFallback),
        height: componentHeight(node.props, heightFallback),
    };
}

export function isTextControlVisible(node: SceneNode, layout: InputLayout): boolean {
    let current: SceneNode | null = node;
    while (current) {
        if (current.props.visible === false) return false;
        if (current.type === 'grid' && typeof current.props.height === 'number') {
            const [a, b, c, d, e, f] = layout.transform;
            const centerX = (a * layout.width) / 2 + (c * layout.height) / 2 + e;
            const centerY = (b * layout.width) / 2 + (d * layout.height) / 2 + f;
            const point = invertPoint(centerX, centerY, nodeTransform(current));
            const width = number(current.props._gridWidth, number(current.props.width, 0));
            const height = number(current.props.height, 0);
            if (!point || point.x < 0 || point.x > width || point.y < 0 || point.y > height) {
                return false;
            }
        }
        current = current.parent;
    }
    return true;
}
