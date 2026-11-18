import { describe, expect, it } from 'vitest';
import { SceneNode } from '../../scene';
import {
    canvasPoint,
    findCarouselControlHit,
    findGridScrollbarHit,
    findHit,
    isWithinClip,
    localPoint,
} from '../hit-test';
import type { EngineCore } from '../state';

// --- fixtures ---------------------------------------------------------------

function makeCore(scene: SceneNode, pixelRatio = 1): EngineCore {
    // hit-testing only reads `scene` and `pixelRatio` off the core.
    return { scene, pixelRatio } as unknown as EngineCore;
}

function makeCanvas(width = 200, height = 200, left = 0, top = 0): HTMLCanvasElement {
    return {
        width,
        height,
        getBoundingClientRect: () => ({
            width,
            height,
            left,
            top,
            right: left + width,
            bottom: top + height,
        }),
    } as unknown as HTMLCanvasElement;
}

function link(parent: SceneNode, ...children: SceneNode[]): SceneNode {
    for (const child of children) {
        child.parent = parent;
        parent.children.push(child);
    }
    return parent;
}

function root(): SceneNode {
    return new SceneNode('root');
}

// --- canvasPoint ------------------------------------------------------------

describe('canvasPoint', () => {
    it('maps client coordinates 1:1 when the element is unscaled', () => {
        const core = makeCore(root());
        expect(canvasPoint(core, makeCanvas(200, 200, 0, 0), 50, 60)).toEqual({ x: 50, y: 60 });
    });

    it('accounts for CSS scaling (canvas.width / rect.width)', () => {
        const core = makeCore(root());
        // backing store 400px shown in a 200px CSS box → each CSS px maps to 2.
        const canvas = {
            width: 400,
            height: 400,
            getBoundingClientRect: () => ({
                width: 200,
                height: 200,
                left: 0,
                top: 0,
                right: 200,
                bottom: 200,
            }),
        } as unknown as HTMLCanvasElement;
        expect(canvasPoint(core, canvas, 50, 0)).toEqual({ x: 100, y: 0 });
    });

    it('divides by the device pixel ratio', () => {
        const core = makeCore(root(), 2);
        expect(canvasPoint(core, makeCanvas(200, 200, 0, 0), 80, 40)).toEqual({ x: 40, y: 20 });
    });

    it('offsets by the bounding-rect origin', () => {
        const core = makeCore(root());
        expect(canvasPoint(core, makeCanvas(200, 200, 30, 40), 80, 90)).toEqual({ x: 50, y: 50 });
    });

    it('returns null for a zero-sized element', () => {
        const core = makeCore(root());
        expect(canvasPoint(core, makeCanvas(200, 200, 0, 0), 10, 10)).not.toBeNull();
        const zero = {
            width: 200,
            height: 200,
            getBoundingClientRect: () => ({
                width: 0,
                height: 0,
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            }),
        } as unknown as HTMLCanvasElement;
        expect(canvasPoint(core, zero, 10, 10)).toBeNull();
    });
});

// --- localPoint -------------------------------------------------------------

describe('localPoint', () => {
    it('inverts the accumulated node transform into local space', () => {
        const scene = root();
        const button = new SceneNode('button', { x: 20, y: 10, width: 100, height: 40 });
        link(scene, button);
        const core = makeCore(scene);
        expect(localPoint(core, makeCanvas(), 30, 15, button)).toEqual({ x: 10, y: 5 });
    });

    it('returns null when the target is not in the tree', () => {
        const scene = root();
        link(scene, new SceneNode('button', { x: 0, y: 0 }));
        const orphan = new SceneNode('button');
        const core = makeCore(scene);
        expect(localPoint(core, makeCanvas(), 10, 10, orphan)).toBeNull();
    });
});

// --- isWithinClip -----------------------------------------------------------

describe('isWithinClip', () => {
    it('clips children to an enclosing scrollable grid', () => {
        const scene = root();
        const grid = new SceneNode('grid', { x: 0, y: 0, width: 100, height: 100 });
        const child = new SceneNode('rect');
        link(scene, grid);
        link(grid, child);
        const core = makeCore(scene);
        expect(isWithinClip(core, makeCanvas(), 50, 50, child)).toBe(true);
        expect(isWithinClip(core, makeCanvas(), 150, 150, child)).toBe(false);
    });

    it('is always true without grid/carousel ancestors', () => {
        const scene = root();
        const node = new SceneNode('rect');
        link(scene, node);
        const core = makeCore(scene);
        expect(isWithinClip(core, makeCanvas(), 1000, 1000, node)).toBe(true);
    });
});

// --- findHit ----------------------------------------------------------------

describe('findHit', () => {
    it('returns the node and local coordinates for a point inside a control', () => {
        const scene = root();
        const button = new SceneNode('button', { x: 10, y: 10, width: 100, height: 40 });
        link(scene, button);
        const core = makeCore(scene);
        expect(findHit(core, makeCanvas(), 20, 20)).toEqual({ node: button, x: 10, y: 10 });
    });

    it('misses when the point falls outside the control bounds', () => {
        const scene = root();
        link(scene, new SceneNode('button', { x: 10, y: 10, width: 100, height: 40 }));
        const core = makeCore(scene);
        expect(findHit(core, makeCanvas(), 20, 60)).toBeNull();
    });

    it('ignores invisible nodes', () => {
        const scene = root();
        link(
            scene,
            new SceneNode('button', { x: 0, y: 0, width: 100, height: 40, visible: false }),
        );
        const core = makeCore(scene);
        expect(findHit(core, makeCanvas(), 10, 10)).toBeNull();
    });

    it('ignores non-interactive nodes such as rect', () => {
        const scene = root();
        link(scene, new SceneNode('rect', { x: 0, y: 0, width: 100, height: 40 }));
        const core = makeCore(scene);
        expect(findHit(core, makeCanvas(), 10, 10)).toBeNull();
    });

    it('lets an open modal dialog occlude controls outside it', () => {
        const scene = root();
        const button = new SceneNode('button', { x: 0, y: 0, width: 100, height: 40 });
        const dialog = new SceneNode('dialog', { x: 0, y: 0, width: 200, height: 200, open: true });
        link(scene, button, dialog);
        const core = makeCore(scene);
        // Click sits inside the (earlier) button, but the dialog is modal.
        expect(findHit(core, makeCanvas(), 10, 10)?.node.type).toBe('dialog');
    });
});

// --- findGridScrollbarHit ---------------------------------------------------

describe('findGridScrollbarHit', () => {
    it('hits the thumb when the grid overflows', () => {
        const scene = root();
        const grid = new SceneNode('grid', {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            _gridWidth: 100,
            _gridContentHeight: 200,
            _scrollTop: 0,
        });
        link(scene, grid);
        const core = makeCore(scene);
        // track occupies x∈[94,100]; thumb height 50 at scrollTop 0 → y∈[0,50].
        const hit = findGridScrollbarHit(core, makeCanvas(), 97, 10);
        expect(hit?.node).toBe(grid);
        expect(hit?.scrollTop).toBe(0);
        expect(hit?.pointerY).toBe(10);
    });

    it('returns null when there is nothing to scroll', () => {
        const scene = root();
        const grid = new SceneNode('grid', {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            _gridWidth: 100,
            _gridContentHeight: 100,
        });
        link(scene, grid);
        const core = makeCore(scene);
        expect(findGridScrollbarHit(core, makeCanvas(), 97, 10)).toBeNull();
    });
});

// --- findCarouselControlHit -------------------------------------------------

describe('findCarouselControlHit', () => {
    function carouselScene() {
        const scene = root();
        const carousel = new SceneNode('carousel', {
            x: 0,
            y: 0,
            width: 300,
            height: 180,
            _activeIndex: 0,
        });
        link(scene, carousel);
        link(
            carousel,
            new SceneNode('carouselItem'),
            new SceneNode('carouselItem'),
            new SceneNode('carouselItem'),
        );
        return { scene, carousel };
    }

    it('maps a left-arrow press to the previous index', () => {
        const { scene, carousel } = carouselScene();
        const core = makeCore(scene);
        // |y - height/2| <= 20 and x <= 42 → previous (0 - 1 = -1).
        expect(findCarouselControlHit(core, makeCanvas(), 10, 90)).toEqual({
            node: carousel,
            index: -1,
        });
    });

    it('maps a right-arrow press to the next index', () => {
        const { scene, carousel } = carouselScene();
        const core = makeCore(scene);
        // x >= width - 42 → next (0 + 1 = 1).
        expect(findCarouselControlHit(core, makeCanvas(), 295, 90)).toEqual({
            node: carousel,
            index: 1,
        });
    });

    it('returns null for a press in the carousel body', () => {
        const { scene } = carouselScene();
        const core = makeCore(scene);
        expect(findCarouselControlHit(core, makeCanvas(), 150, 90)).toBeNull();
    });

    it('returns null when the scene has no carousel', () => {
        const core = makeCore(root());
        expect(findCarouselControlHit(core, makeCanvas(), 150, 90)).toBeNull();
    });
});
