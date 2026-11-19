import { mount } from 'svelte';
import 'web-canvas-ui/theme.css';
import SvelteDemo from './SvelteDemo.svelte';

const target = document.getElementById('root');
if (target) {
    mount(SvelteDemo, { target });
}
