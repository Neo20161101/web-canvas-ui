import type { SceneNode } from '../scene';
import type { InputEvents, TextControlProps } from '../types';
import { isTextControlVisible } from './nodes';
import type { EngineCore, EngineState, TextControlDescription } from './state';

/**
 * Keeps the off-canvas DOM input overlay (text inputs / textareas / date pickers)
 * in sync with the scene graph: mount/update/teardown bridges and push value,
 * focus and scroll state back into the corresponding {@link SceneNode}s.
 */

export function syncTextControls(
    core: EngineCore,
    state: EngineState,
    descriptions: TextControlDescription[],
): void {
    const nodes = new Map<string, SceneNode>();
    core.scene.traverse((node) => {
        const id = node.props._canvasInputId;
        if (typeof id === 'string') nodes.set(id, node);
    });

    const activeIds = new Set(descriptions.map((item) => item.id));
    for (const [id, mounted] of state.textControls) {
        if (!activeIds.has(id) || nodes.get(id) !== mounted.node) {
            mounted.dispose();
            state.textControls.delete(id);
            state.inputValues.delete(id);
        }
    }

    for (const description of descriptions) {
        const node = nodes.get(description.id);
        if (!node) continue;
        const layout = {
            ...description.layout,
            visible: isTextControlVisible(node, description.layout),
        };
        const value =
            description.props.value ??
            state.inputValues.get(description.id) ??
            description.props.defaultValue ??
            '';
        node.setProps({
            ...node.props,
            ...description.props,
            value,
            _canvasInputId: description.id,
            _controlledValue: description.props.value !== undefined,
        });

        const mounted = state.textControls.get(description.id);
        if (mounted) {
            mounted.layout = layout;
            core.inputBridge.update(description.id, { ...description.props, value }, layout);
            continue;
        }

        const events: InputEvents = {
            input: (nextValue, cursor) => {
                if (node.props._controlledValue !== true)
                    state.inputValues.set(description.id, nextValue);
                node.setProps({ value: nextValue, cursorPos: cursor });
                const callback = node.props.onChange;
                if (typeof callback === 'function') callback(nextValue);
            },
            selection: (cursor) => node.setProps({ cursorPos: cursor }),
            focus: () => {
                node.setProps({ focused: true });
                const callback = node.props.onFocus;
                if (typeof callback === 'function') callback();
            },
            blur: () => {
                node.setProps({ focused: false });
                const callback = node.props.onBlur;
                if (typeof callback === 'function') callback();
            },
            scroll: (scrollTop, scrollHeight, clientHeight) => {
                if (
                    node.props._scrollTop === scrollTop &&
                    node.props._scrollHeight === scrollHeight &&
                    node.props._scrollClientHeight === clientHeight
                )
                    return;
                node.setProps({
                    _scrollTop: scrollTop,
                    _scrollHeight: scrollHeight,
                    _scrollClientHeight: clientHeight,
                });
            },
        };
        const dispose = core.inputBridge.mount(
            description.id,
            { ...description.props, value },
            layout,
            events,
        );
        state.textControls.set(description.id, { node, dispose, layout });
    }
}

export function updateTextControlVisibility(core: EngineCore, state: EngineState): void {
    for (const mounted of state.textControls.values()) {
        const visible = isTextControlVisible(mounted.node, mounted.layout);
        mounted.layout = { ...mounted.layout, visible };
        core.inputBridge.update(
            String(mounted.node.props._canvasInputId),
            mounted.node.props as unknown as TextControlProps,
            mounted.layout,
        );
    }
}

export function removeTextControls(state: EngineState, node: SceneNode): void {
    node.children.forEach((child) => removeTextControls(state, child));
    const id = node.props._canvasInputId;
    if (typeof id === 'string') {
        state.textControls.get(id)?.dispose();
        state.textControls.delete(id);
        state.inputValues.delete(id);
    }
}
