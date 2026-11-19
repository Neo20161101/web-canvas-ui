import type { TransformProps } from '../../types';
import {
    TEXT_LINE_HEIGHT,
    measureLines,
    measureTextWidth,
    number,
    string,
    themeColor,
    type TextMeasurer,
} from '../draw-utils';
import { createComponent } from '../shared';

export interface TextProps extends TransformProps {
    text?: string;
    children?: string | number;
    fontSize?: number;
    /** Wrap width. Falls back to the box the parent container hands down when unset. */
    width?: number;
    /**
     * Maximum number of wrapped lines; the last one is cut with an ellipsis. Falls back to the number
     * of lines that fit the container's box, and to "no limit" when neither is declared.
     */
    maxLines?: number;
    fontFamily?: string;
    color?: string;
    baseline?: CanvasTextBaseline;
    textAlign?: CanvasTextAlign;
}

export interface TextBox {
    lines: string[];
    width: number;
    height: number;
}

/** Public props plus the content box a parent container hands down to this node. */
export type TextDrawProps = TextProps & {
    _availableWidth?: number;
    _availableHeight?: number;
};

const DEFAULT_FONT_SIZE = 16;

export const Text = createComponent<TextProps>('text');

/**
 * Whole lines that fit `height`, floored so a half-visible last line is never painted. Returns 0 when
 * no height is known, which {@link measureLines} reads as "no limit".
 */
function lineBudget(height: number, fontSize: number): number {
    if (!(height > 0)) return 0;
    return Math.max(1, Math.floor(height / (fontSize * TEXT_LINE_HEIGHT)));
}

/**
 * Resolves `props` into the lines it renders and the box they occupy. {@link drawText} paints these
 * lines and the layout pass sizes the node from the same result, so a Text node's reported height can
 * never disagree with the glyphs it actually draws.
 *
 * A box handed down by the container is the fallback, not the override: declaring `width` or
 * `maxLines` keeps the author in charge, so a node can stay narrower than its cell on purpose.
 */
export function measureTextBox(props: TextDrawProps): TextBox {
    const fontSize = number(props.fontSize, DEFAULT_FONT_SIZE);
    const font = `${fontSize}px ${string(props.fontFamily, 'sans-serif')}`;
    const measure: TextMeasurer = (text: string) => measureTextWidth(text, font);
    const text = String(props.text ?? '');
    const width = number(props.width, number(props._availableWidth, 0));
    const maxLines = number(
        props.maxLines,
        lineBudget(number(props._availableHeight, 0), fontSize),
    );
    const lines = measureLines(measure, text, width, maxLines);
    return {
        lines,
        width: width > 0 ? width : measure(text),
        height: lines.length * fontSize * TEXT_LINE_HEIGHT,
    };
}

export function drawText(context: CanvasRenderingContext2D, props: TextDrawProps): void {
    const fontSize = number(props.fontSize, DEFAULT_FONT_SIZE);
    context.font = `${fontSize}px ${string(props.fontFamily, 'sans-serif')}`;
    context.textBaseline = props.baseline ?? 'top';
    const textAlign =
        props.textAlign === 'center' || props.textAlign === 'right' ? props.textAlign : 'left';
    context.textAlign = textAlign;
    context.fillStyle = string(props.color, themeColor(context, '--canvas-ui-text-color', '#333'));
    const box = measureTextBox(props);
    const anchorX = textAlign === 'center' ? box.width / 2 : textAlign === 'right' ? box.width : 0;
    box.lines.forEach((line, index) => {
        context.fillText(line, anchorX, index * fontSize * TEXT_LINE_HEIGHT);
    });
    context.textAlign = 'left';
}
