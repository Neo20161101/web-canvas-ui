import { describe, expect, it } from 'vitest';
import { SceneNode } from '../../scene';
import type { VNode } from '../../types';
import { prepare, activeCollapseKeys, layoutCollapseNodes } from '../layout';
import { EngineState } from '../state';
import type { EngineCore, TextControlDescription } from '../state';

// --- fixtures ---------------------------------------------------------------

function makeCore(canvasWidth = 400, canvasHeight = 200, pixelRatio = 1): EngineCore {
    // prepare only reads context.canvas dims + pixelRatio (for dialog centring).
    return {
        pixelRatio,
        context: { canvas: { width: canvasWidth, height: canvasHeight } },
    } as unknown as EngineCore;
}

function vnode(
    type: VNode['type'],
    props: Record<string, unknown> = {},
    children: VNode[] = [],
    key: string | null = null,
): VNode {
    return { type, key, props, children };
}

// --- passthrough & transform ------------------------------------------------

describe('prepare · passthrough', () => {
    it('records effective user visibility on plain nodes', () => {
        const state = new EngineState();
        const out = prepare(
            makeCore(),
            state,
            [vnode('rect', { x: 5 }, [], 'r')],
            [1, 0, 0, 1, 0, 0],
            true,
            'root',
            [],
        );
        expect(out[0].type).toBe('rect');
        expect(out[0].props._userVisible).toBe(true);
    });

    it('honours visible:false when deriving _userVisible', () => {
        const state = new EngineState();
        const out = prepare(
            makeCore(),
            state,
            [vnode('rect', { visible: false }, [], 'r')],
            [1, 0, 0, 1, 0, 0],
            true,
            'root',
            [],
        );
        expect(out[0].props._userVisible).toBe(false);
    });
});

// --- text controls ----------------------------------------------------------

describe('prepare · text controls', () => {
    it('emits a description whose layout transform includes ancestor offsets', () => {
        const state = new EngineState();
        const descriptions: TextControlDescription[] = [];
        const tree = [
            vnode('group', { x: 50, y: 0 }, [vnode('input', { x: 10, y: 10 }, [], 'i0')], 'g1'),
        ];
        prepare(makeCore(), state, tree, [1, 0, 0, 1, 0, 0], true, 'root', descriptions);

        expect(descriptions).toHaveLength(1);
        expect(descriptions[0].id).toBe('input:root/kg1/ki0');
        // group translate(50,0) ∘ input translate(10,10) → [.., 60, 10].
        expect(descriptions[0].layout.transform).toEqual([1, 0, 0, 1, 60, 10]);
        expect(descriptions[0].layout.width).toBe(200);
        expect(descriptions[0].layout.height).toBe(36);
    });

    it('flags controlled vs uncontrolled inputs', () => {
        const state = new EngineState();
        const out = prepare(
            makeCore(),
            state,
            [vnode('input', { value: 'x' }, [], 'i')],
            [1, 0, 0, 1, 0, 0],
            true,
            'root',
            [],
        );
        expect(out[0].props._controlledValue).toBe(true);
        expect(out[0].props._canvasInputId).toBe('input:root/ki');
    });
});

// --- grid -------------------------------------------------------------------

describe('prepare · grid', () => {
    it('lays children into columns and records scroll metrics', () => {
        const state = new EngineState();
        const tree = [
            vnode(
                'grid',
                { columns: 2, cellHeight: 50, gap: 0, width: 200 },
                [vnode('gridItem', {}, [], 'a'), vnode('gridItem', {}, [], 'b')],
                'g',
            ),
        ];
        const out = prepare(makeCore(), state, tree, [1, 0, 0, 1, 0, 0], true, 'root', []);

        expect(out[0].props._gridWidth).toBe(200);
        expect(out[0].props._gridContentHeight).toBe(50);
        expect(out[0].props._scrollTop).toBe(0);
        expect(out[0].children[1].props.x).toBe(100);
        expect(state.gridScrollPositions.get('root/kg')).toBe(0);
    });

    it('preserves an existing scroll position', () => {
        const state = new EngineState();
        state.gridScrollPositions.set('root/kg', 20);
        const tree = [
            vnode(
                'grid',
                { columns: 1, cellHeight: 50, gap: 0, width: 100, height: 30 },
                [vnode('gridItem', {}, [], 'a')],
                'g',
            ),
        ];
        const out = prepare(makeCore(), state, tree, [1, 0, 0, 1, 0, 0], true, 'root', []);
        expect(out[0].props._scrollTop).toBe(20);
        expect(out[0].children[0].props._gridBaseY).toBe(0);
        expect(out[0].children[0].props.y).toBe(-20);
    });
});

// --- dialog -----------------------------------------------------------------

describe('prepare · dialog', () => {
    it('centres the panel in the viewport and shifts its children', () => {
        const state = new EngineState();
        const tree = [
            vnode(
                'dialog',
                { width: 200, height: 100, open: true },
                [vnode('rect', { x: 0, y: 0 }, [], 'c')],
                'd',
            ),
        ];
        const out = prepare(
            makeCore(400, 200, 1),
            state,
            tree,
            [1, 0, 0, 1, 0, 0],
            true,
            'root',
            [],
        );

        expect(out[0].props._viewportWidth).toBe(400);
        expect(out[0].props._viewportHeight).toBe(200);
        expect(out[0].props._dialogPanelX).toBe(100);
        expect(out[0].props._dialogPanelY).toBe(50);
        expect(out[0].children[0].props.x).toBe(124);
        expect(out[0].children[0].props.y).toBe(114);
    });
});

// --- tabs -------------------------------------------------------------------

describe('prepare · tabs', () => {
    it('selects the first tab by default and marks the rest hidden', () => {
        const state = new EngineState();
        const tree = [
            vnode(
                'tabs',
                {},
                [vnode('tabItem', { id: 't1' }, [], 'a'), vnode('tabItem', { id: 't2' }, [], 'b')],
                't',
            ),
        ];
        const out = prepare(makeCore(), state, tree, [1, 0, 0, 1, 0, 0], true, 'root', []);

        expect(out[0].props._activeKey).toBe('t1');
        const items = out[0].props._tabItems as Array<{ selected: boolean }>;
        expect(items[0].selected).toBe(true);
        expect(items[1].selected).toBe(false);
        expect(out[0].children[1].props.visible).toBe(false);
    });

    it('respects a controlled activeKey', () => {
        const state = new EngineState();
        const tree = [
            vnode(
                'tabs',
                { activeKey: 't2' },
                [vnode('tabItem', { id: 't1' }, [], 'a'), vnode('tabItem', { id: 't2' }, [], 'b')],
                't',
            ),
        ];
        const out = prepare(makeCore(), state, tree, [1, 0, 0, 1, 0, 0], true, 'root', []);
        expect(out[0].props._activeKey).toBe('t2');
    });
});

// --- collapse ---------------------------------------------------------------

describe('prepare · collapse', () => {
    it('stacks items and expands only the active key', () => {
        const state = new EngineState();
        const tree = [
            vnode(
                'collapse',
                { defaultActiveKeys: ['a'] },
                [
                    vnode('collapseItem', { id: 'a', height: 100 }, [], 'i0'),
                    vnode('collapseItem', { id: 'b' }, [], 'i1'),
                ],
                'c',
            ),
        ];
        const out = prepare(makeCore(), state, tree, [1, 0, 0, 1, 0, 0], true, 'root', []);

        expect(out[0].props._activeKeys).toEqual(['a']);
        expect(out[0].children[0].props._expanded).toBe(true);
        expect(out[0].children[0].props.y).toBe(0);
        // second header sits below header(40) + expanded content(100).
        expect(out[0].children[1].props.y).toBe(140);
        expect(out[0].children[1].props._expanded).toBe(false);
    });

    it('keeps only the first key when accordion mode is on', () => {
        const state = new EngineState();
        const active = activeCollapseKeys(state, 'k', {
            accordion: true,
            defaultActiveKeys: ['a', 'b'],
        });
        expect([...active]).toEqual(['a']);
    });
});

describe('layoutCollapseNodes', () => {
    it('re-stacks header positions and toggles child visibility', () => {
        const parent = new SceneNode('collapse', { headerHeight: 40, width: 300 });
        const itemA = new SceneNode('collapseItem', { id: 'a', height: 100 });
        const itemB = new SceneNode('collapseItem', { id: 'b' });
        for (const item of [itemA, itemB]) {
            item.parent = parent;
            parent.children.push(item);
        }

        layoutCollapseNodes(parent, new Set(['a']));

        expect(itemA.props._expanded).toBe(true);
        expect(itemA.props.y).toBe(0);
        expect(itemA.props._collapseHeaderHeight).toBe(40);
        // header(40) + expanded content(100) pushes the next header down.
        expect(itemB.props.y).toBe(140);
        expect(itemB.props._expanded).toBe(false);
    });
});

// --- carousel ---------------------------------------------------------------

describe('prepare · carousel', () => {
    it('seeds index and visibility from the selection state', () => {
        const state = new EngineState();
        const tree = [
            vnode(
                'carousel',
                {},
                [vnode('carouselItem', {}, [], 'i0'), vnode('carouselItem', {}, [], 'i1')],
                'p',
            ),
        ];
        const out = prepare(makeCore(), state, tree, [1, 0, 0, 1, 0, 0], true, 'root', []);

        expect(out[0].props._activeIndex).toBe(0);
        expect(out[0].props._itemCount).toBe(2);
        expect(out[0].props._transitionProgress).toBe(1);
        expect(out[0].children[0].props.visible).toBe(true);
        expect(out[0].children[1].props.visible).toBe(false);
        expect(state.carouselSelections.get('root/kp')).toBe(0);
    });

    it('honours a controlled activeIndex', () => {
        const state = new EngineState();
        const tree = [
            vnode(
                'carousel',
                { activeIndex: 1 },
                [vnode('carouselItem', {}, [], 'i0'), vnode('carouselItem', {}, [], 'i1')],
                'p',
            ),
        ];
        const out = prepare(makeCore(), state, tree, [1, 0, 0, 1, 0, 0], true, 'root', []);
        expect(out[0].props._activeIndex).toBe(1);
        expect(out[0].children[1].props.visible).toBe(true);
    });
});
