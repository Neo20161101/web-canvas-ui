import type { SceneNode } from '../scene';
import type { CanvasPointerEvent, CanvasWheelEvent } from '../types';
import type { CustomDrawClickEvent } from '../components/CustomDraw';
import { number } from '../components/draw-utils';
import { toggleSwitch } from '../components/Switch';
import { activateButton, setButtonPressed } from '../components/Button';
import { choiceAt, checkboxSelection, radioSelection } from '../components/ChoiceGroup';
import { tabKeyAt } from '../components/Tabs';
import { dropdownOptionAt, selectDropdownOption } from '../components/Dropdown';
import { sliderValueAt } from '../components/Slider';
import { toggleCollapseKeys } from '../components/Collapse';
import { controlSize, eventTarget, isDescendantOf, setTreeVisibility } from './nodes';
import { nodeTransform } from './transform';
import { gridScrollbarMetrics } from './vnodes';
import {
    canvasPoint,
    findCarouselControlHit,
    findGridScrollbarHit,
    findHit,
    localPoint,
} from './hit-test';
import { emitCanvasViewPointerEvent, emitPointerEvent } from './events';
import { changeCarousel } from './carousel';
import { updateTextControlVisibility } from './text-controls';
import { activeCollapseKeys, layoutCollapseNodes } from './layout';
import type { EngineCore, EngineState } from './state';

/**
 * Turns raw pointer/wheel events into state mutations on the scene graph: routes a
 * press to the correct component, drives sliders, buttons, tabs, collapses, dropdowns,
 * dialogs and grid scrolling, and emits the public event stream.
 */

export function pointerDown(core: EngineCore, state: EngineState, event: CanvasPointerEvent): void {
    const carouselControl = findCarouselControlHit(
        core,
        event.currentTarget,
        event.clientX,
        event.clientY,
    );
    const scrollbar = findGridScrollbarHit(core, event.currentTarget, event.clientX, event.clientY);
    const specialNode = carouselControl?.node ?? scrollbar?.node;
    const specialPoint = specialNode
        ? localPoint(core, event.currentTarget, event.clientX, event.clientY, specialNode)
        : null;
    const hit = specialNode
        ? { node: specialNode, x: specialPoint?.x ?? 0, y: specialPoint?.y ?? 0 }
        : findHit(core, event.currentTarget, event.clientX, event.clientY);
    const point = canvasPoint(core, event.currentTarget, event.clientX, event.clientY);
    if (point) {
        state.pointerSequences.set(event.pointerId, {
            target: hit?.node ?? null,
            x: point.x,
            y: point.y,
            eligible: hit?.node.props.disabled !== true,
        });
        emitPointerEvent(core, 'pointerdown', event, hit, point);
        if (hit?.node.type === 'canvasView') {
            emitCanvasViewPointerEvent('pointerdown', hit.node, hit.x, hit.y, event);
        }
    }
    if (carouselControl) {
        changeCarousel(core, state, carouselControl.node, carouselControl.index);
        event.currentTarget.setPointerCapture(event.pointerId);
        event.preventDefault();
        return;
    }
    if (scrollbar) {
        state.activeGridScroll = scrollbar;
        event.currentTarget.setPointerCapture(event.pointerId);
        event.preventDefault();
        return;
    }
    closeOpenDropdowns(core.scene, hit?.node);
    if (!hit || hit.node.props.disabled) return;

    const { node, x, y } = hit;
    if (node.type === 'slider') {
        state.activeSlider = node;
        updateSlider(node, x);
    } else if (node.type === 'switch') {
        toggleSwitch(node);
    } else if (node.type === 'radio') {
        const option = choiceAt(node.props, x, y);
        const value =
            option && !option.disabled ? radioSelection(node.props.value, option) : undefined;
        if (value === undefined) return;
        if (node.props._controlledValue !== true) node.setProps({ value });
        (node.props.onChange as ((value: string) => void) | undefined)?.(value);
    } else if (node.type === 'checkbox') {
        const option = choiceAt(node.props, x, y);
        if (!option || option.disabled) return;
        const next = checkboxSelection(node.props.value, option);
        if (node.props._controlledValue !== true) node.setProps({ value: next });
        (node.props.onChange as ((value: string[]) => void) | undefined)?.(next);
    } else if (node.type === 'upload') {
        core.inputBridge.pickFiles(
            typeof node.props.accept === 'string' ? node.props.accept : undefined,
            Boolean(node.props.multiple),
            (files) =>
                (node.props.onChange as ((selectedFiles: File[]) => void) | undefined)?.(files),
        );
    } else if (node.type === 'button') {
        state.activeButton = node;
        setButtonPressed(node, true);
    } else if (node.type === 'tabs') {
        const items = node.children.filter((child) => child.type === 'tabItem');
        const width = number(node.props.width, 300);
        const headerHeight = number(node.props.headerHeight, 40);
        const key = tabKeyAt(items, x, y, width, headerHeight);
        if (key === undefined) return;
        selectTab(core, state, node, key);
    } else if (node.type === 'collapse') {
        const headerHeight = number(node.props.headerHeight, 40);
        const item = [...node.children].reverse().find((child) => {
            const top = number(child.props.y, 0);
            return y >= top && y <= top + headerHeight;
        });
        if (item && !item.props.disabled && typeof item.props.id === 'string') {
            toggleCollapseItem(core, state, node, item);
        } else {
            return;
        }
    } else if (node.type === 'dialog') {
        handleDialogPointer(node, x, y);
        event.preventDefault();
        return;
    } else if (node.type === 'dropdown') {
        const height = number(node.props.height, 36);
        if (node.props.open) {
            const row = Math.floor(y / height) - 1;
            const option = dropdownOptionAt(node.props.options, row);
            if (y >= height && option && !option.disabled) {
                selectDropdownOption(node, option);
            } else {
                node.setProps({ open: false });
            }
        } else {
            node.setProps({ open: true });
        }
    } else if (node.type !== 'customDraw' && node.type !== 'canvasView') {
        return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
}

export function pointerMove(core: EngineCore, state: EngineState, event: CanvasPointerEvent): void {
    const hit = findHit(core, event.currentTarget, event.clientX, event.clientY);
    const canvasPosition = canvasPoint(core, event.currentTarget, event.clientX, event.clientY);
    if (canvasPosition) emitPointerEvent(core, 'pointermove', event, hit, canvasPosition);
    const sequence = state.pointerSequences.get(event.pointerId);
    const canvasView =
        sequence?.target?.type === 'canvasView'
            ? sequence.target
            : hit?.node.type === 'canvasView'
              ? hit.node
              : null;
    if (canvasView) {
        const local =
            canvasView === hit?.node
                ? hit
                : localPoint(core, event.currentTarget, event.clientX, event.clientY, canvasView);
        if (local) {
            emitCanvasViewPointerEvent('pointermove', canvasView, local.x, local.y, event);
        }
    }
    if (state.activeGridScroll) {
        const active = state.activeGridScroll;
        const localPosition = localPoint(
            core,
            event.currentTarget,
            event.clientX,
            event.clientY,
            active.node,
        );
        if (localPosition) {
            const metrics = gridScrollbarMetrics(active.node.props);
            const trackRange = metrics.height - metrics.thumbHeight;
            if (trackRange > 0) {
                setGridScroll(
                    core,
                    state,
                    active.node,
                    active.scrollTop +
                        ((localPosition.y - active.pointerY) * metrics.maxScroll) / trackRange,
                );
            }
        }
        return;
    }
    if (!state.activeSlider) return;
    const localPosition = localPoint(
        core,
        event.currentTarget,
        event.clientX,
        event.clientY,
        state.activeSlider,
    );
    if (localPosition) updateSlider(state.activeSlider, localPosition.x);
}

export function pointerUp(
    core: EngineCore,
    state: EngineState,
    event: CanvasPointerEvent,
    cancelled = false,
): void {
    const hit = cancelled ? null : findHit(core, event.currentTarget, event.clientX, event.clientY);
    const point = canvasPoint(core, event.currentTarget, event.clientX, event.clientY);
    const sequence = state.pointerSequences.get(event.pointerId);
    state.pointerSequences.delete(event.pointerId);
    if (point) {
        emitPointerEvent(core, cancelled ? 'pointercancel' : 'pointerup', event, hit, point);
        const canvasView =
            sequence?.target?.type === 'canvasView'
                ? sequence.target
                : hit?.node.type === 'canvasView'
                  ? hit.node
                  : null;
        if (canvasView) {
            const local = localPoint(
                core,
                event.currentTarget,
                event.clientX,
                event.clientY,
                canvasView,
            );
            if (local) {
                emitCanvasViewPointerEvent(
                    cancelled ? 'pointercancel' : 'pointerup',
                    canvasView,
                    local.x,
                    local.y,
                    event,
                );
            }
        }
        if (
            !cancelled &&
            sequence?.eligible &&
            sequence.target === (hit?.node ?? null) &&
            Math.hypot(point.x - sequence.x, point.y - sequence.y) <= 8
        ) {
            core.onEvent?.({
                type: 'click',
                target: hit ? eventTarget(hit.node) : null,
                x: point.x,
                y: point.y,
                localX: hit?.x,
                localY: hit?.y,
                pointerId: event.pointerId,
            });
            if (hit?.node.type === 'canvasView') {
                emitCanvasViewPointerEvent('click', hit.node, hit.x, hit.y, event);
            }
            if (hit?.node.type === 'customDraw') {
                const onClick = hit.node.props.onClick;
                if (typeof onClick === 'function') {
                    const size = controlSize(hit.node);
                    (onClick as (event: CustomDrawClickEvent) => void)({
                        x: hit.x,
                        y: hit.y,
                        canvasX: point.x,
                        canvasY: point.y,
                        width: size.width,
                        height: size.height,
                        pointerId: event.pointerId,
                    });
                }
            }
        }
    }
    state.activeSlider = null;
    state.activeGridScroll = null;
    if (state.activeButton) {
        const button = state.activeButton;
        setButtonPressed(button, false);
        if (hit?.node === button) activateButton(button);
        state.activeButton = null;
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
    }
}

export function wheel(core: EngineCore, state: EngineState, event: CanvasWheelEvent): void {
    const hit = findHit(core, event.currentTarget, event.clientX, event.clientY);
    const canvasPosition = canvasPoint(core, event.currentTarget, event.clientX, event.clientY);
    if (canvasPosition) {
        core.onEvent?.({
            type: 'wheel',
            target: hit ? eventTarget(hit.node) : null,
            x: canvasPosition.x,
            y: canvasPosition.y,
            localX: hit?.x,
            localY: hit?.y,
            deltaY: event.deltaY,
        });
    }
    let grid = hit?.node ?? null;
    while (grid && grid.type !== 'grid') grid = grid.parent;
    if (!grid || typeof grid.props.height !== 'number') return;

    const point = localPoint(core, event.currentTarget, event.clientX, event.clientY, grid);
    const width = number(grid.props._gridWidth, number(grid.props.width, 0));
    const height = number(grid.props.height, 0);
    const contentHeight = number(grid.props._gridContentHeight, height);
    if (
        !point ||
        point.x < 0 ||
        point.x > width ||
        point.y < 0 ||
        point.y > height ||
        contentHeight <= height
    )
        return;

    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.height) return;
    const [a, b, c, d] = nodeTransform(grid);
    const determinant = a * d - b * c;
    if (!determinant) return;
    const deltaY = (event.deltaY * event.currentTarget.height) / rect.height / core.pixelRatio;
    const scrollTop = number(grid.props._scrollTop, 0) + (deltaY * a) / determinant;
    setGridScroll(core, state, grid, scrollTop);
    event.preventDefault();
}

function setGridScroll(
    core: EngineCore,
    state: EngineState,
    grid: SceneNode,
    nextScrollTop: number,
): boolean {
    const maxScroll = Math.max(
        0,
        number(grid.props._gridContentHeight, 0) - number(grid.props.height, 0),
    );
    const scrollTop = Math.max(0, Math.min(maxScroll, nextScrollTop));
    if (scrollTop === grid.props._scrollTop) return false;
    grid.setProps({ _scrollTop: scrollTop });
    const id = String(grid.props._gridStateKey ?? '');
    state.gridScrollPositions.set(id, scrollTop);
    for (const child of grid.children) {
        child.setProps({ y: number(child.props._gridBaseY, number(child.props.y, 0)) - scrollTop });
    }
    for (const mounted of state.textControls.values()) {
        if (!isDescendantOf(mounted.node, grid)) continue;
        mounted.layout = { ...mounted.layout, transform: nodeTransform(mounted.node) };
    }
    updateTextControlVisibility(core, state);
    (grid.props.onScroll as ((scrollTop: number) => void) | undefined)?.(scrollTop);
    return true;
}

function selectTab(core: EngineCore, state: EngineState, node: SceneNode, key: string): void {
    const stateKey = String(node.props._stateKey ?? '');
    if (node.props.activeKey === undefined) {
        state.tabSelections.set(stateKey, key);
        node.setProps({
            _activeKey: key,
            _tabItems: node.children.map((item) => ({
                title: item.props.title,
                disabled: item.props.disabled,
                selected: item.props.id === key,
            })),
        });
        node.children.forEach((item) => {
            if (item.type === 'tabItem') setTreeVisibility(item, item.props.id === key);
        });
        updateTextControlVisibility(core, state);
    }
    (node.props.onChange as ((key: string) => void) | undefined)?.(key);
}

function toggleCollapseItem(
    core: EngineCore,
    state: EngineState,
    parent: SceneNode,
    item: SceneNode,
): void {
    const stateKey = String(parent.props._stateKey ?? '');
    const active = new Set(
        Array.isArray(parent.props._activeKeys)
            ? parent.props._activeKeys.filter((key): key is string => typeof key === 'string')
            : activeCollapseKeys(state, stateKey, parent.props),
    );
    const key = String(item.props.id);
    const nextKeys = toggleCollapseKeys([...active], key, Boolean(parent.props.accordion));
    active.clear();
    nextKeys.forEach((activeKey) => active.add(activeKey));
    if (parent.props.activeKeys === undefined) {
        state.collapseSelections.set(stateKey, active);
        parent.setProps({ _activeKeys: [...active] });
        layoutCollapseNodes(parent, active);
        updateTextControlVisibility(core, state);
    }
    (parent.props.onChange as ((keys: string[]) => void) | undefined)?.([...active]);
}

function handleDialogPointer(node: SceneNode, x: number, y: number): void {
    const width = number(node.props.width, 420);
    const height = number(node.props.height, 240);
    const panelX = number(node.props._dialogPanelX, 0);
    const panelY = number(node.props._dialogPanelY, 0);
    const localX = x;
    const localY = y;
    const inPanel =
        localX >= panelX &&
        localX <= panelX + width &&
        localY >= panelY &&
        localY <= panelY + height;
    if (!inPanel && node.props.closeOnBackdrop !== false) {
        (node.props.onCancel as (() => void) | undefined)?.();
        return;
    }
    const buttonY = panelY + height - 44;
    if (!inPanel || localY < buttonY || localY > buttonY + 32) return;
    if (localX >= panelX + width - 104 && localX <= panelX + width - 24) {
        (node.props.onConfirm as (() => void) | undefined)?.();
    } else if (localX >= panelX + width - 196 && localX <= panelX + width - 116) {
        (node.props.onCancel as (() => void) | undefined)?.();
    }
}

function closeOpenDropdowns(scene: SceneNode, except?: SceneNode): void {
    scene.traverse((node) => {
        if (node !== except && node.type === 'dropdown' && node.props.open)
            node.setProps({ open: false });
    });
}

function updateSlider(node: SceneNode, localX: number): void {
    const { width } = controlSize(node);
    const value = sliderValueAt(node.props, width, localX);
    if (value === undefined) return;
    if (node.props.value === value) return;
    node.setProps({ value });
    (node.props.onChange as ((value: number) => void) | undefined)?.(value);
}
