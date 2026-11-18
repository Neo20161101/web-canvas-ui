import type { TransformProps } from '../../types';
import { number, string, themeColor } from '../draw-utils';
import { createComponent } from '../shared';

export interface CarouselProps extends TransformProps {
    width: number;
    height: number;
    activeIndex?: number;
    defaultActiveIndex?: number;
    autoplay?: boolean;
    interval?: number;
    transitionDuration?: number;
    loop?: boolean;
    showArrows?: boolean;
    showDots?: boolean;
    backgroundColor?: string;
    arrowColor?: string;
    dotColor?: string;
    activeDotColor?: string;
    children?: unknown;
    onChange?: (index: number) => void;
}

export interface CarouselItemProps extends TransformProps {
    children?: unknown;
}

export const Carousel = createComponent<CarouselProps>('carousel');
export const CarouselItem = createComponent<CarouselItemProps>('carouselItem');

/** Public props plus the engine-injected item/active index consumed by the draw layer. */
export type CarouselDrawProps = CarouselProps & { _activeIndex?: number; _itemCount?: number };

export function drawCarousel(context: CanvasRenderingContext2D, props: CarouselDrawProps): void {
    const width = number(props.width, 300);
    const height = number(props.height, 180);
    context.fillStyle = string(props.backgroundColor, 'transparent');
    context.fillRect(0, 0, width, height);
}

export function drawCarouselControls(
    context: CanvasRenderingContext2D,
    props: CarouselDrawProps,
): void {
    const width = number(props.width, 300);
    const height = number(props.height, 180);
    const count = number(props._itemCount, 0);
    if (count < 2) return;

    if (props.showArrows !== false) {
        const color = string(
            props.arrowColor,
            themeColor(context, '--canvas-ui-carousel-arrow', '#fff'),
        );
        const centerY = height / 2;
        drawArrow(context, 22, centerY, -1, color);
        drawArrow(context, width - 22, centerY, 1, color);
    }

    if (props.showDots !== false) {
        const dotColor = string(
            props.dotColor,
            themeColor(context, '--canvas-ui-carousel-dot', 'rgba(255,255,255,0.65)'),
        );
        const activeColor = string(
            props.activeDotColor,
            themeColor(context, '--canvas-ui-carousel-active-dot', '#1677ff'),
        );
        const radius = 4;
        const gap = 14;
        const totalWidth = (count - 1) * gap;
        const startX = (width - totalWidth) / 2;
        const centerY = height - 14;
        context.beginPath();
        for (let index = 0; index < count; index++) {
            context.moveTo(startX + index * gap + radius, centerY);
            context.arc(startX + index * gap, centerY, radius, 0, Math.PI * 2);
        }
        context.fillStyle = dotColor;
        context.fill();
        const selected = Math.max(0, Math.min(count - 1, number(props._activeIndex, 0)));
        context.beginPath();
        context.arc(startX + selected * gap, centerY, radius, 0, Math.PI * 2);
        context.fillStyle = activeColor;
        context.fill();
    }
}

function drawArrow(
    context: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    direction: -1 | 1,
    color: string,
): void {
    context.fillStyle = 'rgba(0, 0, 0, 0.3)';
    context.beginPath();
    context.arc(centerX, centerY, 16, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(centerX - direction * 3, centerY - 6);
    context.lineTo(centerX + direction * 3, centerY);
    context.lineTo(centerX - direction * 3, centerY + 6);
    context.stroke();
}
