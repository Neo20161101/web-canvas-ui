import type { TransformProps } from '../../types';
import { fitText, number, string, themeColor } from '../draw-utils';
import { drawIcon, type IconName } from '../Icon';
import { createComponent } from '../shared';

export interface UploadProps extends TransformProps {
    width?: number;
    height?: number;
    text?: string;
    icon?: IconName;
    iconSize?: number;
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
    context.fillStyle = string(
        props.backgroundColor,
        themeColor(context, '--canvas-ui-button-background', '#1677ff'),
    );
    context.fill();
    if (props.borderColor) {
        context.strokeStyle = string(props.borderColor, '#1677ff');
        context.stroke();
    }

    const label = string(props.text, 'Choose File');
    const color = string(props.textColor, themeColor(context, '--canvas-ui-button-color', '#fff'));
    const fontSize = number(props.fontSize, 15);
    const iconSize = number(props.iconSize, Math.round(fontSize * 1.1));
    const gap = 6;

    context.font = `${fontSize}px sans-serif`;
    context.textBaseline = 'middle';
    context.textAlign = 'left';
    const fittedLabel = fitText(context, label, Math.max(0, width - 12 - iconSize - gap));
    // A built-in glyph (defaults to the "upload" arrow; pass `icon` to customise) plus the
    // label, kept as one centred group that never spills outside the button box.
    const textWidth = fittedLabel ? context.measureText(fittedLabel).width : 0;
    const contentWidth = iconSize + (fittedLabel ? gap : 0) + textWidth;
    let cursorX = (width - contentWidth) / 2;
    const centerY = height / 2;

    context.save();
    context.translate(cursorX, centerY - iconSize / 2);
    drawIcon(context, { name: props.icon ?? 'upload', size: iconSize, color });
    context.restore();
    cursorX += iconSize + (fittedLabel ? gap : 0);

    context.fillStyle = color;
    context.fillText(fittedLabel, cursorX, centerY);
}
