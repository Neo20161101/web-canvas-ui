<script lang="ts">
    import { getContext, onDestroy } from 'svelte';
    import type { InputProps } from '../types';
    import { canvasScopeKey, registerNode } from './registry';
    import type { NodeScope } from './registry';

    let props: InputProps & { key?: string | number } = $props();
    const scope = getContext<NodeScope>(canvasScopeKey);
    if (!scope) throw new Error('<Input> must be used inside <Canvas>.');
    const registration = registerNode(scope, 'input', props as Record<string, unknown>);
    onDestroy(registration.dispose);
    $effect(() => registration.update(props as Record<string, unknown>));
</script>
