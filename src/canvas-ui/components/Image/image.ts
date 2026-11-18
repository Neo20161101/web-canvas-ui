import type { TransformProps } from '../../types';
import { createComponent } from '../shared';
import { getCanvasImage } from '../../image-assets';
import { number } from '../draw-utils';

export interface ImageProps extends TransformProps {
    src: string;
    width: number;
    height: number;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    onError?: (error: Error) => void;
}

export const Image = createComponent<ImageProps>('image');

export function drawImage(context: CanvasRenderingContext2D, props: ImageProps): void {
    const src = props.src;
    if (typeof src !== 'string' || !src) return;
    const image = getCanvasImage(src);
    if (!image) return;
    const width = number(props.width, image.naturalWidth);
    const height = number(props.height, image.naturalHeight);
    const fit = props.objectFit ?? 'contain';
    context.save();
    context.beginPath();
    context.rect(0, 0, width, height);
    context.clip();
    if (fit === 'fill') {
        context.drawImage(image, 0, 0, width, height);
        context.restore();
        return;
    }

    const scale =
        fit === 'cover'
            ? Math.max(width / image.naturalWidth, height / image.naturalHeight)
            : fit === 'none'
              ? 1
              : fit === 'scale-down'
                ? Math.min(1, width / image.naturalWidth, height / image.naturalHeight)
                : Math.min(width / image.naturalWidth, height / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    if (fit === 'cover') {
        const sourceWidth = width / scale;
        const sourceHeight = height / scale;
        context.drawImage(
            image,
            (image.naturalWidth - sourceWidth) / 2,
            (image.naturalHeight - sourceHeight) / 2,
            sourceWidth,
            sourceHeight,
            0,
            0,
            width,
            height,
        );
        context.restore();
        return;
    }
    context.drawImage(
        image,
        (width - drawWidth) / 2,
        (height - drawHeight) / 2,
        drawWidth,
        drawHeight,
    );
    context.restore();
}
