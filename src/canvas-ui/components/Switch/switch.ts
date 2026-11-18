import type { TransformProps } from '../../types';
import { number, string, themeColor } from '../draw-utils';
import { createComponent } from '../shared';

export interface SwitchProps extends TransformProps {
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    width?: number;
    height?: number;
    onColor?: string;
    offColor?: string;
    thumbColor?: string;
    onChange?: (checked: boolean) => void;
}

export const Switch = createComponent<SwitchProps>('switch');

export function drawSwitch(context: CanvasRenderingContext2D, props: SwitchProps): void {
    const width = number(props.width, 44);
    const height = number(props.height, 24);
    const radius = height / 2;
    const checked = Boolean(props.checked);
    context.beginPath();
    context.roundRect(0, 0, width, height, radius);
    context.fillStyle = checked
        ? string(props.onColor, themeColor(context, '--canvas-ui-switch-on', '#1677ff'))
        : string(props.offColor, themeColor(context, '--canvas-ui-switch-off', '#d9d9d9'));
    context.fill();
    context.beginPath();
    context.arc(checked ? width - radius : radius, radius, Math.max(1, radius - 3), 0, Math.PI * 2);
    context.fillStyle = string(
        props.thumbColor,
        themeColor(context, '--canvas-ui-switch-thumb', '#fff'),
    );
    context.fill();
}
