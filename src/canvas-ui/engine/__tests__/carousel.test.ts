import { describe, expect, it } from 'vitest';
import { SceneNode } from '../../scene';
import { advanceCarousels, changeCarousel, transitionProgress } from '../carousel';
import { EngineState } from '../state';
import type { CarouselTransition, EngineCore } from '../state';

// --- fixtures ---------------------------------------------------------------

function makeCore(scene: SceneNode): EngineCore {
    // The carousel helpers only touch `scene` (traverse); text-control visibility
    // is exercised with an empty overlay map, so the bridge is never called.
    return { scene, inputBridge: {} } as unknown as EngineCore;
}

function carouselFixture(
    carouselProps: Record<string, unknown> = {},
    itemCount = 2,
): { scene: SceneNode; carousel: SceneNode; items: SceneNode[] } {
    const scene = new SceneNode('root');
    const carousel = new SceneNode('carousel', { _stateKey: 'c1', ...carouselProps });
    carousel.parent = scene;
    scene.children.push(carousel);
    const items: SceneNode[] = [];
    for (let index = 0; index < itemCount; index++) {
        const item = new SceneNode('carouselItem', {});
        item.parent = carousel;
        carousel.children.push(item);
        items.push(item);
    }
    return { scene, carousel, items };
}

const transition = (over: Partial<CarouselTransition> = {}): CarouselTransition => ({
    from: 0,
    to: 1,
    direction: 1,
    startedAt: 0,
    duration: 100,
    ...over,
});

// --- transitionProgress -----------------------------------------------------

describe('transitionProgress', () => {
    it('reports 1 immediately for a zero-duration transition', () => {
        expect(transitionProgress(transition({ duration: 0 }), 999)).toBe(1);
    });

    it('clamps elapsed fraction into [0, 1]', () => {
        const t = transition({ startedAt: 100, duration: 200 });
        expect(transitionProgress(t, 100)).toBe(0);
        expect(transitionProgress(t, 200)).toBe(0.5);
        expect(transitionProgress(t, 300)).toBe(1);
        expect(transitionProgress(t, 50)).toBe(0); // before start → 0
        expect(transitionProgress(t, 500)).toBe(1); // after end → 1
    });
});

// --- changeCarousel ---------------------------------------------------------

describe('changeCarousel', () => {
    it('starts an eased transition and records the pending state', () => {
        const state = new EngineState();
        state.currentFrameTime = 1000;
        const seen: number[] = [];
        const { core, carousel } = (() => {
            const f = carouselFixture({
                width: 300,
                _activeIndex: 0,
                onChange: (i: number) => seen.push(i),
            });
            return { core: makeCore(f.scene), carousel: f.carousel };
        })();

        changeCarousel(core, state, carousel, 1);

        expect(carousel.props._activeIndex).toBe(1);
        expect(carousel.props._transitionProgress).toBe(0);
        expect(state.carouselTransitions.has('c1')).toBe(true);
        expect(state.carouselFrameTimes.get('c1')).toBe(1000);
        expect(state.carouselSelections.get('c1')).toBe(1);
        expect(seen).toEqual([1]);
    });

    it('applies an instant change when the transition duration is 0', () => {
        const state = new EngineState();
        const seen: number[] = [];
        const { scene, carousel, items } = carouselFixture({
            transitionDuration: 0,
            _activeIndex: 0,
            onChange: (i: number) => seen.push(i),
        });
        carousel.setProps({ visible: true });

        changeCarousel(makeCore(scene), state, carousel, 1);

        expect(carousel.props._activeIndex).toBe(1);
        expect(state.carouselTransitions.has('c1')).toBe(false);
        expect(items[0].props.visible).toBe(false);
        expect(items[1].props.visible).toBe(true);
        expect(seen).toEqual([1]);
    });

    it('is a no-op when the resolved index equals the current one', () => {
        const state = new EngineState();
        const seen: number[] = [];
        const { scene, carousel } = carouselFixture({
            _activeIndex: 1,
            onChange: (i: number) => seen.push(i),
        });

        changeCarousel(makeCore(scene), state, carousel, 1);

        expect(seen).toEqual([]);
        expect(state.carouselTransitions.has('c1')).toBe(false);
    });

    it('is a no-op while a transition for the node is already running', () => {
        const state = new EngineState();
        state.carouselTransitions.set('c1', transition());
        const seen: number[] = [];
        const { scene, carousel } = carouselFixture({
            _activeIndex: 0,
            onChange: (i: number) => seen.push(i),
        });

        changeCarousel(makeCore(scene), state, carousel, 1);

        expect(carousel.props._activeIndex).toBe(0);
        expect(seen).toEqual([]);
    });

    it('is a no-op for an empty carousel', () => {
        const state = new EngineState();
        const seen: number[] = [];
        const { scene, carousel } = carouselFixture({ onChange: (i: number) => seen.push(i) }, 0);

        changeCarousel(makeCore(scene), state, carousel, 1);

        expect(seen).toEqual([]);
    });
});

// --- advanceCarousels -------------------------------------------------------

describe('advanceCarousels', () => {
    it('seeds the frame clock then auto-advances past the interval', () => {
        const state = new EngineState();
        const { scene, carousel } = carouselFixture({ interval: 100, _activeIndex: 0 });
        const core = makeCore(scene);

        advanceCarousels(core, state, 0);
        expect(state.carouselFrameTimes.get('c1')).toBe(0);
        expect(carousel.props._activeIndex).toBe(0);

        // interval is floored at 250ms, so 300ms elapsed triggers a change.
        advanceCarousels(core, state, 300);
        expect(state.currentFrameTime).toBe(300);
        expect(carousel.props._activeIndex).toBe(1);
    });

    it('does not advance before the interval elapses', () => {
        const state = new EngineState();
        const { scene, carousel } = carouselFixture({ interval: 1000, _activeIndex: 0 });
        const core = makeCore(scene);
        advanceCarousels(core, state, 0);
        advanceCarousels(core, state, 500);
        expect(carousel.props._activeIndex).toBe(0);
    });

    it('completes an in-flight transition and clears it', () => {
        const state = new EngineState();
        state.carouselTransitions.set(
            'c1',
            transition({ from: 0, to: 1, startedAt: 0, duration: 100 }),
        );
        const { scene, carousel } = carouselFixture({ _activeIndex: 1 });
        carousel.setProps({ _transitionProgress: 0.4 });

        advanceCarousels(makeCore(scene), state, 200);

        expect(state.carouselTransitions.has('c1')).toBe(false);
        expect(carousel.props._transitionProgress).toBe(1);
    });

    it('progresses a transition mid-flight without finishing it', () => {
        const state = new EngineState();
        state.carouselTransitions.set('c1', transition({ startedAt: 0, duration: 200 }));
        const { scene, carousel } = carouselFixture();

        advanceCarousels(makeCore(scene), state, 100);

        expect(state.carouselTransitions.has('c1')).toBe(true);
        expect(carousel.props._transitionProgress).toBeCloseTo(0.5);
    });

    it('stops the clock for non-autoplaying carousels', () => {
        const state = new EngineState();
        state.carouselFrameTimes.set('c1', 0);
        const { scene } = carouselFixture({ autoplay: false });

        advanceCarousels(makeCore(scene), state, 5000);

        expect(state.carouselFrameTimes.has('c1')).toBe(false);
    });

    it('prunes timing bookkeeping for carousels that left the tree', () => {
        const state = new EngineState();
        state.carouselFrameTimes.set('gone', 1);
        state.carouselTransitions.set('gone', transition());
        const { scene } = carouselFixture({ interval: 100 });

        advanceCarousels(makeCore(scene), state, 0);

        expect(state.carouselFrameTimes.has('gone')).toBe(false);
        expect(state.carouselTransitions.has('gone')).toBe(false);
    });
});
