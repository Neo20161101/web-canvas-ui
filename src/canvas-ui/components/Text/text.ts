import type { TransformProps } from '../../types';
import { number, string, themeColor, wrapText } from '../draw-utils';
import { createComponent } from '../shared';

export interface TextProps extends TransformProps {
    text?: string;
    children?: string | number;
    fontSize?: number;
    width?: number;
    fontFamily?: string;
    color?: string;
    baseline?: CanvasTextBaseline;
    textAlign?: CanvasTextAlign;
}

export const Text = createComponent<TextProps>('text');

export function drawText(context: CanvasRenderingContext2D, props: TextProps): void {
    const fontSize = number(props.fontSize, 16);
    context.font = `${fontSize}px ${string(props.fontFamily, 'sans-serif')}`;
    context.textBaseline = props.baseline ?? 'top';
    const textAlign =
        props.textAlign === 'center' || props.textAlign === 'right' ? props.textAlign : 'left';
    context.textAlign = textAlign;
    context.fillStyle = string(props.color, themeColor(context, '--canvas-ui-text-color', '#333'));
    const text = String(props.text ?? '');
    const width = number(props.width, NaN);
    if (!Number.isFinite(width) || width <= 0) {
        context.textAlign = 'left';
        context.fillText(text, 0, 0);
        return;
    }

    const anchorX = textAlign === 'center' ? width / 2 : textAlign === 'right' ? width : 0;
    wrapText(context, text, width).forEach((line, index) => {
        context.fillText(line, anchorX, index * fontSize * 1.2);
    });
    context.textAlign = 'left';
}
