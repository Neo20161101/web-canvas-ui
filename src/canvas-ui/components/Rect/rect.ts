import type { TransformProps } from '../../types';
import { number, string, themeColor } from '../draw-utils';
import { createComponent } from '../shared';

export interface RectProps extends TransformProps {
    width?: number;
    height?: number;
    color?: string;
    radius?: number;
    stroke?: string;
    strokeWidth?: number;
}

export const Rect = createComponent<RectProps>('rect');

export function drawRect(context: CanvasRenderingContext2D, props: RectProps): void {
    const width = number(props.width, 100);
    const height = number(props.height, 40);
    const radius = Math.max(0, Math.min(number(props.radius, 0), width / 2, height / 2));
    context.beginPath();
    context.roundRect(0, 0, width, height, radius);
    context.fillStyle = string(
        props.color,
        themeColor(context, '--canvas-ui-rect-background', 'transparent'),
    );
    context.fill();
    if (props.stroke) {
        context.strokeStyle = string(
            props.stroke,
            themeColor(context, '--canvas-ui-rect-border', '#000'),
        );
        context.lineWidth = number(props.strokeWidth, 1);
        context.stroke();
    }
}
