import type { TransformProps } from '../../types';
import { createComponent } from '../shared';
import type { CustomDrawSize } from '../CustomDraw';

export type CanvasViewFit = 'contain' | 'cover' | 'fill';

export interface CanvasViewPointerEvent {
    readonly type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel' | 'click';
    readonly source: HTMLCanvasElement;
    readonly x: number;
    readonly y: number;
    readonly sourceX: number;
    readonly sourceY: number;
    readonly sourceWidth: number;
    readonly sourceHeight: number;
    readonly pointerId: number;
    readonly pointerType?: string;
    readonly pressure?: number;
    readonly isPrimary?: boolean;
    readonly button?: number;
    readonly buttons?: number;
}

export type CanvasViewPointerEventHandler = (event: CanvasViewPointerEvent) => void;

export interface CanvasViewProps extends TransformProps {
    source: HTMLCanvasElement;
    width: number;
    height: number;
    fit?: CanvasViewFit;
    onPointerEvent?: CanvasViewPointerEventHandler;
}

export const CanvasView = createComponent<CanvasViewProps>('canvasView');

export function drawCanvasView(context: CanvasRenderingContext2D, props: CanvasViewProps): void {
    const source = props.source;
    if (!isHTMLCanvasElement(source)) {
        throw new TypeError('<CanvasView> requires an HTMLCanvasElement source.');
    }
    if (source === context.canvas) {
        throw new TypeError('<CanvasView> cannot draw the destination Canvas into itself.');
    }

    const width = dimension(props.width, 'width');
    const height = dimension(props.height, 'height');
    if (!source.width || !source.height || !width || !height) return;

    const size: CustomDrawSize = { width, height };
    const fit = props.fit ?? 'contain';
    context.save();
    try {
        context.beginPath();
        context.rect(0, 0, size.width, size.height);
        context.clip();
        if (fit === 'fill') {
            context.drawImage(source, 0, 0, size.width, size.height);
            return;
        }

        if (fit !== 'contain' && fit !== 'cover') {
            throw new RangeError('<CanvasView> fit must be "contain", "cover", or "fill".');
        }

        const scale =
            fit === 'cover'
                ? Math.max(size.width / source.width, size.height / source.height)
                : Math.min(size.width / source.width, size.height / source.height);
        const drawWidth = source.width * scale;
        const drawHeight = source.height * scale;
        context.drawImage(
            source,
            (size.width - drawWidth) / 2,
            (size.height - drawHeight) / 2,
            drawWidth,
            drawHeight,
        );
    } finally {
        context.restore();
    }
}

function dimension(value: unknown, name: string): number {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
        throw new RangeError(`<CanvasView> ${name} must be a non-negative finite number.`);
    }
    return value;
}

function isHTMLCanvasElement(value: unknown): value is HTMLCanvasElement {
    return (
        typeof value === 'object' &&
        value !== null &&
        'nodeName' in value &&
        value.nodeName === 'CANVAS' &&
        'width' in value &&
        typeof value.width === 'number' &&
        'height' in value &&
        typeof value.height === 'number' &&
        'getContext' in value &&
        typeof value.getContext === 'function'
    );
}
