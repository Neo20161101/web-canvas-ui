import { describe, expect, it } from 'vitest';
import { SceneNode } from '../scene';
import { toggleSwitch } from '../components/Switch/logic';
import { activateButton, setButtonPressed } from '../components/Button/logic';
import { selectDropdownOption } from '../components/Dropdown/logic';
import { tabKeyAt } from '../components/Tabs/logic';

describe('SceneNode', () => {
    it('initialises with sensible defaults', () => {
        const node = new SceneNode('rect', { x: 1 });
        expect(node.type).toBe('rect');
        expect(node.props.x).toBe(1);
        expect(node.dirty).toBe(true);
        expect(node.children).toEqual([]);
        expect(node.parent).toBeNull();
    });

    it('merges props via setProps and marks itself dirty', () => {
        const node = new SceneNode('rect', { x: 1 });
        node.dirty = false;
        node.setProps({ y: 2 });
        expect(node.props).toEqual({ x: 1, y: 2 });
        expect(node.dirty).toBe(true);
    });

    it('ignores replaceProps when nothing actually changed', () => {
        const node = new SceneNode('rect', { x: 1 });
        node.dirty = false;
        node.replaceProps({ x: 1 });
        expect(node.dirty).toBe(false);
        node.replaceProps({ x: 5 });
        expect(node.dirty).toBe(true);
        expect(node.props.x).toBe(5);
    });

    it('propagates dirtiness up to ancestors', () => {
        const parent = new SceneNode('group');
        const child = new SceneNode('rect');
        child.parent = parent;
        parent.dirty = false;
        child.dirty = false;
        child.markDirty();
        expect(child.dirty).toBe(true);
        expect(parent.dirty).toBe(true);
    });

    it('visits every node in the subtree via traverse', () => {
        const root = new SceneNode('root');
        root.syncChildren([{ type: 'rect', key: null, props: {}, children: [] }], () => {});
        const visited: string[] = [];
        root.traverse((node) => visited.push(node.type));
        expect(visited).toEqual(['root', 'rect']);
    });

    it('injects default value/focus state for controlled text inputs', () => {
        const root = new SceneNode('root');
        root.syncChildren([{ type: 'input', key: null, props: {}, children: [] }], () => {});
        const input = root.children[0];
        expect(input.props.value).toBe('');
        expect(input.props.focused).toBe(false);
        expect(input.props.cursorPos).toBe(0);
    });
});

describe('node-driven interaction logic', () => {
    it('toggleSwitch flips checked and notifies onChange', () => {
        const node = new SceneNode('switch', { checked: false });
        let emitted: unknown;
        node.setProps({
            onChange: (value: boolean) => {
                emitted = value;
            },
        });
        toggleSwitch(node);
        expect(node.props.checked).toBe(true);
        expect(emitted).toBe(true);
    });

    it('activateButton fires onClick only when enabled', () => {
        let calls = 0;
        const enabled = new SceneNode('button');
        enabled.setProps({
            onClick: () => {
                calls += 1;
            },
        });
        activateButton(enabled);
        expect(calls).toBe(1);

        const disabled = new SceneNode('button', { disabled: true });
        disabled.setProps({
            onClick: () => {
                calls += 1;
            },
        });
        activateButton(disabled);
        expect(calls).toBe(1);
    });

    it('setButtonPressed records the press state', () => {
        const node = new SceneNode('button');
        setButtonPressed(node, true);
        expect(node.props.pressed).toBe(true);
    });

    it('selectDropdownOption sets the value, closes the list and notifies', () => {
        const node = new SceneNode('dropdown', { open: true });
        let emitted: unknown;
        node.setProps({
            onChange: (value: string) => {
                emitted = value;
            },
        });
        selectDropdownOption(node, { label: 'A', value: 'a' });
        expect(node.props.value).toBe('a');
        expect(node.props.open).toBe(false);
        expect(emitted).toBe('a');
    });

    it('tabKeyAt resolves the header index under the pointer', () => {
        const items = [
            new SceneNode('tabItem', { id: 't1' }),
            new SceneNode('tabItem', { id: 't2' }),
        ];
        expect(tabKeyAt(items, 150, 0, 200, 40)).toBe('t2');
        expect(tabKeyAt(items, 150, 40, 200, 40)).toBeUndefined();
        expect(
            tabKeyAt([new SceneNode('tabItem', { id: 't1', disabled: true })], 10, 0, 200, 40),
        ).toBeUndefined();
    });
});
