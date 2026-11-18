import type { SceneNode } from '../scene';
import type { Transform } from '../types';
import { IDENTITY_TRANSFORM } from '../types';
import { number } from '../components/draw-utils';

/**
 * Pure 2D affine-transform math shared by hit-testing, layout and input routing.
 * A transform is the `[a, b, c, d, e, f]` matrix tuple used by the Canvas API.
 */

export function multiplyTransform(parent: Transform, props: Record<string, unknown>): Transform {
    const rotation = number(props.rotation, 0);
    const scaleX = number(props.scaleX, 1);
    const scaleY = number(props.scaleY, 1);
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    const a = cos * scaleX;
    const b = sin * scaleX;
    const c = -sin * scaleY;
    const d = cos * scaleY;
    const x = number(props.x, 0);
    const y = number(props.y, 0);
    const [pa, pb, pc, pd, pe, pf] = parent;
    return [
        pa * a + pc * b,
        pb * a + pd * b,
        pa * c + pc * d,
        pb * c + pd * d,
        pa * x + pc * y + pe,
        pb * x + pd * y + pf,
    ];
}

export function invertPoint(
    x: number,
    y: number,
    transform: Transform,
): { x: number; y: number } | null {
    const [a, b, c, d, e, f] = transform;
    const determinant = a * d - b * c;
    if (!determinant) return null;
    const dx = x - e;
    const dy = y - f;
    return {
        x: (d * dx - c * dy) / determinant,
        y: (-b * dx + a * dy) / determinant,
    };
}

/** Accumulated world transform of a node from the scene root down to it. */
export function nodeTransform(node: SceneNode): Transform {
    const ancestors: SceneNode[] = [];
    let current: SceneNode | null = node;
    while (current) {
        ancestors.push(current);
        current = current.parent;
    }
    return ancestors
        .reverse()
        .reduce((transform, item) => multiplyTransform(transform, item.props), IDENTITY_TRANSFORM);
}
