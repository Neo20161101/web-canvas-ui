import { describe, expect, it } from 'vitest';
import { measureLines, number, string, wrapText } from '../components/draw-utils';
import { componentHeight, componentWidth } from '../components/size';

// A measureText stub: every glyph is treated as 5px wide so wrapping is deterministic.
function makeContext(): CanvasRenderingContext2D {
    return {
        measureText: (text: string) => ({ width: text.length * 5 }),
    } as unknown as CanvasRenderingContext2D;
}

describe('number coercion', () => {
    it('returns finite numbers as-is', () => {
        expect(number(5, 1)).toBe(5);
        expect(number(0, 1)).toBe(0);
        expect(number(-3, 1)).toBe(-3);
    });

    it('falls back for non-numbers and non-finite values', () => {
        expect(number('x', 1)).toBe(1);
        expect(number(NaN, 1)).toBe(1);
        expect(number(Infinity, 1)).toBe(1);
        expect(number(undefined, 2)).toBe(2);
        expect(number(null, 7)).toBe(7);
    });
});

describe('string coercion', () => {
    it('keeps strings and falls back otherwise', () => {
        expect(string('a', 'x')).toBe('a');
        expect(string('', 'x')).toBe('');
        expect(string(1, 'x')).toBe('x');
        expect(string(undefined, 'x')).toBe('x');
    });
});

describe('wrapText', () => {
    it('keeps short paragraphs on a single line', () => {
        expect(wrapText(makeContext(), 'aa', 20)).toEqual(['aa']);
    });

    it('wraps words that exceed the width onto new lines', () => {
        // 'aa bb' is 5 chars -> width 25 > 20, so it splits into two lines.
        expect(wrapText(makeContext(), 'aa bb', 20)).toEqual(['aa', 'bb']);
    });

    it('breaks a single over-long word by characters', () => {
        expect(wrapText(makeContext(), 'aaaa', 15)).toEqual(['aaa', 'a']);
    });

    it('keeps filling the line with a CJK run that does not fit whole', () => {
        // 5px per glyph: 'aa ' is 15 wide, so one more character still fits before the break. A
        // Latin word would have moved down whole instead - the DOM wraps CJK runs this way, and a
        // textarea caret is resolved against those line breaks.
        expect(wrapText(makeContext(), 'aa 甲甲甲', 20)).toEqual(['aa 甲', '甲甲']);
    });

    it('honours explicit newlines', () => {
        expect(wrapText(makeContext(), 'a\nb', 20)).toEqual(['a', 'b']);
    });
});

describe('measureLines', () => {
    // Same 5px-per-glyph stub the wrapping tests use.
    const measure = (text: string) => text.length * 5;

    it('wraps without a limit when maxLines is omitted', () => {
        expect(measureLines(measure, 'aaaa', 15)).toEqual(['aaa', 'a']);
    });

    it('keeps at most maxLines lines and marks the cut with a single ellipsis', () => {
        expect(measureLines(measure, 'aaaa', 15, 1)).toEqual(['aa…']);
    });

    it('leaves a block untouched when it already fits the limit', () => {
        expect(measureLines(measure, 'aa', 20, 2)).toEqual(['aa']);
    });

    it('counts hard newlines against the limit', () => {
        // 'b' is the last visible line and still leaves room, but the dropped third line
        // has to be signalled.
        expect(measureLines(measure, 'a\nb\nc', 20, 2)).toEqual(['a', 'b…']);
    });

    it('treats a missing width as one unwrapped line', () => {
        expect(measureLines(measure, 'aa bb cc', 0, 2)).toEqual(['aa bb cc']);
    });

    it('never clamps below one line and ignores non-positive limits', () => {
        expect(measureLines(measure, 'aaaa', 15, 0.4)).toEqual(['aa…']);
        expect(measureLines(measure, 'aaaa', 15, -1)).toEqual(['aaa', 'a']);
    });
});

describe('size resolution', () => {
    it('prefers the size object over the flat width/height', () => {
        expect(componentWidth({ size: { width: 30 }, width: 50 }, 100)).toBe(30);
        expect(componentHeight({ size: { height: 30 }, height: 50 }, 100)).toBe(30);
    });

    it('falls back to width/height when no size object is present', () => {
        expect(componentWidth({ width: 50 }, 100)).toBe(50);
        expect(componentHeight({ height: 40 }, 100)).toBe(40);
    });

    it('uses the provided fallback when nothing is set', () => {
        expect(componentWidth({}, 100)).toBe(100);
        expect(componentHeight({}, 20)).toBe(20);
    });

    it('ignores array-valued size (not a size object)', () => {
        expect(componentWidth({ size: [1, 2], width: 8 }, 100)).toBe(8);
    });
});
