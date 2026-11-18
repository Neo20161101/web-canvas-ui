import type { TransformProps } from '../../types';
import { number, string, themeColor } from '../draw-utils';
import { createComponent } from '../shared';

export interface UploadProps extends TransformProps {
    width?: number;
    height?: number;
    text?: string;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderRadius?: number;
    fontSize?: number;
    onChange?: (files: File[]) => void;
}

export const Upload = createComponent<UploadProps>('upload');

export function drawUpload(context: CanvasRenderingContext2D, props: UploadProps): void {
    const width = number(props.width, 120);
    const height = number(props.height, 40);
    const radius = number(props.borderRadius, 6);
    context.beginPath();
    context.roundRect(0, 0, width, height, radius);
    context.fillStyle = props.disabled
        ? themeColor(context, '--canvas-ui-button-disabled-background', '#f5f5f5')
        : string(
              props.backgroundColor,
              themeColor(context, '--canvas-ui-button-background', '#1677ff'),
          );
    context.fill();
    if (props.borderColor) {
        context.strokeStyle = string(props.borderColor, '#1677ff');
        context.stroke();
    }
    context.font = `${number(props.fontSize, 15)}px sans-serif`;
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillStyle = props.disabled
        ? themeColor(context, '--canvas-ui-button-disabled-color', '#bfbfbf')
        : string(props.textColor, themeColor(context, '--canvas-ui-button-color', '#fff'));
    context.fillText(string(props.text, '选择文件'), width / 2, height / 2);
    context.textAlign = 'left';
}
