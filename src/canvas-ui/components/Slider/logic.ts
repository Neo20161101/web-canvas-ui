import { number } from '../draw-utils';

export function sliderValueAt(
    props: Record<string, unknown>,
    width: number,
    localX: number,
): number | undefined {
    const thumbRadius = Math.min(8, number(props.height, 32) / 3);
    const min = number(props.min, 0);
    const max = number(props.max, 100);
    if (max <= min) return undefined;
    const step = Math.max(Number.EPSILON, number(props.step, 1));
    const ratio = Math.max(
        0,
        Math.min(1, (localX - thumbRadius) / Math.max(1, width - thumbRadius * 2)),
    );
    const rawValue = min + ratio * (max - min);
    return Math.max(min, Math.min(max, min + Math.round((rawValue - min) / step) * step));
}
