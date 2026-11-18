import { number } from './draw-utils';

export interface ComponentSize {
    width?: number;
    height?: number;
}

export function componentWidth(props: Record<string, unknown>, fallback: number): number {
    return number(sizeObject(props)?.width, number(props.width, fallback));
}

export function componentHeight(props: Record<string, unknown>, fallback: number): number {
    return number(sizeObject(props)?.height, number(props.height, fallback));
}

function sizeObject(props: Record<string, unknown>): ComponentSize | undefined {
    const size = props.size;
    if (typeof size !== 'object' || size === null || Array.isArray(size)) return undefined;
    return size as ComponentSize;
}
