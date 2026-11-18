import type { InputProps, InputDrawProps } from '../Input';
import { drawInput } from '../Input';
import { createComponent } from '../shared';

export interface TextareaProps extends Omit<InputProps, 'type'> {
    rows?: number;
}

export const Textarea = createComponent<TextareaProps>('textarea');

/** Public props plus the engine-injected caret/scroll state consumed by the draw layer. */
export type TextareaDrawProps = Omit<InputDrawProps, 'type'> & { rows?: number };

export function drawTextarea(context: CanvasRenderingContext2D, props: TextareaDrawProps): void {
    drawInput(context, props, true);
}
