import type { TransformProps } from '../../types';
import { number, string, themeColor } from '../draw-utils';
import { createComponent } from '../shared';

export interface CircleProps extends TransformProps {
    radius?: number;
    color?: string;
    stroke?: string;
    strokeWidth?: number;
}

export const Circle = createComponent<CircleProps>('circle');

export function drawCircle(context: CanvasRenderingContext2D, props: CircleProps): void {
    const radius = number(props.radius, 10);
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.fillStyle = string(
        props.color,
        themeColor(context, '--canvas-ui-circle-background', '#e74c3c'),
    );
    context.fill();
    if (props.stroke) {
        context.strokeStyle = string(
            props.stroke,
            themeColor(context, '--canvas-ui-circle-border', '#000'),
        );
        context.lineWidth = number(props.strokeWidth, 1);
        context.stroke();
    }
}
