<script lang="ts">
    import { getContext, onDestroy, setContext, type Snippet } from 'svelte';
    import type { CarouselItemProps } from '../types';
    import { canvasScopeKey, createChildScope, registerNode } from './registry';
    import type { NodeScope } from './registry';

    let { children, ...props }: Omit<CarouselItemProps, 'children'> & {
        children?: Snippet;
        key?: string | number;
    } = $props();
    const parent = getContext<NodeScope>(canvasScopeKey);
    if (!parent) throw new Error('<CarouselItem> must be used inside <Carousel>.');
    const childScope = createChildScope(parent);
    setContext(canvasScopeKey, childScope);
    const registration = registerNode(parent, 'carouselItem', props as Record<string, unknown>, childScope);
    onDestroy(registration.dispose);
    $effect(() => registration.update(props as Record<string, unknown>));
</script>

{@render children?.()}
