<script lang="ts">
    import { onMount, type Snippet } from 'svelte';

    let { children, onText }: { children?: Snippet; onText: (text: string) => void } = $props();
    let contentElement: HTMLSpanElement;

    onMount(() => {
        const update = () => onText(contentElement.textContent ?? '');
        update();
        const observer = new MutationObserver(update);
        observer.observe(contentElement, { childList: true, characterData: true, subtree: true });
        return () => observer.disconnect();
    });
</script>

<span bind:this={contentElement} aria-hidden="true" style="display:none">{@render children?.()}</span>
