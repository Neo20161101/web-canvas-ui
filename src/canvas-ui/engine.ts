import { SceneNode } from './scene';
import { CanvasRenderer } from './renderer';
import type {
    CanvasPointerEvent,
    CanvasUIEvent,
    CanvasWheelEvent,
    VNode,
    WebInputBridge,
} from './types';
import { IDENTITY_TRANSFORM } from './types';
import { hasVisibleOpenDialog } from './engine/nodes';
import { removeTextControls, syncTextControls } from './engine/text-controls';
import { syncImages } from './engine/images';
import { prepare } from './engine/layout';
import { advanceCarousels } from './engine/carousel';
import { pointerDown, pointerMove, pointerUp, wheel } from './engine/interaction';
import type { TextControlDescription } from './engine/state';
import { EngineState } from './engine/state';
import type { EngineCore } from './engine/state';

/**
 * Public entry point of the canvas rendering engine.
 *
 * <p>{@code CanvasEngine} is intentionally a thin orchestrator: it owns the
 * {@link EngineCore} services and the {@link EngineState} container, wires them into
 * a render loop, and delegates every concrete behaviour to a cohesive module under
 * {@code ./engine} (layout normalization, hit-testing, interaction, carousel,
 * text controls, images, events). The public surface is unchanged from when this
 * was a single God class.</p>
 */
export class CanvasEngine {
    readonly scene = new SceneNode('root');
    readonly renderer = new CanvasRenderer();
    private readonly state = new EngineState();
    private readonly context: CanvasRenderingContext2D;
    private readonly core: EngineCore;
    private animationFrame: number | null = null;
    private themeObserver: MutationObserver | null = null;
    private running = false;

    constructor(
        context: CanvasRenderingContext2D,
        inputBridge: WebInputBridge,
        onFrame?: (time: number) => void,
        pixelRatio = 1,
        onEvent?: (event: CanvasUIEvent) => void,
    ) {
        this.context = context;
        this.core = {
            scene: this.scene,
            renderer: this.renderer,
            context,
            inputBridge,
            pixelRatio,
            onFrame,
            onEvent,
        };
    }

    update(tree: VNode[]): void {
        const descriptions: TextControlDescription[] = [];
        const normalized = prepare(
            this.core,
            this.state,
            tree,
            IDENTITY_TRANSFORM,
            true,
            'root',
            descriptions,
        );
        this.scene.syncChildren(normalized, (node) => removeTextControls(this.state, node));
        this.core.inputBridge.setOverlayVisible(!hasVisibleOpenDialog(this.scene, true));
        syncTextControls(this.core, this.state, descriptions);
        syncImages(this.core, this.state, tree);
    }

    render(): void {
        this.renderer.render(this.context, this.scene);
    }

    requestRender(): void {
        this.scene.markDirty();
    }

    renderTo(context: CanvasRenderingContext2D, scaleX: number, scaleY: number): void {
        context.save();
        context.scale(scaleX, scaleY);
        this.renderer.render(context, this.scene);
        context.restore();
    }

    start(): void {
        if (this.running) return;
        this.running = true;
        const Observer = this.context.canvas.ownerDocument.defaultView?.MutationObserver;
        if (Observer) {
            this.themeObserver = new Observer(() => this.scene.markDirty());
            let element: Element | null = this.context.canvas;
            while (element) {
                this.themeObserver.observe(element, {
                    attributes: true,
                    attributeFilter: ['class', 'style'],
                });
                element = element.parentElement;
            }
        }
        const frame = (time: number) => {
            if (!this.running) return;
            advanceCarousels(this.core, this.state, time);
            if (this.scene.dirty) this.render();
            this.core.onFrame?.(time);
            if (this.running) this.animationFrame = requestAnimationFrame(frame);
        };
        this.animationFrame = requestAnimationFrame(frame);
    }

    pointerDown(event: CanvasPointerEvent): void {
        pointerDown(this.core, this.state, event);
    }

    pointerMove(event: CanvasPointerEvent): void {
        pointerMove(this.core, this.state, event);
    }

    pointerUp(event: CanvasPointerEvent, cancelled = false): void {
        pointerUp(this.core, this.state, event, cancelled);
    }

    wheel(event: CanvasWheelEvent): void {
        wheel(this.core, this.state, event);
    }

    destroy(): void {
        this.running = false;
        if (this.animationFrame !== null) cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
        this.themeObserver?.disconnect();
        this.themeObserver = null;
        for (const mounted of this.state.textControls.values()) mounted.dispose();
        this.state.textControls.clear();
        this.state.inputValues.clear();
        this.state.imageSubscriptions.forEach((dispose) => dispose());
        this.state.imageSubscriptions.clear();
        this.state.tabSelections.clear();
        this.state.carouselSelections.clear();
        this.state.carouselFrameTimes.clear();
        this.state.carouselTransitions.clear();
        this.state.collapseSelections.clear();
        this.state.gridScrollPositions.clear();
        this.state.pointerSequences.clear();
        this.state.activeSlider = null;
        this.state.activeButton = null;
        this.state.activeGridScroll = null;
        this.core.inputBridge.destroy();
    }
}
