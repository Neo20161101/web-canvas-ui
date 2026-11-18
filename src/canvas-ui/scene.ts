import type { ComponentKind, VNode } from './types';

export class SceneNode {
    readonly children: SceneNode[] = [];
    parent: SceneNode | null = null;
    dirty = true;
    readonly type: ComponentKind | 'root';
    props: Record<string, unknown>;

    constructor(type: ComponentKind | 'root', props: Record<string, unknown> = {}) {
        this.type = type;
        this.props = props;
    }

    setProps(props: Record<string, unknown>): void {
        this.replaceProps({ ...this.props, ...props });
    }

    replaceProps(props: Record<string, unknown>): void {
        const keys = new Set([...Object.keys(this.props), ...Object.keys(props)]);
        let changed = false;
        for (const key of keys) {
            if (this.props[key] !== props[key]) {
                changed = true;
                break;
            }
        }
        if (changed) {
            this.props = props;
            this.markDirty();
        }
    }

    markDirty(): void {
        this.dirty = true;
        this.parent?.markDirty();
    }

    syncChildren(vnodes: VNode[], onRemove: (node: SceneNode) => void): void {
        const oldChildren = [...this.children];
        const used = new Set<SceneNode>();
        const nextChildren = vnodes.map((vnode, index) => {
            const key = vnode.key === null ? null : `${vnode.type}:${vnode.key}`;
            const existing =
                key === null
                    ? oldChildren[index]?.type === vnode.type && !used.has(oldChildren[index])
                        ? oldChildren[index]
                        : undefined
                    : oldChildren.find(
                          (child) =>
                              child.props._key === key &&
                              child.type === vnode.type &&
                              !used.has(child),
                      );
            const node = existing ?? new SceneNode(vnode.type);
            if (existing) used.add(existing);
            else node.parent = this;

            const props: Record<string, unknown> = { ...vnode.props, _key: key };
            if (
                vnode.type === 'input' ||
                vnode.type === 'datePicker' ||
                vnode.type === 'textarea' ||
                vnode.type === 'dropdown' ||
                vnode.type === 'slider'
            ) {
                if (props.value === undefined) {
                    props.value =
                        existing?.props.value ??
                        props.defaultValue ??
                        (vnode.type === 'slider' ? (props.min ?? 0) : '');
                }
                if (
                    vnode.type === 'input' ||
                    vnode.type === 'datePicker' ||
                    vnode.type === 'textarea'
                ) {
                    props.focused = existing?.props.focused ?? false;
                    props.cursorPos = existing?.props.cursorPos ?? String(props.value).length;
                }
                if (vnode.type === 'dropdown') props.open = existing?.props.open ?? false;
            }
            if (vnode.type === 'switch') {
                props.checked =
                    props.checked ?? existing?.props.checked ?? props.defaultChecked ?? false;
            }
            if (vnode.type === 'radio' || vnode.type === 'checkbox') {
                props.value =
                    props.value ??
                    existing?.props.value ??
                    props.defaultValue ??
                    (vnode.type === 'checkbox' ? [] : '');
            }
            node.replaceProps(props);
            node.syncChildren(vnode.children, onRemove);
            return node;
        });

        for (const old of oldChildren) {
            if (!used.has(old) && !nextChildren.includes(old)) {
                onRemove(old);
                old.parent = null;
            }
        }
        const orderChanged =
            nextChildren.length !== this.children.length ||
            nextChildren.some((node, index) => this.children[index] !== node);
        if (orderChanged) {
            this.children.splice(0, this.children.length, ...nextChildren);
            this.markDirty();
        }
    }

    traverse(visitor: (node: SceneNode) => void): void {
        visitor(this);
        this.children.forEach((child) => child.traverse(visitor));
    }
}

export function descriptorKey(vnode: VNode, index: number, parentPath: string): string {
    return vnode.key === null ? `${parentPath}/i${index}` : `${parentPath}/k${vnode.key}`;
}
