import { describe, expect, it } from 'vitest';
import { toggleCollapseKeys } from '../components/Collapse/logic';
import { checkboxSelection, radioSelection } from '../components/ChoiceGroup/logic';
import { dropdownOptionAt, normalizeDropdownOptions } from '../components/Dropdown/logic';
import { carouselControlIndex, carouselIndex } from '../components/Carousel/logic';
import { sliderValueAt } from '../components/Slider/logic';

describe('toggleCollapseKeys', () => {
    it('adds a new key and toggles it off when already active', () => {
        expect(toggleCollapseKeys(['a'], 'b', false)).toEqual(['a', 'b']);
        expect(toggleCollapseKeys(['a', 'b'], 'a', false)).toEqual(['b']);
    });

    it('clears other keys in accordion mode', () => {
        expect(toggleCollapseKeys(['a'], 'b', true)).toEqual(['b']);
    });
});

describe('radioSelection', () => {
    const option = { label: 'X', value: 'x' };
    it('deselects when re-picking the active value', () => {
        expect(radioSelection('x', option)).toBeUndefined();
    });
    it('selects the new value otherwise', () => {
        expect(radioSelection('y', option)).toBe('x');
        expect(radioSelection(undefined, option)).toBe('x');
    });
});

describe('checkboxSelection', () => {
    const option = { label: 'X', value: 'x' };
    it('removes an already-selected value', () => {
        expect(checkboxSelection(['x'], option)).toEqual([]);
    });
    it('adds a value and filters out non-strings', () => {
        expect(checkboxSelection(['y'], option)).toEqual(['y', 'x']);
        expect(checkboxSelection(['y', 1], option)).toEqual(['y', 'x']);
        expect(checkboxSelection(undefined, option)).toEqual(['x']);
    });
});

describe('normalizeDropdownOptions / dropdownOptionAt', () => {
    it('expands string options and keeps object options', () => {
        expect(normalizeDropdownOptions(['a', { label: 'L', value: 'V' }])).toEqual([
            { label: 'a', value: 'a' },
            { label: 'L', value: 'V', disabled: false },
        ]);
    });

    it('preserves the disabled flag', () => {
        expect(
            normalizeDropdownOptions([{ label: 'L', value: 'V', disabled: true }])[0].disabled,
        ).toBe(true);
    });

    it('drops invalid entries and non-arrays', () => {
        expect(normalizeDropdownOptions([{ label: 1, value: 2 }])).toEqual([]);
        expect(normalizeDropdownOptions(['a', null, 5])).toEqual([{ label: 'a', value: 'a' }]);
        expect(normalizeDropdownOptions('nope')).toEqual([]);
    });

    it('indexes into the normalized list', () => {
        expect(dropdownOptionAt(['a', 'b'], 1)).toEqual({ label: 'b', value: 'b' });
        expect(dropdownOptionAt(['a'], 5)).toBeUndefined();
    });
});

describe('carouselIndex', () => {
    it('wraps around when looping', () => {
        expect(carouselIndex(5, 0, 3, true)).toBe(2);
        expect(carouselIndex(-1, 0, 3, true)).toBe(2);
    });
    it('clamps when not looping', () => {
        expect(carouselIndex(5, 0, 3, false)).toBe(2);
        expect(carouselIndex(-1, 0, 3, false)).toBe(0);
    });
    it('returns 0 for an empty carousel', () => {
        expect(carouselIndex(2, 0, 0, true)).toBe(0);
    });
});

describe('carouselControlIndex', () => {
    const props = {};
    it('ignores interaction for fewer than two items', () => {
        expect(carouselControlIndex(props, 10, 90, 1, 0, 300, 180)).toBeUndefined();
    });
    it('hits the previous arrow on the left edge', () => {
        expect(carouselControlIndex(props, 10, 90, 3, 0, 300, 180)).toBe(-1);
    });
    it('hits the next arrow on the right edge', () => {
        expect(carouselControlIndex(props, 290, 90, 3, 0, 300, 180)).toBe(1);
    });
    it('hits a dot near the bottom', () => {
        // startX = (300 - (3-1)*14) / 2 = 136, first dot at x = 136.
        expect(carouselControlIndex({ showDots: true }, 136, 160, 3, 1, 300, 180)).toBe(0);
    });
});

describe('sliderValueAt', () => {
    const props = { min: 0, max: 100, step: 1, height: 32 };
    it('maps the midpoint to the middle value', () => {
        // thumbRadius = 8, width = 160 -> ratio (80-8)/144 = 0.5
        expect(sliderValueAt(props, 160, 80)).toBe(50);
    });
    it('clamps to the ends', () => {
        expect(sliderValueAt(props, 160, 0)).toBe(0);
        expect(sliderValueAt(props, 160, 160)).toBe(100);
    });
    it('snaps to the configured step', () => {
        expect(sliderValueAt({ min: 0, max: 100, step: 10, height: 32 }, 160, 80)).toBe(50);
    });
    it('returns undefined for an inverted range', () => {
        expect(sliderValueAt({ min: 10, max: 10 }, 160, 80)).toBeUndefined();
    });
});
