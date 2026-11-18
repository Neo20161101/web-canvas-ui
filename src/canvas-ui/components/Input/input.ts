import type { TransformProps } from '../../types';
import { number, string, themeColor, wrapText } from '../draw-utils';
import { createComponent } from '../shared';

export interface InputProps extends TransformProps {
    width?: number;
    height?: number;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    bgColor?: string;
    borderColor?: string;
    focusBorderColor?: string;
    borderRadius?: number;
    padding?: number;
    disabled?: boolean;
    maxLength?: number;
    type?: 'text' | 'password' | 'number';
    onChange?: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
}

export const Input = createComponent<InputProps>('input');

/** Public props plus the engine-injected caret/scroll state consumed by the draw layer. */
export type InputDrawProps = InputProps & {
    focused?: boolean;
    cursorPos?: number;
    _scrollTop?: number;
    _scrollHeight?: number;
};

export function drawInput(
    context: CanvasRenderingContext2D,
    props: InputDrawProps,
    multiline = false,
): void {
    const width = number(props.width, 200);
    const height = number(props.height, 36);
    const radius = Math.max(0, Math.min(number(props.borderRadius, 4), width / 2, height / 2));
    const padding = number(props.padding, 8);
    const value = String(props.value ?? '');
    const placeholder = String(props.placeholder ?? '');
    const text = props.type === 'password' ? '•'.repeat(value.length) : value;

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
    context.lineWidth = 1;
    context.stroke();

    context.save();
    context.beginPath();
    context.rect(0, 0, width, height);
    context.clip();
    const fontSize = number(props.fontSize, 14);
    context.font = `${fontSize}px ${string(props.fontFamily, 'sans-serif')}`;
    context.textBaseline = multiline ? 'top' : 'middle';
    context.fillStyle = value
        ? string(props.color, themeColor(context, '--canvas-ui-input-color', '#333'))
        : themeColor(context, '--canvas-ui-input-placeholder-color', '#999');
    if (multiline) {
        const lineHeight = fontSize * 1.35;
        const content = text || placeholder;
        const contentWidth = Math.max(1, width - padding * 2 - 6);
        const lines = wrapText(context, content, contentWidth);
        const contentHeight = Math.max(
            number(props._scrollHeight, 0),
            lines.length * lineHeight + padding * 2,
        );
        const scrollTop = Math.max(
            0,
            Math.min(contentHeight - height, number(props._scrollTop, 0)),
        );
        lines.forEach((line, index) => {
            context.fillText(line, padding, padding + index * lineHeight - scrollTop);
        });
        if (contentHeight > height)
            drawTextareaScrollbar(context, width, height, contentHeight, scrollTop);
    } else {
        context.fillText(text || placeholder, padding, height / 2);
    }

    if (props.focused && !props.disabled) {
        const cursorPosition = number(props.cursorPos, value.length);
        const cursorLines = multiline
            ? wrapText(context, text.slice(0, cursorPosition), Math.max(1, width - padding * 2 - 6))
            : text.slice(0, cursorPosition).split('\n');
        const cursorWidth = context.measureText(cursorLines[cursorLines.length - 1] ?? '').width;
        const cursorY = multiline
            ? padding + (cursorLines.length - 1) * fontSize * 1.35 - number(props._scrollTop, 0)
            : (height - fontSize) / 2;
        context.fillStyle = string(
            props.color,
            themeColor(context, '--canvas-ui-input-color', '#333'),
        );
        if (!multiline || (cursorY + fontSize >= 0 && cursorY <= height)) {
            context.fillRect(padding + cursorWidth, cursorY, 1, fontSize);
        }
    }
    context.restore();
}

function drawTextareaScrollbar(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    contentHeight: number,
    scrollTop: number,
): void {
    const trackWidth = 5;
    const thumbHeight = Math.min(height, Math.max(16, (height * height) / contentHeight));
    const maxScroll = contentHeight - height;
    const thumbY = maxScroll > 0 ? ((height - thumbHeight) * scrollTop) / maxScroll : 0;
    context.fillStyle = 'rgba(0, 0, 0, 0.08)';
    context.fillRect(width - trackWidth, 0, trackWidth, height);
    context.fillStyle = 'rgba(0, 0, 0, 0.35)';
    context.beginPath();
    context.roundRect(width - trackWidth + 1, thumbY, trackWidth - 2, thumbHeight, 2);
    context.fill();
}
