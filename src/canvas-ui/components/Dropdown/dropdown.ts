import type { TransformProps } from '../../types';
import { fitText, number, string, themeColor } from '../draw-utils';
import { createComponent } from '../shared';

export interface DropdownOption {
    label: string;
    value: string;
    disabled?: boolean;
}

export interface DropdownProps extends TransformProps {
    width?: number;
    height?: number;
    value?: string;
    defaultValue?: string;
    options: Array<string | DropdownOption>;
    placeholder?: string;
    disabled?: boolean;
    fontSize?: number;
    color?: string;
    bgColor?: string;
    borderColor?: string;
    focusBorderColor?: string;
    borderRadius?: number;
    onChange?: (value: string) => void;
}

export const Dropdown = createComponent<DropdownProps>('dropdown');

/** Public props plus the engine-injected focus/open state consumed by the draw layer. */
export type DropdownDrawProps = DropdownProps & { focused?: boolean; open?: boolean };

export function drawDropdown(context: CanvasRenderingContext2D, props: DropdownDrawProps): void {
    const width = number(props.width, 200);
    const height = number(props.height, 36);
    const options = optionsList(props.options);
    const selected = options.find((option) => option.value === String(props.value ?? ''));
    drawControlBox(
        context,
        width,
        height,
        number(props.borderRadius, 4),
        props,
        Boolean(props.focused || props.open),
    );
    context.font = `${number(props.fontSize, 14)}px sans-serif`;
    context.textBaseline = 'middle';
    context.fillStyle = selected
        ? string(props.color, themeColor(context, '--canvas-ui-dropdown-color', '#333'))
        : themeColor(context, '--canvas-ui-dropdown-placeholder-color', '#999');
    context.fillText(
        fitText(
            context,
            selected?.label ?? string(props.placeholder, 'Select...'),
            Math.max(0, width - 34),
        ),
        8,
        height / 2,
    );
    context.fillStyle = string(
        props.color,
        themeColor(context, '--canvas-ui-dropdown-color', '#555'),
    );
    context.beginPath();
    context.moveTo(width - 18, height / 2 - 3);
    context.lineTo(width - 12, height / 2 + 3);
    context.lineTo(width - 6, height / 2 - 3);
    context.stroke();
}

export function drawDropdownOptions(
    context: CanvasRenderingContext2D,
    props: DropdownDrawProps,
): void {
    const width = number(props.width, 200);
    const height = number(props.height, 36);
    context.font = `${number(props.fontSize, 14)}px sans-serif`;
    context.textBaseline = 'middle';
    optionsList(props.options).forEach((option, index) => {
        const y = height * (index + 1);
        context.fillStyle = themeColor(context, '--canvas-ui-dropdown-option-background', '#fff');
        context.fillRect(0, y, width, height);
        context.strokeStyle = themeColor(context, '--canvas-ui-dropdown-option-border', '#e3e7ed');
        context.strokeRect(0, y, width, height);
        context.fillStyle = option.disabled
            ? themeColor(context, '--canvas-ui-dropdown-disabled-color', '#aaa')
            : string(props.color, themeColor(context, '--canvas-ui-dropdown-color', '#333'));
        context.fillText(
            fitText(context, option.label, Math.max(0, width - 16)),
            8,
            y + height / 2,
        );
    });
}

function drawControlBox(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    radius: number,
    props: DropdownProps,
    focused: boolean,
): void {
    context.beginPath();
    context.roundRect(0, 0, width, height, radius);
    context.fillStyle = string(
        props.bgColor,
        themeColor(context, '--canvas-ui-dropdown-background', '#fff'),
    );
    context.fill();
    context.strokeStyle = focused
        ? string(
              props.focusBorderColor,
              themeColor(context, '--canvas-ui-dropdown-focus-border', '#1677ff'),
          )
        : string(props.borderColor, themeColor(context, '--canvas-ui-dropdown-border', '#d9d9d9'));
    context.stroke();
}

function optionsList(value: unknown): DropdownOption[] {
    if (!Array.isArray(value)) return [];
    return value.map((option) =>
        typeof option === 'string' ? { label: option, value: option } : (option as DropdownOption),
    );
}
