import type { SceneNode } from '../scene';
import type { CanvasPointerEvent } from '../types';
import type { CanvasViewPointerEvent } from '../components/CanvasView';
import { controlSize, eventTarget, isCanvasElement } from './nodes';
import type { HitResult } from './hit-test';
import type { EngineCore } from './state';

/**
 * Translates resolved pointer geometry into the public {@link CanvasUIEvent}
 * stream and the per-node `canvasView` pointer callbacks.
 */

export function emitPointerEvent(
    core: EngineCore,
    type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel',
    event: CanvasPointerEvent,
    hit: HitResult | null,
    point: { x: number; y: number },
): void {
    core.onEvent?.({
        type,
        target: hit ? eventTarget(hit.node) : null,
        x: point.x,
        y: point.y,
        localX: hit?.x,
        localY: hit?.y,
        pointerId: event.pointerId,
    });
}

export function emitCanvasViewPointerEvent(
    type: CanvasViewPointerEvent['type'],
    node: SceneNode,
    x: number,
    y: number,
    event: CanvasPointerEvent,
): void {
    const source = node.props.source;
    if (!isCanvasElement(source)) return;
    const { width, height } = controlSize(node);
    if (!width || !height || !source.width || !source.height) return;
    const fit = node.props.fit ?? 'contain';
    const scale =
        fit === 'cover'
            ? Math.max(width / source.width, height / source.height)
            : fit === 'fill'
              ? null
              : Math.min(width / source.width, height / source.height);
    const drawnWidth = scale === null ? width : source.width * scale;
    const drawnHeight = scale === null ? height : source.height * scale;
    const offsetX = (width - drawnWidth) / 2;
    const offsetY = (height - drawnHeight) / 2;
    const sourceX = scale === null ? (x * source.width) / width : (x - offsetX) / scale;
    const sourceY = scale === null ? (y * source.height) / height : (y - offsetY) / scale;
    const callback = node.props.onPointerEvent;
    if (typeof callback !== 'function') return;
    (callback as (pointerEvent: CanvasViewPointerEvent) => void)({
        type,
        source,
        x,
        y,
        sourceX,
        sourceY,
        sourceWidth: source.width,
        sourceHeight: source.height,
        pointerId: event.pointerId,
        pointerType: event.pointerType,
        pressure: event.pressure,
        isPrimary: event.isPrimary,
        button: event.button,
        buttons: event.buttons,
    });
}
