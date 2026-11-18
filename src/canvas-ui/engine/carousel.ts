import type { SceneNode } from '../scene';
import { number } from '../components/draw-utils';
import { carouselIndex } from '../components/Carousel';
import { hasVisibleAncestors, isDescendantOf, setTreeVisibility } from './nodes';
import { nodeTransform } from './transform';
import { carouselItemOffset } from './vnodes';
import { updateTextControlVisibility } from './text-controls';
import type { CarouselTransition, EngineCore, EngineState } from './state';

/**
 * The carousel state machine: autoplay timing, index transitions and the
 * per-frame easing that slides items. Driven by {@link advanceCarousels} from the
 * render loop and {@link changeCarousel} from pointer interaction.
 */

export function transitionProgress(transition: CarouselTransition, time: number): number {
    return transition.duration <= 0
        ? 1
        : Math.max(0, Math.min(1, (time - transition.startedAt) / transition.duration));
}

function setCarouselItems(
    node: SceneNode,
    activeIndex: number,
    transition: CarouselTransition | null,
    progress: number,
): void {
    const width = number(node.props.width, 300);
    const items = node.children.filter((child) => child.type === 'carouselItem');
    items.forEach((item, index) => {
        const visible = transition
            ? (index === transition.from || index === transition.to) &&
              item.props._userVisible !== false
            : index === activeIndex && item.props._userVisible !== false;
        const baseX = number(item.props._carouselBaseX, number(item.props.x, 0));
        const offset = carouselItemOffset(index, transition, progress, width);
        item.setProps({ x: baseX + offset });
        setTreeVisibility(item, visible);
    });
}

function updateCarouselInputLayouts(core: EngineCore, state: EngineState, node: SceneNode): void {
    for (const mounted of state.textControls.values()) {
        if (!isDescendantOf(mounted.node, node)) continue;
        mounted.layout = { ...mounted.layout, transform: nodeTransform(mounted.node) };
    }
    updateTextControlVisibility(core, state);
}

export function changeCarousel(
    core: EngineCore,
    state: EngineState,
    node: SceneNode,
    requestedIndex: number,
): void {
    const items = node.children.filter((child) => child.type === 'carouselItem');
    if (!items.length) return;
    const currentIndex = number(node.props._activeIndex, 0);
    const nextIndex = carouselIndex(
        requestedIndex,
        currentIndex,
        items.length,
        node.props.loop !== false,
    );
    if (nextIndex === currentIndex) return;

    const stateKey = String(node.props._stateKey ?? '');
    if (state.carouselTransitions.has(stateKey)) return;
    const duration = Math.max(0, number(node.props.transitionDuration, 450));
    if (duration > 0) {
        const transition: CarouselTransition = {
            from: currentIndex,
            to: nextIndex,
            direction: requestedIndex > currentIndex ? 1 : -1,
            startedAt: state.currentFrameTime,
            duration,
        };
        state.carouselTransitions.set(stateKey, transition);
        state.carouselFrameTimes.set(stateKey, state.currentFrameTime);
        node.setProps({ _activeIndex: nextIndex, _transitionProgress: 0 });
        setCarouselItems(node, nextIndex, transition, 0);
        updateCarouselInputLayouts(core, state, node);
        if (node.props.activeIndex === undefined) state.carouselSelections.set(stateKey, nextIndex);
        (node.props.onChange as ((index: number) => void) | undefined)?.(nextIndex);
        return;
    }
    state.carouselFrameTimes.set(stateKey, state.currentFrameTime);
    if (node.props.activeIndex !== undefined) {
        (node.props.onChange as ((index: number) => void) | undefined)?.(nextIndex);
        return;
    }
    state.carouselSelections.set(stateKey, nextIndex);
    node.setProps({ _activeIndex: nextIndex });
    items.forEach((item, index) => {
        const active = index === nextIndex && item.props._userVisible !== false;
        setTreeVisibility(item, active);
    });
    updateTextControlVisibility(core, state);
    (node.props.onChange as ((index: number) => void) | undefined)?.(nextIndex);
}

export function advanceCarousels(core: EngineCore, state: EngineState, time: number): void {
    state.currentFrameTime = time;
    const activeKeys = new Set<string>();
    core.scene.traverse((node) => {
        if (node.type !== 'carousel') return;
        const stateKey = String(node.props._stateKey ?? '');
        activeKeys.add(stateKey);
        const transition = state.carouselTransitions.get(stateKey);
        if (transition) {
            if (time - transition.startedAt >= transition.duration) {
                state.carouselTransitions.delete(stateKey);
                node.setProps({ _transitionProgress: 1 });
                setCarouselItems(node, transition.to, null, 1);
                updateCarouselInputLayouts(core, state, node);
                state.carouselFrameTimes.set(stateKey, time);
            } else {
                const progress = transitionProgress(transition, time);
                node.setProps({ _transitionProgress: progress });
                const eased = progress * progress * (3 - 2 * progress);
                setCarouselItems(node, transition.to, transition, eased);
                updateCarouselInputLayouts(core, state, node);
            }
            return;
        }
        if (
            !hasVisibleAncestors(node) ||
            node.props.autoplay === false ||
            node.children.filter((child) => child.type === 'carouselItem').length < 2
        ) {
            state.carouselFrameTimes.delete(stateKey);
            return;
        }
        const lastTime = state.carouselFrameTimes.get(stateKey);
        if (lastTime === undefined) {
            state.carouselFrameTimes.set(stateKey, time);
            return;
        }
        const interval = Math.max(250, number(node.props.interval, 3000));
        if (time - lastTime < interval) return;
        state.carouselFrameTimes.set(stateKey, time);
        changeCarousel(core, state, node, number(node.props._activeIndex, 0) + 1);
    });
    for (const key of state.carouselFrameTimes.keys()) {
        if (!activeKeys.has(key)) state.carouselFrameTimes.delete(key);
    }
    for (const key of state.carouselTransitions.keys()) {
        if (!activeKeys.has(key)) state.carouselTransitions.delete(key);
    }
}
