import type { TransformProps } from '../../types';
import { number, string, themeColor } from '../draw-utils';
import { createComponent } from '../shared';

export interface SliderProps extends TransformProps {
    width?: number;
    height?: number;
    min?: number;
    max?: number;
    step?: number;
    value?: number;
    defaultValue?: number;
    disabled?: boolean;
    trackColor?: string;
    activeColor?: string;
    thumbColor?: string;
    onChange?: (value: number) => void;
}

export const Slider = createComponent<SliderProps>('slider');

export function drawSlider(context: CanvasRenderingContext2D, props: SliderProps): void {
    const width = number(props.width, 160);
    const height = number(props.height, 32);
    const min = number(props.min, 0);
    const max = number(props.max, 100);
    const value = Math.max(min, Math.min(max, number(props.value, min)));
    const ratio = max === min ? 0 : (value - min) / (max - min);
    const centerY = height / 2;
    const radius = Math.min(8, height / 3);
    const thumbX = radius + ratio * Math.max(0, width - radius * 2);
    context.beginPath();
    context.roundRect(radius, centerY - 3, Math.max(0, width - radius * 2), 6, 3);
    context.fillStyle = string(
        props.trackColor,
        themeColor(context, '--canvas-ui-slider-track', '#f0f0f0'),
    );
    context.fill();
    context.beginPath();
    context.roundRect(radius, centerY - 3, Math.max(0, thumbX - radius), 6, 3);
    context.fillStyle = string(
        props.activeColor,
        themeColor(context, '--canvas-ui-slider-active', '#1677ff'),
    );
    context.fill();
    context.beginPath();
    context.arc(thumbX, centerY, radius, 0, Math.PI * 2);
    context.fillStyle = props.disabled
        ? themeColor(context, '--canvas-ui-slider-disabled-thumb', '#bfbfbf')
        : string(props.thumbColor, themeColor(context, '--canvas-ui-slider-thumb', '#fff'));
    context.fill();
    context.strokeStyle = string(
        props.activeColor,
        themeColor(context, '--canvas-ui-slider-active', '#1677ff'),
    );
    context.stroke();
}
