import type { ComponentKind, VNode } from '../types';

export const canvasScopeKey = Symbol('canvas-ui-svelte-scope');

interface Entry {
    kind: ComponentKind;
    key: string | null;
    props: Record<string, unknown>;
    children?: NodeScope;
}

export interface NodeScope {
    entries: Map<object, Entry>;
    changed: () => void;
}

export interface NodeRegistration {
    update(props: Record<string, unknown>): void;
    dispose(): void;
}

function nodeProps(props: Record<string, unknown>): {
    key: string | null;
    props: Record<string, unknown>;
} {
    const next = { ...props };
    const key = next.key;
    delete next.key;
    return {
        key: typeof key === 'string' || typeof key === 'number' ? String(key) : null,
        props: next,
    };
}

export function createRootScope(changed: () => void): NodeScope {
    return { entries: new Map(), changed };
}

export function createChildScope(parent: NodeScope): NodeScope {
    return { entries: new Map(), changed: parent.changed };
}

export function registerNode(
    scope: NodeScope,
    kind: ComponentKind,
    props: Record<string, unknown>,
    children?: NodeScope,
): NodeRegistration {
    const token = {};
    const initial = nodeProps(props);
    const entry: Entry = { kind, key: initial.key, props: initial.props, children };
    scope.entries.set(token, entry);
    scope.changed();
    return {
        update(nextProps) {
            const next = nodeProps(nextProps);
            entry.key = next.key;
            entry.props = next.props;
            scope.changed();
        },
        dispose() {
            if (scope.entries.delete(token)) scope.changed();
        },
    };
}

export function buildTree(scope: NodeScope): VNode[] {
    return [...scope.entries.values()].map((entry) => ({
        type: entry.kind,
        key: entry.key,
        props: entry.props,
        children: entry.children ? buildTree(entry.children) : [],
    }));
}
