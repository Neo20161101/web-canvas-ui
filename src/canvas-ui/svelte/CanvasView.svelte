<script lang="ts">
    import { getContext, onDestroy } from 'svelte';
    import type { CanvasViewProps } from '../types';
    import { canvasScopeKey, registerNode } from './registry';
    import type { NodeScope } from './registry';

    let props: CanvasViewProps & { key?: string | number } = $props();
    const scope = getContext<NodeScope>(canvasScopeKey);
    if (!scope) throw new Error('<CanvasView> must be used inside <Canvas>.');
    const registration = registerNode(scope, 'canvasView', props as Record<string, unknown>);
    onDestroy(registration.dispose);
    $effect(() => registration.update(props as Record<string, unknown>));
</script>
