import type { TransformProps } from '../../types';
import { number, string, themeColor } from '../draw-utils';
import { createComponent } from '../shared';

export interface ProgressProps extends TransformProps {
    value: number;
    min?: number;
    max?: number;
    width?: number;
    height?: number;
    color?: string;
    trackColor?: string;
    textColor?: string;
    borderRadius?: number;
    showText?: boolean;
}

export const Progress = createComponent<ProgressProps>('progress');

export function drawProgress(context: CanvasRenderingContext2D, props: ProgressProps): void {
    const width = number(props.width, 200);
    const height = number(props.height, 12);
    const min = number(props.min, 0);
    const max = number(props.max, 100);
    const value = Math.max(min, Math.min(max, number(props.value, min)));
    const ratio = max > min ? (value - min) / (max - min) : 0;
    const radius = Math.max(
        0,
        Math.min(number(props.borderRadius, height / 2), height / 2, width / 2),
    );
    context.beginPath();
    context.roundRect(0, 0, width, height, radius);
    context.fillStyle = string(
        props.trackColor,
        themeColor(context, '--canvas-ui-progress-track', '#f0f0f0'),
    );
    context.fill();
    if (ratio > 0) {
        context.save();
        context.beginPath();
        context.roundRect(0, 0, width, height, radius);
        context.clip();
        context.fillStyle = string(
            props.color,
            themeColor(context, '--canvas-ui-progress-active', '#1677ff'),
        );
        context.fillRect(0, 0, width * ratio, height);
        context.restore();
    }
    if (props.showText) {
        context.font = `${Math.max(10, height)}px sans-serif`;
        context.textBaseline = 'middle';
        context.fillStyle = string(
            props.textColor,
            themeColor(context, '--canvas-ui-progress-text', '#333'),
        );
        context.fillText(`${Math.round(ratio * 100)}%`, width + 8, height / 2);
    }
}
