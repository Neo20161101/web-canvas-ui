import type { SceneNode } from '../scene';
import type { CanvasRenderer } from '../renderer';
import type { CanvasUIEvent, InputLayout, TextControlProps, WebInputBridge } from '../types';

/** A text input/date/textarea currently mirrored into the DOM overlay bridge. */
export interface MountedTextControl {
    node: SceneNode;
    dispose: () => void;
    layout: InputLayout;
}

/** A text control discovered during the `prepare` pass, awaiting sync. */
export interface TextControlDescription {
    id: string;
    props: TextControlProps;
    layout: InputLayout;
}

export interface CarouselTransition {
    from: number;
    to: number;
    direction: -1 | 1;
    startedAt: number;
    duration: number;
}

export interface PointerSequence {
    target: SceneNode | null;
    x: number;
    y: number;
    eligible: boolean;
}

export interface GridScrollGesture {
    node: SceneNode;
    pointerY: number;
    scrollTop: number;
}

/**
 * Immutable services and configuration shared by every engine behaviour module:
 * the scene graph, renderer, canvas context, DOM input bridge and callbacks.
 * {@link CanvasEngine} owns exactly one of these for its lifetime.
 */
export interface EngineCore {
    readonly scene: SceneNode;
    readonly renderer: CanvasRenderer;
    readonly context: CanvasRenderingContext2D;
    readonly inputBridge: WebInputBridge;
    readonly pixelRatio: number;
    readonly onFrame?: (time: number) => void;
    readonly onEvent?: (event: CanvasUIEvent) => void;
}

/**
 * All engine-mutable state that survives across frames and pointer events.
 * Extracted from the former {@link CanvasEngine} private fields so behaviour
 * modules can operate on it explicitly instead of via a God-class `this`.
 */
export class EngineState {
    readonly textControls = new Map<string, MountedTextControl>();
    readonly inputValues = new Map<string, string>();
    readonly imageSubscriptions = new Map<string, () => void>();
    readonly tabSelections = new Map<string, string>();
    readonly carouselSelections = new Map<string, number>();
    readonly carouselFrameTimes = new Map<string, number>();
    readonly carouselTransitions = new Map<string, CarouselTransition>();
    readonly collapseSelections = new Map<string, Set<string>>();
    readonly gridScrollPositions = new Map<string, number>();
    readonly pointerSequences = new Map<number, PointerSequence>();
    activeSlider: SceneNode | null = null;
    activeButton: SceneNode | null = null;
    activeGridScroll: GridScrollGesture | null = null;
    currentFrameTime = 0;
}
