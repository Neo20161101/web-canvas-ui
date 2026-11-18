import type { TransformProps } from '../../types';
import { createComponent } from '../shared';

export interface CustomDrawSize {
    readonly width: number;
    readonly height: number;
}

export interface CustomDrawClickEvent extends CustomDrawSize {
    readonly x: number;
    readonly y: number;
    readonly canvasX: number;
    readonly canvasY: number;
    readonly pointerId: number;
}

export type CustomDrawHitTest = (x: number, y: number, size: CustomDrawSize) => boolean;

export interface CustomDrawProps extends TransformProps {
    width: number;
    height: number;
    draw: (context: CanvasRenderingContext2D, size: CustomDrawSize) => void;
    onClick?: (event: CustomDrawClickEvent) => void;
    hitTest?: CustomDrawHitTest;
}

export const CustomDraw = createComponent<CustomDrawProps>('customDraw');

export function drawCustomDraw(context: CanvasRenderingContext2D, props: CustomDrawProps): void {
    const draw = props.draw;
    if (typeof draw !== 'function') {
        throw new TypeError('<CustomDraw> requires a draw(context, size) function.');
    }

    const width = finiteDimension(props.width, 'width');
    const height = finiteDimension(props.height, 'height');
    context.save();
    try {
        draw(context, { width, height });
    } finally {
        context.restore();
    }
}

function finiteDimension(value: unknown, name: string): number {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
        throw new RangeError(`<CustomDraw> ${name} must be a non-negative finite number.`);
    }
    return value;
}
