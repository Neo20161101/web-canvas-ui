export function number(value: unknown, fallback: number): number {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export function string(value: unknown, fallback: string): string {
    return typeof value === 'string' ? value : fallback;
}

/** Measures rendered text width; drawing passes a context, layout passes `measureTextWidth`. */
export type TextMeasurer = (text: string) => number;

/** Baseline-to-baseline multiplier, shared by Text drawing and the pass that sizes it. */
export const TEXT_LINE_HEIGHT = 1.2;

const ELLIPSIS = '…';

// CJK ideographs, kana and Hangul syllables: each of them is one em wide, and a run of them may be
// broken between any two characters - unlike a Latin word, which moves to the next line whole.
const WIDE_CHARACTER = /[\u2e80-\u9fff\uac00-\ud7af]/u;

function byContext(context: CanvasRenderingContext2D): TextMeasurer {
    return (text) => context.measureText(text).width;
}

function breakIntoLines(measure: TextMeasurer, text: string, width: number): string[] {
    const lines: string[] = [];
    for (const paragraph of text.split('\n')) {
        let line = '';
        for (const word of paragraph.split(/(\s+)/).filter(Boolean)) {
            const candidate = line + word;
            if (line && measure(candidate) <= width) {
                line = candidate;
                continue;
            }
            if (!line && /^\s+$/.test(word)) continue;
            if (!line && measure(word) <= width) {
                line = word;
                continue;
            }
            if (line && !WIDE_CHARACTER.test(word)) {
                // A Latin word that no longer fits is moved down whole; a CJK run instead keeps
                // filling this line, because that is what the browser does to the text of a
                // textarea, and a caret offset is resolved against those very line breaks.
                lines.push(line.trimEnd());
                line = '';
            }
            for (const character of Array.from(word)) {
                if (line && measure(line + character) > width) {
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

/** Longest prefix of `text` that still fits `maxWidth` once the ellipsis is appended to it. */
function ellipsizedTo(measure: TextMeasurer, text: string, maxWidth: number): string {
    const characters = Array.from(text);
    let low = 0;
    let high = characters.length;
    while (low < high) {
        const middle = Math.ceil((low + high) / 2);
        const candidate = characters.slice(0, middle).join('') + ELLIPSIS;
        if (measure(candidate) <= maxWidth) low = middle;
        else high = middle - 1;
    }
    return characters.slice(0, low).join('') + ELLIPSIS;
}

function truncateTo(measure: TextMeasurer, text: string, maxWidth: number): string {
    if (!text) return text;
    if (measure(text) <= maxWidth) return text;
    return ellipsizedTo(measure, text, maxWidth);
}

function clampToLines(
    measure: TextMeasurer,
    text: string,
    width: number,
    maxLines: number,
): string[] {
    const lines = breakIntoLines(measure, text, width);
    if (lines.length <= maxLines) return lines;
    const visible = lines.slice(0, maxLines);
    // Shorten the last visible line rather than dropping it: the ellipsis has to borrow room from
    // the very line it terminates.
    visible[maxLines - 1] = ellipsizedTo(measure, visible[maxLines - 1], width);
    return visible;
}

/**
 * Wraps `text` into lines at most `width` wide, keeping at most `maxLines` of them; a clamped
 * block ends with an ellipsis instead of silently losing the rest. `maxLines` <= 0 means "no
 * limit"; any positive limit keeps at least one line. Callers supply the measurer so that drawing
 * (live context) and layout ({@link measureTextWidth}) share one algorithm and therefore one result.
 */
export function measureLines(
    measure: TextMeasurer,
    text: string,
    width: number,
    maxLines = 0,
): string[] {
    if (!(width > 0)) return [text];
    if (!(maxLines > 0)) return breakIntoLines(measure, text, width);
    return clampToLines(measure, text, width, Math.max(1, Math.round(maxLines)));
}

export function wrapText(context: CanvasRenderingContext2D, text: string, width: number): string[] {
    return breakIntoLines(byContext(context), text, width);
}

/**
 * Truncates `text` with a trailing ellipsis so it fits within `maxWidth` for the
 * context's current font. Display-only labels (buttons, tabs, dropdown rows…) use
 * this to stay inside their box; editable controls clip instead.
 */
export function fitText(context: CanvasRenderingContext2D, text: string, maxWidth: number): string {
    return truncateTo(byContext(context), text, maxWidth);
}

let cachedMeasureContext: CanvasRenderingContext2D | null = null;
let measureContextResolved = false;
// Assigning `font` re-resolves the font list, which is the expensive half of a measurement. Runs of
// calls almost always share one font, so the assignment is skipped while the string is unchanged.
let appliedMeasureFont = '';

function getMeasureContext(): CanvasRenderingContext2D | null {
    if (!measureContextResolved) {
        measureContextResolved = true;
        if (typeof document !== 'undefined') {
            cachedMeasureContext = document.createElement('canvas').getContext('2d');
        }
    }
    return cachedMeasureContext;
}

/**
 * Measures the rendered width of `text` for a given CSS `font` string using a
 * shared offscreen context. Draw, hit-test and layout code must all go through
 * this helper so their width calculations stay byte-for-byte identical.
 * Falls back to a deterministic estimate when no canvas is available (SSR/tests).
 */
export function measureTextWidth(text: string, font: string): number {
    const context = getMeasureContext();
    if (!context) return estimateTextWidth(text, font);
    if (appliedMeasureFont !== font) {
        context.font = font;
        appliedMeasureFont = font;
    }
    return context.measureText(text).width;
}

function estimateTextWidth(text: string, font: string): number {
    const fontSize = parseFloat(font) || 14;
    return Array.from(text).reduce((total, character) => {
        const isWide = WIDE_CHARACTER.test(character);
        return total + fontSize * (isWide ? 1 : 0.62);
    }, 0);
}

let cachedScrollbarWidth: number | null = null;

/**
 * Width a classic vertical scrollbar occupies, 0 on platforms that float scrollbars over the
 * content. Measured once from a throwaway scroller and cached, the same way the measurement context
 * is; without a document (SSR, unit tests) there is nothing to reserve.
 */
export function verticalScrollbarWidth(): number {
    if (cachedScrollbarWidth !== null) return cachedScrollbarWidth;
    cachedScrollbarWidth = 0;
    const body = typeof document === 'undefined' ? null : document.body;
    if (!body) return cachedScrollbarWidth;
    const host = document.createElement('div');
    host.style.position = 'absolute';
    host.style.top = '-9999px';
    host.style.width = '100px';
    host.style.height = '100px';
    host.style.overflowY = 'scroll';
    const inner = document.createElement('div');
    inner.style.width = '10px';
    inner.style.height = '10px';
    host.appendChild(inner);
    body.appendChild(host);
    cachedScrollbarWidth = Math.max(0, host.offsetWidth - host.clientWidth);
    host.remove();
    return cachedScrollbarWidth;
}

interface CachedThemeColor {
    generation: number;
    value: string;
}

// Reads of CSS custom properties go through getComputedStyle, which is expensive enough that
// calling it for every colour of every node on every frame measurably slows rendering. Results are
// memoised per canvas element (a WeakMap so a destroyed canvas never leaks) and tagged with a
// global generation counter; bumping the generation invalidates every entry at once.
let themeGeneration = 0;
const themeColorCache = new WeakMap<HTMLCanvasElement, Map<string, CachedThemeColor>>();

/**
 * Drops every cached theme colour so the next read recomputes it. Call this whenever the theme can
 * change (for example from a MutationObserver watching the canvas / ancestor `class` or `style`).
 */
export function invalidateThemeColors(): void {
    themeGeneration += 1;
}

export function themeColor(
    context: CanvasRenderingContext2D,
    token: string,
    fallback: string,
): string {
    if (typeof getComputedStyle !== 'function') return fallback;
    const canvas = context.canvas;
    let byToken = themeColorCache.get(canvas);
    if (!byToken) {
        byToken = new Map();
        themeColorCache.set(canvas, byToken);
    }
    const cached = byToken.get(token);
    if (cached && cached.generation === themeGeneration) return cached.value;
    const value = getComputedStyle(canvas).getPropertyValue(token).trim() || fallback;
    byToken.set(token, { generation: themeGeneration, value });
    return value;
}
