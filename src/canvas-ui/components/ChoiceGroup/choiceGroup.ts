import type { TransformProps } from '../../types';
import { number, string, themeColor } from '../draw-utils';
import { componentHeight, componentWidth } from '../size';

export interface ChoiceOption {
    label: string;
    value: string;
    disabled?: boolean;
}

export interface ChoiceGroupProps extends TransformProps {
    size?: { width?: number; height?: number };
    width?: number;
    height?: number;
    options: Array<string | ChoiceOption>;
    value?: string | string[];
    defaultValue?: string | string[];
    disabled?: boolean;
    direction?: 'horizontal' | 'vertical';
    gap?: number;
    optionHeight?: number;
    fontSize?: number;
    color?: string;
    activeColor?: string;
    disabledColor?: string;
    borderColor?: string;
}

export function choiceOptions(value: unknown): ChoiceOption[] {
    if (!Array.isArray(value)) return [];
    return value.map((option) =>
        typeof option === 'string' ? { label: option, value: option } : (option as ChoiceOption),
    );
}

export function choiceGroupSize(props: Record<string, unknown>): { width: number; height: number } {
    const options = choiceOptions(props.options);
    const horizontal = props.direction !== 'vertical';
    const gap = number(props.gap, 12);
    const fontSize = number(props.fontSize, 14);
    const optionHeight = number(props.optionHeight, 28);
    const naturalWidth =
        options.reduce((total, option) => total + estimatedOptionWidth(option.label, fontSize), 0) +
        gap * Math.max(0, options.length - 1);
    const naturalHeight = options.length * optionHeight + gap * Math.max(0, options.length - 1);
    return {
        width: componentWidth(props, horizontal ? naturalWidth : 200),
        height: componentHeight(props, horizontal ? optionHeight : naturalHeight),
    };
}

export function drawChoiceGroup(
    context: CanvasRenderingContext2D,
    props: ChoiceGroupProps,
    kind: 'radio' | 'checkbox',
): void {
    const options = choiceOptions(props.options);
    const horizontal = props.direction !== 'vertical';
    const gap = number(props.gap, 12);
    const fontSize = number(props.fontSize, 14);
    const optionHeight = number(props.optionHeight, 28);
    const selected = props.value;
    context.font = `${fontSize}px sans-serif`;
    context.textBaseline = 'middle';
    context.lineWidth = 1;

    let offsetX = 0;
    let offsetY = 0;
    for (const option of options) {
        const labelWidth = Math.max(24, context.measureText(option.label).width);
        const isSelected = Array.isArray(selected)
            ? selected.includes(option.value)
            : selected === option.value;
        const centerY = offsetY + optionHeight / 2;
        const controlX = offsetX + 9;
        const disabled = Boolean(props.disabled) || option.disabled === true;
        context.strokeStyle = disabled
            ? string(
                  props.disabledColor,
                  themeColor(context, '--canvas-ui-choice-disabled', '#bfbfbf'),
              )
            : string(
                  props.borderColor,
                  themeColor(context, '--canvas-ui-choice-border', '#d9d9d9'),
              );
        context.fillStyle = disabled
            ? themeColor(context, '--canvas-ui-choice-disabled-background', '#f5f5f5')
            : '#fff';

        if (kind === 'radio') {
            context.beginPath();
            context.arc(controlX, centerY, 8, 0, Math.PI * 2);
            context.fill();
            context.stroke();
            if (isSelected) {
                context.beginPath();
                context.arc(controlX, centerY, 4, 0, Math.PI * 2);
                context.fillStyle = string(
                    props.activeColor,
                    themeColor(context, '--canvas-ui-choice-active', '#1677ff'),
                );
                context.fill();
            }
        } else {
            context.beginPath();
            context.roundRect(offsetX + 1, centerY - 8, 16, 16, 3);
            context.fill();
            context.stroke();
            if (isSelected) {
                context.strokeStyle = string(
                    props.activeColor,
                    themeColor(context, '--canvas-ui-choice-active', '#1677ff'),
                );
                context.lineWidth = 2;
                context.beginPath();
                context.moveTo(offsetX + 5, centerY);
                context.lineTo(offsetX + 8, centerY + 3);
                context.lineTo(offsetX + 13, centerY - 4);
                context.stroke();
                context.lineWidth = 1;
            }
        }

        context.fillStyle = disabled
            ? string(
                  props.disabledColor,
                  themeColor(context, '--canvas-ui-choice-disabled', '#bfbfbf'),
              )
            : string(props.color, themeColor(context, '--canvas-ui-choice-color', '#333'));
        context.fillText(option.label, offsetX + 23, centerY);
        if (horizontal) {
            offsetX += Math.max(24, labelWidth) + 24 + gap;
        } else {
            offsetY += optionHeight + gap;
        }
    }
}

export function choiceAt(
    props: Record<string, unknown>,
    x: number,
    y: number,
): ChoiceOption | undefined {
    const options = choiceOptions(props.options);
    const horizontal = props.direction !== 'vertical';
    const gap = number(props.gap, 12);
    const fontSize = number(props.fontSize, 14);
    const optionHeight = number(props.optionHeight, 28);
    const size = choiceGroupSize(props);
    if (horizontal) {
        let offsetX = 0;
        for (const option of options) {
            const optionWidth = estimatedOptionWidth(option.label, fontSize);
            if (x >= offsetX && x <= offsetX + optionWidth && y >= 0 && y <= size.height)
                return option;
            offsetX += optionWidth + gap;
        }
        return undefined;
    }
    const row = Math.floor(y / (optionHeight + gap));
    const rowOffset = y - row * (optionHeight + gap);
    return rowOffset <= optionHeight && x >= 0 && x <= size.width ? options[row] : undefined;
}

function estimatedOptionWidth(label: string, fontSize: number): number {
    const textWidth = Array.from(label).reduce((total, character) => {
        const isWide = /[\u2e80-\u9fff\uac00-\ud7af]/u.test(character);
        return total + fontSize * (isWide ? 1 : 0.62);
    }, 0);
    return Math.max(24, textWidth) + 24;
}
