import type { TransformProps } from '../../types';
import { number, string, themeColor } from '../draw-utils';
import { createComponent } from '../shared';

export interface DatePickerProps extends TransformProps {
    width?: number;
    height?: number;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    fontSize?: number;
    color?: string;
    bgColor?: string;
    borderColor?: string;
    focusBorderColor?: string;
    borderRadius?: number;
    disabled?: boolean;
    onChange?: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
}

export const DatePicker = createComponent<DatePickerProps>('datePicker');

/** Public props plus the engine-injected focus state consumed by the draw layer. */
export type DatePickerDrawProps = DatePickerProps & { focused?: boolean };

export function drawDatePicker(
    context: CanvasRenderingContext2D,
    props: DatePickerDrawProps,
): void {
    const width = number(props.width, 200);
    const height = number(props.height, 36);
    const radius = Math.max(0, Math.min(number(props.borderRadius, 4), width / 2, height / 2));
    const value = String(props.value ?? '');
    context.beginPath();
    context.roundRect(0, 0, width, height, radius);
    context.fillStyle = string(
        props.bgColor,
        themeColor(context, '--canvas-ui-input-background', '#fff'),
    );
    context.fill();
    context.strokeStyle = props.focused
        ? string(
              props.focusBorderColor,
              themeColor(context, '--canvas-ui-input-focus-border', '#1677ff'),
          )
        : string(props.borderColor, themeColor(context, '--canvas-ui-input-border', '#d9d9d9'));
    context.stroke();
    context.font = `${number(props.fontSize, 14)}px sans-serif`;
    context.textBaseline = 'middle';
    context.fillStyle = value
        ? string(props.color, themeColor(context, '--canvas-ui-input-color', '#333'))
        : themeColor(context, '--canvas-ui-input-placeholder-color', '#999');
    context.fillText(value || string(props.placeholder, 'Select date'), 8, height / 2);
    context.fillStyle = string(props.color, themeColor(context, '--canvas-ui-input-color', '#666'));
    context.strokeStyle = context.fillStyle;
    context.lineWidth = 1.4;
    const iconX = width - 20;
    const iconY = height / 2 - 7;
    context.strokeRect(iconX, iconY + 2, 13, 12);
    context.beginPath();
    context.moveTo(iconX, iconY + 5);
    context.lineTo(iconX + 13, iconY + 5);
    context.moveTo(iconX + 3, iconY);
    context.lineTo(iconX + 3, iconY + 4);
    context.moveTo(iconX + 10, iconY);
    context.lineTo(iconX + 10, iconY + 4);
    context.stroke();
}
