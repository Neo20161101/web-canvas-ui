import { describe, expect, it } from 'vitest';
import { measureLines, measureTextWidth } from '../components/draw-utils';
import { measureTextBox } from '../components/Text';

describe('scratch: maxLines 1 with spaces', () => {
    const font = '16px sans-serif';
    const measure = (text: string) => measureTextWidth(text, font);
    const cases = [
        '你好世界',
        ' 你好世界',
        '  你好世界',
        '\u3000你好世界',
        '你好 世界',
        '你好世界 ',
        '你好世界\n',
        '你好\n世界',
        ' a b c',
        'hello world foo',
    ];
    it('prints', () => {
        for (const text of cases) {
            const lines = measureLines(measure, text, 500, 1);
            const box = measureTextBox({ text, width: 500, maxLines: 1 });
            console.log(
                `${JSON.stringify(text)} -> ${JSON.stringify(lines)} box.height=${String(box.height)}`,
            );
        }
        expect(true).toBe(true);
    });
});
