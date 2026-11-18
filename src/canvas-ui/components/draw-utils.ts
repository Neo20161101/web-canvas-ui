export function number(value: unknown, fallback: number): number {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export function string(value: unknown, fallback: string): string {
    return typeof value === 'string' ? value : fallback;
}

export function wrapText(context: CanvasRenderingContext2D, text: string, width: number): string[] {
    const lines: string[] = [];
    for (const paragraph of text.split('\n')) {
        let line = '';
        for (const word of paragraph.split(/(\s+)/).filter(Boolean)) {
            const candidate = line + word;
            if (line && context.measureText(candidate).width <= width) {
                line = candidate;
                continue;
            }
            if (!line && /^\s+$/.test(word)) continue;
            if (!line && context.measureText(word).width <= width) {
                line = word;
                continue;
            }
            if (line) {
                lines.push(line.trimEnd());
                line = '';
            }
            for (const character of Array.from(word)) {
                if (line && context.measureText(line + character).width > width) {
                    lines.push(line.trimEnd());
                    line = '';
                }
                line += character;
            }
        }
        lines.push(line);
    }
    return lines;
}

export function themeColor(
    context: CanvasRenderingContext2D,
    token: string,
    fallback: string,
): string {
    if (typeof getComputedStyle !== 'function') return fallback;
    return getComputedStyle(context.canvas).getPropertyValue(token).trim() || fallback;
}
