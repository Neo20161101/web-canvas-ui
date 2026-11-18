// Ambient module declaration so the plain-TypeScript build (`tsc`) can resolve
// the `*.svelte` re-exports in this adapter. The actual Svelte single-file
// components are compiled by the Svelte toolchain, not by `tsc`.
declare module '*.svelte' {
    import type { ComponentType } from 'svelte';
    const component: ComponentType;
    export default component;
}
