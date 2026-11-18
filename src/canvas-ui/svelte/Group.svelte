<script lang="ts">
    import { getContext, onDestroy, setContext, type Snippet } from 'svelte';
    import type { GroupProps } from '../types';
    import { canvasScopeKey, createChildScope, registerNode } from './registry';
    import type { NodeScope } from './registry';

    let { children, ...props }: GroupProps & { children?: Snippet; key?: string | number } = $props();
    const parent = getContext<NodeScope>(canvasScopeKey);
    if (!parent) throw new Error('<Group> must be used inside <Canvas>.');
    const childScope = createChildScope(parent);
    setContext(canvasScopeKey, childScope);
    const registration = registerNode(parent, 'group', props as Record<string, unknown>, childScope);
    onDestroy(registration.dispose);
    $effect(() => registration.update(props as Record<string, unknown>));
</script>

{@render children?.()}
