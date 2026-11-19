import { describe, expect, it } from 'vitest';
import { drawInput } from '../components/Input';
import type { InputDrawProps } from '../components/Input';

// 5px per glyph keeps the wrapping arithmetic readable, and the recorded fillRect calls expose where
// the caret was actually painted: the caret is the only 1px-wide rectangle in the drawing.
function makeContext(): {
    context: CanvasRenderingContext2D;
    rects: number[][];
    lines: { text: string; y: number }[];
} {
    const rects: number[][] = [];
    const lines: { text: string; y: number }[] = [];
    const context = {
        font: '',
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        textBaseline: '',
        canvas: {},
        beginPath: () => {},
        closePath: () => {},
        roundRect: () => {},
        rect: () => {},
        clip: () => {},
        save: () => {},
        restore: () => {},
        fill: () => {},
        stroke: () => {},
        fillRect: (x: number, y: number, w: number, h: number) => rects.push([x, y, w, h]),
        fillText: (text: string, _x: number, y: number) => lines.push({ text, y }),
        measureText: (text: string) => ({ width: text.length * 5 }),
    };
    return { context: context as unknown as CanvasRenderingContext2D, rects, lines };
}

/** Draws a focused textarea and returns the caret plus the lines that were painted. */
function caretOf(props: InputDrawProps): {
    caret?: number[];
    lines: { text: string; y: number }[];
} {
    const { context, rects, lines } = makeContext();
    drawInput(context, { focused: true, ...props }, true);
    return { caret: rects.filter((rect) => rect[2] === 1).at(-1), lines };
}

const BASE: InputDrawProps = { width: 68, height: 100, padding: 8, fontSize: 10 };
// 68 - 2 * 8 = 52 of usable width, 5px per glyph -> ten characters per line.
const LINE_HEIGHT = 10 * 1.35;

describe('textarea caret', () => {
    it('follows hard line breaks down the box', () => {
        const props = { ...BASE, value: 'aa\nbb\ncc' };
        expect(caretOf({ ...props, cursorPos: 0 }).caret?.[1]).toBe(8);
        expect(caretOf({ ...props, cursorPos: 3 }).caret?.[1]).toBe(8 + LINE_HEIGHT);
        expect(caretOf({ ...props, cursorPos: 9 }).caret?.[1]).toBe(8 + 2 * LINE_HEIGHT);
    });

    it('paints the caret on the line the text itself was wrapped onto', () => {
        // A soft-wrapped paragraph: the caret is resolved from a character index, so its row has to
        // come out of the same wrapping the painter used, or it lands a line away from the glyph.
        const props = { ...BASE, value: 'a'.repeat(24) };
        for (const cursorPos of [0, 9, 11, 19, 23]) {
            const { caret, lines } = caretOf({ ...props, cursorPos });
            const charactersPerLine = 10;
            const row = Math.floor(cursorPos / charactersPerLine);
            expect(caret).toBeDefined();
            expect(caret?.[1]).toBe(lines[row]?.y);
            expect(caret?.[0]).toBe(8 + (cursorPos % charactersPerLine) * 5);
        }
    });

    it('scrolls the caret together with the text', () => {
        const props: InputDrawProps = {
            ...BASE,
            value: 'a'.repeat(60),
            _scrollHeight: 200,
            _scrollTop: 30,
            cursorPos: 45,
        };
        const { caret, lines } = caretOf(props);
        // Line 4 is the line the offset sits on, and both it and the caret carry the scroll offset.
        expect(caret?.[1]).toBe(lines[4]?.y);
        expect(caret?.[1]).toBe(8 + 4 * LINE_HEIGHT - 30);
    });

    it('keeps the caret off the box once it is scrolled out of view', () => {
        const { caret } = caretOf({
            ...BASE,
            height: 30,
            value: 'aa\nbb\ncc\ndd',
            cursorPos: 12,
        });
        expect(caret).toBeUndefined();
    });
});
