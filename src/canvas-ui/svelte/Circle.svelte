<script lang="ts">
    import { getContext, onDestroy } from 'svelte';
    import type { CircleProps } from '../types';
    import { canvasScopeKey, registerNode } from './registry';
    import type { NodeScope } from './registry';

    let props: CircleProps & { key?: string | number } = $props();
    const scope = getContext<NodeScope>(canvasScopeKey);
    if (!scope) throw new Error('<Circle> must be used inside <Canvas>.');
    const registration = registerNode(scope, 'circle', props as Record<string, unknown>);
    onDestroy(registration.dispose);
    $effect(() => registration.update(props as Record<string, unknown>));
</script>
