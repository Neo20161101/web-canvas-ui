import type { SceneNode } from '../../scene';

export function tabKeyAt(
    items: readonly SceneNode[],
    x: number,
    y: number,
    width: number,
    headerHeight: number,
): string | undefined {
    if (y >= headerHeight || items.length === 0) return undefined;
    const item = items[Math.floor(x / (width / items.length))];
    if (!item || item.props.disabled || typeof item.props.id !== 'string') return undefined;
    return item.props.id;
}
