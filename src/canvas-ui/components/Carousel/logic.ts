export function carouselControlIndex(
    props: Record<string, unknown>,
    x: number,
    y: number,
    count: number,
    current: number,
    width: number,
    height: number,
): number | undefined {
    if (count < 2 || x < 0 || x > width || y < 0 || y > height) return undefined;
    if (props.showArrows !== false && Math.abs(y - height / 2) <= 20) {
        if (x <= 42) return current - 1;
        if (x >= width - 42) return current + 1;
    }
    if (props.showDots !== false && y >= height - 26) {
        const gap = 14;
        const startX = (width - (count - 1) * gap) / 2;
        const index = Math.round((x - startX) / gap);
        if (index >= 0 && index < count && Math.abs(x - (startX + index * gap)) <= 9) {
            return index;
        }
    }
    return undefined;
}

export function carouselIndex(
    requested: number,
    _current: number,
    count: number,
    loop: boolean,
): number {
    if (count <= 0) return 0;
    return loop
        ? ((requested % count) + count) % count
        : Math.max(0, Math.min(count - 1, requested));
}
