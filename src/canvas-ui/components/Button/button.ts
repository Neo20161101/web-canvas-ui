import type { TransformProps } from '../../types';
import { number, string, themeColor } from '../draw-utils';
import { createComponent } from '../shared';

export interface ButtonProps extends TransformProps {
    children?: string | number;
    text?: string;
    width?: number;
    height?: number;
    disabled?: boolean;
    backgroundColor?: string;
    fontColor?: string;
    borderColor?: string;
    borderRadius?: number;
    fontSize?: number;
    onClick?: () => void;
}

export const Button = createComponent<ButtonProps>('button');

/** Public props plus the engine-injected press state consumed by the draw layer. */
export type ButtonDrawProps = ButtonProps & { pressed?: boolean };

export function drawButton(context: CanvasRenderingContext2D, props: ButtonDrawProps): void {
    const width = number(props.width, 120);
    const height = number(props.height, 40);
    const radius = number(props.borderRadius, 6);
    context.beginPath();
    context.roundRect(0, 0, width, height, radius);
    context.fillStyle = props.disabled
        ? themeColor(context, '--canvas-ui-button-disabled-background', '#f5f5f5')
        : props.pressed
          ? themeColor(context, '--canvas-ui-button-pressed-background', '#0958d9')
          : string(
                props.backgroundColor,
                themeColor(context, '--canvas-ui-button-background', '#1677ff'),
            );
    context.fill();
    if (props.borderColor) {
        context.strokeStyle = string(
            props.borderColor,
            themeColor(context, '--canvas-ui-button-border', '#1677ff'),
        );
        context.stroke();
    }
    context.font = `${number(props.fontSize, 15)}px sans-serif`;
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillStyle = string(
        props.fontColor,
        themeColor(context, '--canvas-ui-button-color', '#fff'),
    );
    context.fillText(String(props.text ?? ''), width / 2, height / 2);
    context.textAlign = 'left';
}
