import type { TransformProps } from '../../types';
import { fitText, number, themeColor } from '../draw-utils';
import { createComponent } from '../shared';

export interface DialogProps extends TransformProps {
    open: boolean;
    width?: number;
    height?: number;
    title?: string;
    confirmText?: string;
    cancelText?: string;
    closeOnBackdrop?: boolean;
    children?: unknown;
    onConfirm?: () => void;
    onCancel?: () => void;
}

export const Dialog = createComponent<DialogProps>('dialog');

/** Public props plus the engine-injected viewport size consumed by the draw layer. */
export type DialogDrawProps = DialogProps & { _viewportWidth?: number; _viewportHeight?: number };

export function drawDialog(context: CanvasRenderingContext2D, props: DialogDrawProps): void {
    const viewportWidth = number(props._viewportWidth, context.canvas.width);
    const viewportHeight = number(props._viewportHeight, context.canvas.height);
    const width = number(props.width, 420);
    const height = number(props.height, 240);
    const x = (viewportWidth - width) / 2;
    const y = (viewportHeight - height) / 2;
    context.fillStyle = themeColor(context, '--canvas-ui-dialog-mask', 'rgba(0, 0, 0, 0.45)');
    context.fillRect(0, 0, viewportWidth, viewportHeight);
    context.fillStyle = themeColor(context, '--canvas-ui-dialog-background', '#fff');
    context.beginPath();
    context.roundRect(x, y, width, height, 8);
    context.fill();
    context.fillStyle = themeColor(context, '--canvas-ui-dialog-title-color', '#1f1f1f');
    context.font = '600 16px sans-serif';
    context.textBaseline = 'middle';
    context.fillText(
        fitText(context, String(props.title ?? 'Confirm'), Math.max(0, width - 48)),
        x + 24,
        y + 28,
    );
    context.strokeStyle = themeColor(context, '--canvas-ui-dialog-border', '#f0f0f0');
    context.beginPath();
    context.moveTo(x, y + 56);
    context.lineTo(x + width, y + 56);
    context.moveTo(x, y + height - 56);
    context.lineTo(x + width, y + height - 56);
    context.stroke();
    drawDialogButton(
        context,
        x + width - 196,
        y + height - 44,
        80,
        32,
        String(props.cancelText ?? 'Cancel'),
        false,
    );
    drawDialogButton(
        context,
        x + width - 104,
        y + height - 44,
        80,
        32,
        String(props.confirmText ?? 'OK'),
        true,
    );
}

function drawDialogButton(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    primary: boolean,
): void {
    context.beginPath();
    context.roundRect(x, y, width, height, 6);
    context.fillStyle = primary
        ? themeColor(context, '--canvas-ui-dialog-confirm-background', '#1677ff')
        : themeColor(context, '--canvas-ui-dialog-cancel-background', '#fff');
    context.fill();
    context.strokeStyle = primary
        ? themeColor(context, '--canvas-ui-dialog-confirm-background', '#1677ff')
        : themeColor(context, '--canvas-ui-dialog-border', '#d9d9d9');
    context.stroke();
    context.fillStyle = primary
        ? themeColor(context, '--canvas-ui-dialog-confirm-color', '#fff')
        : themeColor(context, '--canvas-ui-dialog-cancel-color', '#333');
    context.font = '14px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(
        fitText(context, label, Math.max(0, width - 16)),
        x + width / 2,
        y + height / 2,
    );
    context.textAlign = 'left';
}
