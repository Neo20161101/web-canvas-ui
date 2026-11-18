<script lang="ts">
    import { getContext, onDestroy, type Snippet } from 'svelte';
    import type { TextProps } from '../types';
    import { canvasScopeKey, registerNode } from './registry';
    import type { NodeScope } from './registry';
    import Content from './Content.svelte';

    let { children, ...props }: Omit<TextProps, 'children'> & { children?: Snippet; key?: string | number } = $props();
    let contentText = $state('');
    const scope = getContext<NodeScope>(canvasScopeKey);
    if (!scope) throw new Error('<Text> must be used inside <Canvas>.');
    const registration = registerNode(scope, 'text', props as Record<string, unknown>);
    onDestroy(registration.dispose);
    $effect(() => registration.update({
        ...props,
        ...(props.text === undefined ? { text: contentText } : {}),
    } as Record<string, unknown>));

    function updateText(value: string): void {
        contentText = value;
    }
</script>

<Content {children} onText={updateText} />
