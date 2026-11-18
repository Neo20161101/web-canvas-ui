<script lang="ts">
    import { getContext, onDestroy, setContext, type Snippet } from 'svelte';
    import type { CollapseItemProps } from '../types';
    import { canvasScopeKey, createChildScope, registerNode } from './registry';
    import type { NodeScope } from './registry';

    let { children, ...props }: Omit<CollapseItemProps, 'children'> & { children?: Snippet; key?: string | number } = $props();
    const parent = getContext<NodeScope>(canvasScopeKey);
    if (!parent) throw new Error('<CollapseItem> must be used inside <Collapse>.');
    const childScope = createChildScope(parent);
    setContext(canvasScopeKey, childScope);
    const registration = registerNode(parent, 'collapseItem', props as Record<string, unknown>, childScope);
    onDestroy(registration.dispose);
    $effect(() => registration.update(props as Record<string, unknown>));
</script>

{@render children?.()}
