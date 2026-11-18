import { Comment, Fragment, Text as VueText, isVNode, type VNode as VueVNode } from 'vue';
import type { ComponentKind, VNode } from '../types';
import { vueKindSymbol } from './components';

function childrenOf(node: VueVNode): unknown[] {
    if (Array.isArray(node.children)) return node.children;
    if (node.children && typeof node.children === 'object' && 'default' in node.children) {
        const defaultSlot = node.children.default;
        if (typeof defaultSlot === 'function') {
            const result: unknown = defaultSlot();
            return Array.isArray(result) ? result : [result];
        }
    }
    return [];
}

function textContent(children: unknown[]): string {
    return children
        .map((child) => {
            if (typeof child === 'string' || typeof child === 'number') return String(child);
            if (!isVNode(child)) return '';
            if (child.type === VueText) return String(child.children ?? '');
            if (child.type === Fragment) return textContent(childrenOf(child));
            return '';
        })
        .join('');
}

function compileChild(child: unknown, path: string): VNode[] {
    if (
        child === null ||
        child === undefined ||
        typeof child === 'boolean' ||
        typeof child === 'string' ||
        typeof child === 'number'
    )
        return [];
    if (Array.isArray(child)) {
        return child.flatMap((item, index) => compileChild(item, `${path}.${index}`));
    }
    if (!isVNode(child)) {
        throw new Error(
            `Unsupported child inside <Canvas> at ${path}. Use Vue Canvas UI components.`,
        );
    }
    if (child.type === Comment || child.type === VueText) return [];
    if (child.type === Fragment) {
        return childrenOf(child).flatMap((item, index) => compileChild(item, `${path}.${index}`));
    }

    const kind = (child.type as { [vueKindSymbol]?: ComponentKind })[vueKindSymbol];
    if (!kind) {
        throw new Error(
            `Unsupported component inside <Canvas> at ${path}. Use Vue Canvas UI components.`,
        );
    }

    const props = { ...(child.props ?? {}) } as Record<string, unknown>;
    const key = child.key === null ? null : String(child.key);
    delete props.key;
    const children = childrenOf(child);

    if (kind === 'text' && props.text === undefined) {
        props.text = textContent(children);
    }
    if (kind === 'button' && props.text === undefined) {
        props.text = textContent(children);
    }

    return [
        {
            type: kind,
            key,
            props,
            children:
                kind === 'group' ||
                kind === 'grid' ||
                kind === 'gridItem' ||
                kind === 'dialog' ||
                kind === 'tabs' ||
                kind === 'tabItem' ||
                kind === 'collapse' ||
                kind === 'collapseItem' ||
                kind === 'carousel' ||
                kind === 'carouselItem'
                    ? children.flatMap((item, index) => compileChild(item, `${path}.${index}`))
                    : [],
        },
    ];
}

export function compileVueChildren(children: unknown): VNode[] {
    return compileChild(children, 'canvas');
}
