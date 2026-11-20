<div align="center">
  <img src="./src/assets/web-canvas-ui-logo-bright.svg" alt="Project Logo" />
</div>

# Web Canvas UI (React, Vue 3, Svelte, Angular)

[English](./README.md) · [日本語](./README.ja.md) · [한국어](./README.ko.md) · [繁體中文](./README.zh-TW.md) · [Русский](./README.ru.md) · [简体中文](./README.zh-CN.md)

A declarative component library built on Canvas 2D, with **React**, **Vue 3**, **Svelte 5+**, and **Angular 17+** adapters. Each framework imports from its own entry and uses native component/template syntax, while the underlying Canvas engine and control drawing logic are shared. Every control's appearance is painted by Canvas itself.

> **Adapters:** React, Vue, Svelte, and Angular import from `@web-canvas-ui/react`, `@web-canvas-ui/vue`, `@web-canvas-ui/svelte`, and `@web-canvas-ui/angular` respectively. Pick the entry that matches your host Canvas framework and do not mix components across adapters — they all reuse the same engine and control drawing implementation.

> **Shared component contract:** Each control lives under `components/<Component>/`. The `components.ts` entry exposes the public API, `<component>.ts` defines the Props type and the Canvas draw function, and `logic.ts` (when needed) holds interaction/business logic specific to that control. Common types are aggregated in `components/types.ts` and re-exported through `web-canvas-ui/types.ts`. React, Vue, Svelte, and Angular adapters share this type contract.

### Packages
- [web-canvas-ui](https://www.npmjs.com/package/web-canvas-ui)

## Global Theme Colors

Theme colors are centralized in [`theme.scss`](src/canvas-ui/theme.scss) as `$primary: #1668dc`. Changing this single variable updates the accent color for buttons, selected states, focus borders, progress bars, and more. Light variants are mixed with white, and pressed variants darken the primary; the shared scales are also emitted as `--canvas-ui-primary*` CSS variables. `theme.css` is a build artifact — import it as global CSS and do not edit the generated file directly:

```css
@import 'web-canvas-ui/theme.css';
```

After editing `theme.scss`, run `npm run build:theme` to regenerate the CSS. The compiled CSS custom properties apply to React, Vue, Svelte, and Angular, and provide `.dark` and `[data-theme="dark"]` dark themes. Colors passed explicitly to a component take precedence over theme variables.

Five built-in primary palettes are provided: blue, green, purple, orange, and red. Add the corresponding class to the outer Canvas container to switch palettes; they also combine with the dark theme:

```tsx
<div className="theme-green">
    <Canvas width={400} height={240}>
        <Button>Green theme</Button>
    </Canvas>
</div>
<p>--OR--</p>
<Canvas width={400} height={240} className="theme-green">
    <Button>Green theme</Button>
</Canvas>
```

| Palette        | class          | Primary   |
| -------------- | -------------- | --------- |
| Blue (default) | `theme-blue`   | `#1668dc` |
| Green          | `theme-green`  | `#389e0d` |
| Purple         | `theme-purple` | `#722ed1` |
| Orange         | `theme-orange` | `#d46b08` |
| Red            | `theme-red`    | `#cf1322` |

For example, adding both `dark` and `theme-purple` — or `data-theme="dark"` and `theme-purple` — enables the purple dark theme. In every palette, the light / pressed / dark accent variants are derived from the corresponding primary color by Sass.

| Component                     | CSS custom properties                                                                                                                                                                                                                                                                                |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button / Upload               | `--canvas-ui-button-background`, `--canvas-ui-button-color`, `--canvas-ui-button-border`, `--canvas-ui-button-pressed-background`                                                                                                                                                                    |
| Carousel                      | `--canvas-ui-carousel-arrow`, `--canvas-ui-carousel-dot`, `--canvas-ui-carousel-active-dot`                                                                                                                                                                                                          |
| Radio / Checkbox              | `--canvas-ui-choice-active`, `--canvas-ui-choice-border`, `--canvas-ui-choice-color`, `--canvas-ui-choice-disabled`, `--canvas-ui-choice-disabled-background`                                                                                                                                        |
| Collapse                      | `--canvas-ui-collapse-header-background`, `--canvas-ui-collapse-border`, `--canvas-ui-collapse-color`, `--canvas-ui-collapse-disabled-color`                                                                                                                                                         |
| Dialog                        | `--canvas-ui-dialog-mask`, `--canvas-ui-dialog-background`, `--canvas-ui-dialog-title-color`, `--canvas-ui-dialog-border`, `--canvas-ui-dialog-confirm-background`, `--canvas-ui-dialog-cancel-background`, `--canvas-ui-dialog-confirm-color`, `--canvas-ui-dialog-cancel-color`                    |
| Dropdown                      | `--canvas-ui-dropdown-background`, `--canvas-ui-dropdown-color`, `--canvas-ui-dropdown-placeholder-color`, `--canvas-ui-dropdown-border`, `--canvas-ui-dropdown-focus-border`, `--canvas-ui-dropdown-option-background`, `--canvas-ui-dropdown-option-border`, `--canvas-ui-dropdown-disabled-color` |
| Input / Textarea / DatePicker | `--canvas-ui-input-background`, `--canvas-ui-input-color`, `--canvas-ui-input-placeholder-color`, `--canvas-ui-input-border`, `--canvas-ui-input-focus-border`                                                                                                                                       |
| Progress                      | `--canvas-ui-progress-track`, `--canvas-ui-progress-active`, `--canvas-ui-progress-text`                                                                                                                                                                                                             |
| Rect / Circle / Text / Icon   | `--canvas-ui-rect-background`, `--canvas-ui-rect-border`, `--canvas-ui-circle-background`, `--canvas-ui-circle-border`, `--canvas-ui-text-color`, `--canvas-ui-icon-color`                                                                                                                           |
| Slider                        | `--canvas-ui-slider-track`, `--canvas-ui-slider-active`, `--canvas-ui-slider-thumb`                                                                                                                                                                                                                  |
| Switch                        | `--canvas-ui-switch-on`, `--canvas-ui-switch-off`, `--canvas-ui-switch-thumb`                                                                                                                                                                                                                        |
| Tabs                          | `--canvas-ui-tabs-background`, `--canvas-ui-tabs-color`, `--canvas-ui-tabs-active-color`, `--canvas-ui-tabs-indicator`, `--canvas-ui-tabs-disabled-color`                                                                                                                                            |

To customize the theme for a specific application, override only the variables you need in your own CSS, e.g. `.brand { --canvas-ui-button-background: #6d4aff; }`. The table above lists every theme variable each component actually reads.

## Environment and Imports

Place the `web-canvas-ui` directory into your project and make sure the host Canvas project is already configured for the chosen framework: React 19+, Vue 3, Svelte 5+, or Angular 17+. Vue uses single-file component templates and does not require a JSX plugin or `jsxImportSource`. Svelte projects need the Svelte compiler and its matching build plugin. Angular projects need `@angular/core` and the Angular build setup. Framework dependencies are provided by the host Canvas project — this directory does not enforce dependencies on any particular framework.

```
npm install web-canvas-ui
```
OR
```
npm install @web-canvas-ui/react

npm install @web-canvas-ui/vue

npm install @web-canvas-ui/svelte

npm install @web-canvas-ui/angular
```

| Framework   | Entry                   |
| ----------- |-------------------------|
| React       | `web-canvas-ui/react \ @web-canvas-ui/react`     |
| Vue 3       | `web-canvas-ui/vue \ @web-canvas-ui/vue`         |
| Svelte 5+   | `web-canvas-ui/svelte \ @web-canvas-ui/svelte`   |
| Angular 17+ | `web-canvas-ui/angular \ @web-canvas-ui/angular` |

Components must be placed inside the corresponding adapter's Canvas container and use the scene components exported by that framework's entry. Do not place plain DOM elements inside a Canvas scene.

## Quick Start (React)

```tsx
import { useRef, useState } from 'react';
import { Canvas, Group, Rect, Text, Input, Button } from '@web-canvas-ui/react';
import type { CanvasHandle } from '@web-canvas-ui/react';
import './theme.css';

export function ProfileCanvas() {
    const [name, setName] = useState('');
    const canvasRef = useRef<CanvasHandle>(null);

    const exportPng = () => {
        const dataUrl = canvasRef.current?.toDataURL({
            type: 'image/png',
            pixelRatio: 2,
        });
        if (!dataUrl) return;

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'profile.png';
        link.click();
    };

    return (
        <section>
            <Canvas ref={canvasRef} width={420} height={220}>
                <Group x={24} y={24}>
                    <Rect width={340} height={170} color="#f5f8fc" radius={12} />
                    <Text x={16} y={16} fontSize={20} color="#222">
                        Profile
                    </Text>
                    <Input
                        x={16}
                        y={54}
                        width={280}
                        height={38}
                        value={name}
                        placeholder="Your name"
                        onChange={setName}
                    />
                    <Text x={16} y={108} width={280} fontSize={16}>
                        {name ? `Hello, ${name}` : 'Type your name'}
                    </Text>
                    <Button
                        x={16}
                        y={136}
                        width={120}
                        height={36}
                        backgroundColor="#3478f6"
                        fontColor="#fff"
                        onClick={exportPng}
                    >
                        Export Image
                    </Button>
                </Group>
            </Canvas>
        </section>
    );
}
```

`x` and `y` are the component's position relative to its parent, in Canvas logical pixels. `Group` can be nested; child coordinates accumulate the parent's position, scale, and rotation.

## Quick Start (Vue 3 Single-File Component)

The Vue adapter lives at the dedicated `web-canvas-ui/vue` entry. Nest Canvas UI components directly in a `.vue` template — no TSX, no JSX plugin, no manual Canvas node arrays:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Canvas, Group, Rect, Text, Input, Button } from '@web-canvas-ui/vue';
import type { CanvasHandle } from '@web-canvas-ui/vue';
import './theme.css';

const name = ref('');
const canvasRef = ref<CanvasHandle | null>(null);

function exportPng() {
    const dataUrl = canvasRef.value?.toDataURL({
        type: 'image/png',
        pixelRatio: 2,
    });
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'profile.png';
    link.click();
}
</script>

<template>
    <Canvas ref="canvasRef" :width="420" :height="220">
        <Group :x="24" :y="24">
            <Rect :width="340" :height="170" color="#f5f8fc" :radius="12" />
            <Text :x="16" :y="16" :font-size="20">Vue 3 Canvas</Text>
            <Input
                :x="16"
                :y="54"
                :width="280"
                :height="38"
                :value="name"
                placeholder="Your name"
                @change="name = $event"
            />
            <Text :x="16" :y="104" :width="280">
                {{ name ? `Hello, ${name}` : 'Type your name' }}
            </Text>
            <Button :x="16" :y="142" :width="120" :height="36" @click="exportPng">
                Export Image
            </Button>
        </Group>
    </Canvas>
</template>
```

In the Vue template, bind reactive state with `:value` and update it via `@change`; Canvas components sync the scene after Vue updates.

## Quick Start (Svelte 5+)

Use the Svelte entry's components inside a Svelte 5 template. `Canvas` exposes imperative methods through `bind:this`:

```svelte
<script lang="ts">
  import { Canvas, Group, Rect, Text, Input, Button } from '@web-canvas-ui/svelte';
  import type { CanvasHandle } from '@web-canvas-ui/svelte';
  import './theme.css';

  let name = $state('');
  let canvas = $state<CanvasHandle>();

  function exportPng() {
    const dataUrl = canvas?.toDataURL({ type: 'image/png', pixelRatio: 2 });
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'profile.png';
    link.click();
  }
</script>

<Canvas bind:this={canvas} width={420} height={180}>
  <Group x={16} y={16}>
    <Rect width={340} height={140} color="#f5f8fc" radius={12} />
    <Text x={16} y={16} text="Svelte Canvas" />
    <Input
      x={16}
      y={48}
      value={name}
      placeholder="Your name"
      onChange={(value) => name = value}
    />
    <Text x={16} y={92} text={name ? `Hello, ${name}` : 'Type your name'} />
    <Button x={220} y={48} text="Export" onClick={exportPng} />
  </Group>
</Canvas>
```

Changes to Svelte control props are synced to the Canvas scene;

## Quick Start (Angular 17+)

The Angular entry provides a standalone `Canvas` component and scene directives. Import the required symbols in whichever standalone component uses them:

```ts
import { Component, ViewChild } from '@angular/core';
import { Button, Canvas, Group, Input, Rect, Text } from '@web-canvas-ui/angular';

@Component({
    selector: 'app-root',
    styleUrl: './theme.css',
    standalone: true,
    imports: [Canvas, Group, Rect, Text, Input, Button],
    template: `
        <canvas-ui #canvas="canvasUi" [width]="420" [height]="180">
            <canvas-group [x]="16" [y]="16">
                <canvas-rect
                    [width]="340"
                    [height]="140"
                    color="#f5f8fc"
                    [radius]="12"
                ></canvas-rect>
                <canvas-text [x]="16" [y]="16" text="Angular Canvas"></canvas-text>
                <canvas-input
                    [x]="16"
                    [y]="48"
                    [value]="name"
                    placeholder="Your name"
                    (valueChange)="onInputChange($event)"
                ></canvas-input>
                <canvas-text
                    [x]="16"
                    [y]="92"
                    [text]="name ? 'Hello, ' + name : 'Type your name'"
                ></canvas-text>
                <canvas-button
                    [x]="220"
                    [y]="48"
                    text="Export"
                    (click)="exportPng()"
                ></canvas-button>
            </canvas-group>
        </canvas-ui>
    `,
})
export class ProfileCanvas {
    name = '';
    @ViewChild('canvas') canvas?: Canvas;

    exportPng() {
        const dataUrl = this.canvas?.toDataURL({ type: 'image/png', pixelRatio: 2 });
        if (!dataUrl) return;
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'profile.png';
        link.click();
    }
    onInputChange(e:any) {
        this.name = e;
    }
}
```

Angular uses `<canvas-...>` directive selectors to declare Canvas scene nodes. Inputs, dropdowns, and sliders emit through `(valueChange)`, switches through `(checkedChange)`, and buttons through `(click)`.

Interaction props follow each framework's convention: React uses `onChange`/`onClick` props, Vue uses `@change`/`@click`, Svelte uses `onChange`/`onClick` callback props, and Angular uses `(valueChange)`, `(checkedChange)`, and `(click)` output bindings.

## Common Props

Every visible component except `<Canvas>` supports the following transform props:

| Prop       | Type      | Default | Description                                                                                              |
| ---------- | --------- | ------: | -------------------------------------------------------------------------------------------------------- |
| `x`        | `number`  |     `0` | Horizontal position relative to the parent.                                                              |
| `y`        | `number`  |     `0` | Vertical position relative to the parent.                                                                |
| `rotation` | `number`  |     `0` | Rotation in radians.                                                                                     |
| `scaleX`   | `number`  |     `1` | Horizontal transform scale.                                                                              |
| `scaleY`   | `number`  |     `1` | Vertical transform scale.                                                                                |
| `visible`  | `boolean` |  `true` | Whether the component is drawn; when `false`, its children are also hidden and do not respond to clicks. |

### Sizing Rules

- `Rect`, `Input`, `Textarea`, `Upload`, `Dropdown`, `DatePicker`, `Slider`, `Switch`, and `Button` use `width` and `height` to set their size.
- `Circle` uses `radius` (default `10`); the diameter is twice the radius.
- `Text` uses `fontSize` for the type size and `width` for the wrap width.
- When `width`/`height` are omitted, each component falls back to the default listed in its documentation. `Group` is a container and has no intrinsic width or height; `Grid` lays out based on column count and cell props.
- `Grid` arranges children in order; specify `columns`, `cellHeight`, and an optional `gap`. Cell width can be fixed via `cellWidth` or distributed evenly via `width`. Direct children occupy one cell by default; `GridItem` groups multiple controls and sets col/row spans — sizes of children inside a group remain governed by their own props.

## Component Props

### `<Canvas>`

Creates a Canvas scene. Sizes are in logical pixels; the underlying bitmap is multiplied by the pixel ratio.

| Prop                                               | Type                                                                             | Required |                                                                 Default | Description                                                                                                                           |
| -------------------------------------------------- | -------------------------------------------------------------------------------- | -------: | ----------------------------------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------- |
| `width`                                            | `number`                                                                         |      Yes |                                                                       — | Logical Canvas width.                                                                                                                 |
| `height`                                           | `number`                                                                         |      Yes |                                                                       — | Logical Canvas height.                                                                                                                |
| Pixel ratio                                        | Automatic                                                                        |        — | Reads `window.devicePixelRatio` with a floor of `1`; no prop is needed. | Canvas rendering resolution ratio.                                                                                                    |
| `className` (React/Angular) / `class` (Vue/Svelte) | `string`                                                                         |       No |                                                                       — | CSS class for the outer container.                                                                                                    |
| `style`                                            | Framework-specific style object or string                                        |       No |                                                                       — | Style for the outer container; `position`, `width`, and `height` are managed by the component.                                        |
| `ariaLabel`                                        | `string`                                                                         |       No |                                                              `"Canvas"` | Accessibility label for the Canvas element.                                                                                           |
| `onFrame`                                          | `(time: number) => void`                                                         |       No |                                                                       — | Per-frame callback; `time` is the browser animation-frame timestamp.                                                                  |
| `onEvent`                                          | `(event: CanvasUIEvent) => void`                                                 |       No |                                                                       — | Unified event entry point for the Canvas, receiving `pointerdown`, `pointermove`, `pointerup`, `pointercancel`, `click`, and `wheel`. |
| Children                                           | React children / Vue default slot / Svelte children / Angular content projection |       No |                                                                       — | Canvas UI component tree.                                                                                                             |

`onEvent` payloads include the Canvas logical coordinates `x`/`y`, the hit `target` (the component's `type` and user `key`; `null` on empty space), and the hit component's local coordinates `localX`/`localY`. `wheel` events additionally expose `deltaY`, and pointer events expose `pointerId`. The unified `click` fires only when the same target is pressed and released with movement no greater than 8 logical pixels; drags or cancellations do not emit `click`. Existing per-component callbacks such as `onClick` and `onChange` still run as usual; `onEvent` is best suited for cross-component logic or unified analytics.

```tsx
<Canvas
    width={420}
    height={220}
    onEvent={(event) => {
        if (event.type === 'click' && event.target?.type === 'button') {
            console.log('button clicked:', event.target.key);
        }
    }}
>
    {/* canvas components */}
</Canvas>
```

Screenshot APIs are available through React ref, Vue template ref, Svelte `bind:this`, or Angular template references — see [Image Export](#image-export). `CanvasHandle` also exposes `requestRender()`, used to schedule a redraw of the host Canvas after a source Canvas updates.

### `<CanvasView>`

Renders the picture of an `HTMLCanvasElement` — from a third-party module or elsewhere in the same page — inside the current Canvas. Only the pixel content is embedded; the source Canvas's DOM or event handlers are not brought into the current Canvas.

| Prop               | Type                                      | Required |     Default | Description                                                                                                                                                             |
| ------------------ | ----------------------------------------- | -------: | ----------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`           | `HTMLCanvasElement`                       |      Yes |           — | The source Canvas instance to display.                                                                                                                                  |
| `width` / `height` | `number`                                  |      Yes |           — | Logical size occupied in the current Canvas.                                                                                                                            |
| `fit`              | `'contain' \| 'cover' \| 'fill'`          |       No | `'contain'` | Preserve aspect and fit fully, preserve aspect and crop to fill, or stretch to fill.                                                                                    |
| `onPointerEvent`   | `(event: CanvasViewPointerEvent) => void` |       No |           — | Provides mapped `pointerdown`, `pointermove`, `pointerup`, `pointercancel`, and `click` events; synthetic events are not dispatched to the source Canvas automatically. |

```tsx
import { Canvas, CanvasView } from '@web-canvas-ui/react';

<Canvas ref={canvasRef} width={640} height={360}>
    <CanvasView
        x={20}
        y={20}
        source={thirdPartyCanvas}
        width={320}
        height={180}
        fit="contain"
        onPointerEvent={(event) => {
            thirdPartyApi.handlePointer({
                type: event.type,
                x: event.sourceX,
                y: event.sourceY,
                pointerId: event.pointerId,
            });
        }}
    />
</Canvas>;

// After the third-party Canvas updates its content, request a redraw of the host Canvas:
canvasRef.current?.requestRender();
```

Events include `x`/`y` (CanvasView-local logical coordinates), `sourceX`/`sourceY` (source Canvas bitmap pixel coordinates), source canvas size, button state, `pointerId`, `pointerType`, `pressure`, and `isPrimary`. `contain` letterbox areas do not register hits. During drags, events keep reporting source canvas coordinates even when the pointer briefly leaves the component's bounds. Use this data to call the third-party library's interaction APIs. The source Canvas does not automatically notify the host Canvas of content changes — call the host's `requestRender()` after updating the source, or update the source inside an animation frame and call `requestRender()` there. If the source Canvas contains images without proper CORS authorization, the host Canvas becomes tainted and export will fail — Canvas cross-origin restrictions cannot be bypassed by this component.

### `<CustomDraw>`

When built-in components cannot cover your drawing needs, use `CustomDraw` to provide a Canvas 2D drawing callback. It runs on every scene redraw (including image export); the callback's origin is the component's top-left corner, and it can use all common position/rotation/scale props.

| Prop               | Type                                                                                   | Required | Description                                                                                                                                                 |
| ------------------ | -------------------------------------------------------------------------------------- | -------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `width` / `height` | `number`                                                                               |      Yes | Size of the custom drawing region; must be non-negative finite numbers.                                                                                     |
| `draw`             | `(context: CanvasRenderingContext2D, size: { width: number; height: number }) => void` |      Yes | Executes synchronous drawing inside the region; `size` provides the corresponding width and height.                                                         |
| `onClick`          | `(event: CustomDrawClickEvent) => void`                                                |       No | Click callback; `x`/`y` are component-local coordinates, `canvasX`/`canvasY` are Canvas logical coordinates, and size plus `pointerId` are also provided.   |
| `hitTest`          | `(x: number, y: number, size: CustomDrawSize) => boolean`                              |       No | Custom hit testing for the shape; falls back to the full width/height rectangle when omitted. Returning `false` allows lower components to receive the hit. |

```tsx
import { Canvas, CustomDraw } from '@web-canvas-ui/react';

<Canvas width={320} height={180}>
    <CustomDraw
        x={20}
        y={20}
        width={160}
        height={100}
        hitTest={(x, y) => Math.abs(y - (x * 100) / 160) < 6}
        onClick={({ x, y }) => console.log('local position:', x, y)}
        draw={(ctx, { width, height }) => {
            ctx.strokeStyle = '#1668dc';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(width, height);
            ctx.stroke();
        }}
    />
</Canvas>;
```

Each invocation is isolated from the rest of the Canvas drawing state — colors, line widths, and transforms set inside the callback do not leak to other components. Only draw inside the callback; do not update UI state or perform side effects. Drawing errors are re-thrown as-is.

### `<Group>`

Used to group, position, and transform children. Supports [Common Props](#common-props), plus:

| Prop     | Type                                                          | Description                 |
| -------- | ------------------------------------------------------------- | --------------------------- |
| Children | React children / Vue/Svelte slot / Angular content projection | Child Canvas UI components. |

```tsx
<Group x={20} y={30} scaleX={1.2}>
    <Text x={10} y={10}>
        Text inside a group
    </Text>
</Group>
```

### `<Grid>`

Places children in order into fixed-size cells, wrapping to the next row once a row fills the specified column count. `Grid` does not draw a background; it is a layout container and can use transform props like `Group`.

| Prop         | Type                          | Required | Default | Description                                                                                                                                                                                                             |
| ------------ | ----------------------------- | -------: | ------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `columns`    | `number`                      |      Yes |       — | Columns per row; must be a positive integer.                                                                                                                                                                            |
| `width`      | `number`                      |       No |       — | Total Grid width. Required when `cellWidth` is not passed; distributed evenly across columns after subtracting inter-column gaps. Can be omitted when `cellWidth` is set — width is then derived from the column count. |
| `height`     | `number`                      |       No |       — | Fixed visible height. Overflow is clipped and a scrollbar appears; wheel scrolling works inside the Grid.                                                                                                               |
| `cellWidth`  | `number`                      |       No |       — | Fixed logical cell width; takes precedence over `width` auto-distribution. Must be positive.                                                                                                                            |
| `cellHeight` | `number`                      |      Yes |       — | Logical cell height; must be positive.                                                                                                                                                                                  |
| `gap`        | `number`                      |       No |     `0` | Equal row and column spacing; must not be negative.                                                                                                                                                                     |
| `onScroll`   | `(scrollTop: number) => void` |       No |       — | Scroll position change callback, in logical pixels.                                                                                                                                                                     |

Direct children keep their own `x` and `y`, plus the offset of the cell they fall into. When `cellWidth` is not passed, columns are equal-width: `(width - gap * (columns - 1)) / columns`. A child's own size is not automatically stretched.

Every child is also handed the box of the cell it occupies: a `<Text>` that declares neither `width` nor `maxLines` wraps to the cell width and stops with an ellipsis once the lines no longer fit `cellHeight`. A `<GridItem>` passes its span-expanded area down to the controls it groups. Declaring either prop overrides the cell box, so a node can stay deliberately narrower than its cell.

```tsx
<Grid columns={3} cellWidth={100} cellHeight={50} gap={8}>
    <Rect width={80} height={40} color="#f5f8fc" />
    <Rect width={80} height={40} color="#e5efff" />
    <Rect width={80} height={40} color="#d5e5ff" />
</Grid>
```

To split the total width evenly across columns, omit `cellWidth`:

```tsx
<Grid columns={3} width={316} cellHeight={50} gap={8}>
    <Rect width={80} height={40} color="#f5f8fc" />
    <Rect width={80} height={40} color="#e5efff" />
    <Rect width={80} height={40} color="#d5e5ff" />
</Grid>
```

Vue and Svelte use the same prop names; Angular uses `<canvas-grid [columns]="3" [width]="316" [cellHeight]="50" [gap]="8">` and imports `Grid` from the corresponding module.

Once a Grid has a `height`, content beyond the visible area is scrollable via the mouse wheel and children are clipped inside the fixed height:

```tsx
<Grid columns={1} width={280} height={180} cellHeight={44} gap={4}>
    {items.map((item) => (
        <GridItem key={item.id}>
            <Text>{item.label}</Text>
        </GridItem>
    ))}
</Grid>
```

### `<GridItem>`

`GridItem` is a grouping/layout node inside a Grid and does not draw anything itself. It can contain multiple controls, positioning them together as one grid entry; children inside the group still use their own sizes and local coordinates. Placing ordinary controls directly under `Grid` also works — they each occupy one cell by default.

| Prop                                         | Type     | Default | Description                                                                   |
| -------------------------------------------- | -------- | ------: | ----------------------------------------------------------------------------- |
| `columnSpan`                                 | `number` |     `1` | Number of columns to span; a positive integer not exceeding Grid's `columns`. |
| `rowSpan`                                    | `number` |     `1` | Number of rows to span; positive integer.                                     |
| `backgroundColor`                            | `string` |       — | Draws a grid-item background covering its spanned cells.                      |
| `x` / `y`                                    | `number` |     `0` | Offset from the cell's origin.                                                |
| `rotation` / `scaleX` / `scaleY` / `visible` | —        |       — | Same transform and visibility props as `Group`.                               |

Grid places items row by row, skipping cells already occupied by spanning items:

```tsx
<Grid columns={3} width={316} cellHeight={50} gap={8}>
    <GridItem columnSpan={2}>
        <Rect width={180} height={40} color="#f5f8fc" />
        <Text x={8} y={8}>
            Group spanning two columns
        </Text>
    </GridItem>
    <Rect width={80} height={40} color="#e5efff" />
</Grid>
```

Vue and Svelte use the same `<GridItem>`; Angular uses `<canvas-grid-item [columnSpan]="2">...</canvas-grid-item>` and imports `GridItem` from the corresponding module.

### `<Image>`

Loads an image from `src` and draws it into the Canvas at the specified size. `objectFit` supports `contain` (default), `cover`, `fill`, `none`, and `scale-down`; `onError(error)` fires on load failure. Angular uses the `(imageError)` event binding for the error callback.

| Prop               | Type                                                       | Required | Default     | Description                         |
| ------------------ | ---------------------------------------------------------- | -------: | ----------- | ----------------------------------- |
| `src`              | `string`                                                   |      Yes | —           | Image URL.                          |
| `width` / `height` | `number`                                                   |      Yes | —           | Canvas logical size.                |
| `objectFit`        | `"contain" \| "cover" \| "fill" \| "none" \| "scale-down"` |       No | `"contain"` | Image scaling and cropping mode.    |
| `onError`          | `(error: Error) => void`                                   |       No | —           | Fires when the image fails to load. |

```tsx
<Image x={16} y={16} src="/avatar.png" width={96} height={96} objectFit="cover" />
```

Remote images draw correctly, but browser CORS rules still apply to Canvas export: if the image server does not authorize cross-origin reads, a Canvas containing that image may fail to export as PNG.

### `<Progress>`

Draws a non-interactive progress bar. `value` is clamped between `min` and `max`.

| Prop                                 | Type      |        Default | Description                                               |
| ------------------------------------ | --------- | -------------: | --------------------------------------------------------- |
| `value`                              | `number`  |       Required | Current progress value.                                   |
| `min` / `max`                        | `number`  |    `0` / `100` | Progress range.                                           |
| `width` / `height`                   | `number`  |   `200` / `12` | Track size.                                               |
| `color` / `trackColor` / `textColor` | `string`  |   Theme colors | Progress, track, and text colors; explicit props win.     |
| `borderRadius`                       | `number`  | Half of height | Corner radius.                                            |
| `showText`                           | `boolean` |        `false` | Whether to draw the percentage to the right of the track. |

### `<Carousel>` and `<CarouselItem>`

`Carousel` shows one `CarouselItem` at a time in child order, with optional autoplay, looping, prev/next arrows, and bottom indicator dots. Item content supports any Canvas UI component; when `activeIndex` is not passed explicitly, the carousel runs uncontrolled starting at index 0.

| Component      | Prop                      | Type                      | Default  | Description                                                              |
| -------------- | ------------------------- | ------------------------- | -------- | ------------------------------------------------------------------------ |
| `Carousel`     | `width` / `height`        | `number`                  | Required | Viewport size; content overflowing the bounds is clipped.                |
| `Carousel`     | `activeIndex`             | `number`                  | —        | Controlled current index; combine with `onChange` to update.             |
| `Carousel`     | `defaultActiveIndex`      | `number`                  | `0`      | Uncontrolled initial index.                                              |
| `Carousel`     | `autoplay`                | `boolean`                 | `true`   | Whether to auto-advance; disabled when there are fewer than two items.   |
| `Carousel`     | `interval`                | `number`                  | `3000`   | Autoplay interval in ms; treated as a minimum of `250`.                  |
| `Carousel`     | `transitionDuration`      | `number`                  | `450`    | Horizontal slide transition duration in ms; set `0` to switch instantly. |
| `Carousel`     | `loop`                    | `boolean`                 | `true`   | Whether to loop back to the first item at the end.                       |
| `Carousel`     | `showArrows` / `showDots` | `boolean`                 | `true`   | Whether to show the prev/next arrows and bottom indicator dots.          |
| `Carousel`     | `onChange`                | `(index: number) => void` | —        | Fires when the active index changes.                                     |
| `CarouselItem` | Children                  | Canvas UI components      | —        | Content shown for this slide.                                            |

```tsx
<Carousel width={320} height={180} interval={4000} onChange={setActiveIndex}>
    <CarouselItem>
        <Image width={320} height={180} src="/banner-one.jpg" objectFit="cover" />
    </CarouselItem>
    <CarouselItem>
        <Image width={320} height={180} src="/banner-two.jpg" objectFit="cover" />
    </CarouselItem>
</Carousel>
```

Angular uses `<canvas-carousel>` and `<canvas-carousel-item>`; controlled index changes use `(activeIndexChange)`.

### `<Tabs>` and `<TabItem>`

`Tabs` uses `TabItem` to declare tabs and their corresponding Canvas subtrees. The first `TabItem` is selected by default.

| Component | Prop                                                               | Type                    | Description                                                                                             |
| --------- | ------------------------------------------------------------------ | ----------------------- | ------------------------------------------------------------------------------------------------------- |
| `Tabs`    | `width` / `height`                                                 | `number`                | Size of the tab container; required. Content is drawn below the header and clipped to the content area. |
| `Tabs`    | `activeKey` / `defaultActiveKey`                                   | `string`                | Controlled selected key / uncontrolled initial key.                                                     |
| `Tabs`    | `headerHeight`                                                     | `number`                | Header bar height; default `40`.                                                                        |
| `Tabs`    | `backgroundColor` / `textColor` / `activeColor` / `indicatorColor` | `string`                | Colors for the tab bar, text, active state, and indicator line.                                         |
| `Tabs`    | `onChange`                                                         | `(key: string) => void` | Fires when the selected tab changes.                                                                    |
| `TabItem` | `id` / `title`                                                     | `string`                | Unique identifier and label; required.                                                                  |
| `TabItem` | `disabled`                                                         | `boolean`               | Disables clicking on this tab.                                                                          |
| `TabItem` | Children                                                           | Canvas UI components    | Canvas content for this tab.                                                                            |

```tsx
<Tabs width={320} height={180} defaultActiveKey="profile">
    <TabItem id="profile" title="Profile">
        <Text x={12} y={12}>
            Profile content
        </Text>
    </TabItem>
    <TabItem id="settings" title="Settings">
        <Text x={12} y={12}>
            Settings content
        </Text>
    </TabItem>
</Tabs>
```

Angular counterparts are `<canvas-tabs>` and `<canvas-tab-item>`; selection changes use `(activeKeyChange)`.

### `<Collapse>` and `<CollapseItem>`

Each `CollapseItem` header toggles its panel; children serve as panel content.

| Component      | Prop                                            | Type                       | Description                                                                                                         |
| -------------- | ----------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `Collapse`     | `width`                                         | `number`                   | Panel width; required.                                                                                              |
| `Collapse`     | `activeKeys` / `defaultActiveKeys`              | `string[]`                 | Controlled expanded items / uncontrolled initial expanded items.                                                    |
| `Collapse`     | `accordion`                                     | `boolean`                  | Default `false`; when `true` only one item can be expanded at a time.                                               |
| `Collapse`     | `headerHeight`                                  | `number`                   | Header bar height; default `40`.                                                                                    |
| `Collapse`     | `backgroundColor` / `textColor` / `borderColor` | `string`                   | Default background, text, and border colors for all headers.                                                        |
| `Collapse`     | `onChange`                                      | `(keys: string[]) => void` | Fires when the expanded set changes.                                                                                |
| `CollapseItem` | `id` / `title`                                  | `string`                   | Unique panel identifier and title; required.                                                                        |
| `CollapseItem` | `height`                                        | `number`                   | Expanded content height. Defaults to the space its children need, never below `100`; an explicit value always wins. |
| `CollapseItem` | `disabled`                                      | `boolean`                  | Blocks expand/collapse.                                                                                             |
| `CollapseItem` | `backgroundColor` / `textColor` / `borderColor` | `string`                   | Overrides the corresponding colors for this item's header.                                                          |

```tsx
<Collapse width={320} defaultActiveKeys={['details']} accordion>
    <CollapseItem id="details" title="Details" height={72}>
        <Text x={12} y={8}>
            Panel content
        </Text>
    </CollapseItem>
    <CollapseItem id="more" title="More">
        <Text x={12} y={8}>
            Another panel
        </Text>
    </CollapseItem>
</Collapse>
```

Angular counterparts are `<canvas-collapse>` and `<canvas-collapse-item>`; expansion changes use `(activeKeysChange)`.

### `<Dialog>`

The confirmation dialog overlays the Canvas centered by default, painting a mask, title, content area, and built-in Cancel/Confirm buttons. The content area accepts any Canvas UI component. While the dialog is open, `Input`/`Textarea` inside it cannot accept text — this prevents mask click-through.

| Prop                         | Type                 |             Default | Description                                              |
| ---------------------------- | -------------------- | ------------------: | -------------------------------------------------------- |
| `open`                       | `boolean`            |            Required | Whether the dialog is shown.                             |
| `width` / `height`           | `number`             |       `420` / `240` | Dialog size.                                             |
| `title`                      | `string`             |         `"Confirm"` | Title.                                                   |
| `confirmText` / `cancelText` | `string`             | `"OK"` / `"Cancel"` | Built-in button labels.                                  |
| `closeOnBackdrop`            | `boolean`            |              `true` | Whether clicking the mask triggers the cancel callback.  |
| `onConfirm` / `onCancel`     | `() => void`         |                   — | Confirm and cancel callbacks.                            |
| Children                     | Canvas UI components |                   — | Dialog content area; any Canvas UI component is allowed. |

```tsx
<Dialog
    open={open}
    title="Delete item?"
    onConfirm={() => {
        deleteItem();
        setOpen(false);
    }}
    onCancel={() => setOpen(false)}
>
    <Text width={340}>This action cannot be undone.</Text>
</Dialog>
```

Angular uses `<canvas-dialog>`, with the `open` input and `(confirm)` / `(cancel)` outputs.

### `<Rect>`

Draws a rectangle. Supports [Common Props](#common-props).

| Prop          | Type     |         Default | Description                            |
| ------------- | -------- | --------------: | -------------------------------------- |
| `width`       | `number` |           `100` | Width.                                 |
| `height`      | `number` |            `40` | Height.                                |
| `color`       | `string` | `"transparent"` | Fill color.                            |
| `radius`      | `number` |             `0` | Corner radius.                         |
| `stroke`      | `string` |               — | Stroke color; omitted means no stroke. |
| `strokeWidth` | `number` |             `1` | Stroke width.                          |

### `<Circle>`

Draws a circle. Supports [Common Props](#common-props).

| Prop          | Type     |     Default | Description                            |
| ------------- | -------- | ----------: | -------------------------------------- |
| `radius`      | `number` |        `10` | Circle radius.                         |
| `color`       | `string` | `"#e74c3c"` | Fill color.                            |
| `stroke`      | `string` |           — | Stroke color; omitted means no stroke. |
| `strokeWidth` | `number` |         `1` | Stroke width.                          |

### `<Text>`

Draws single-line or auto-wrapped text. The node reports the box its rendered lines actually need, so containers such as `<CollapseItem>` can size themselves to it. Supports [Common Props](#common-props).

| Prop         | Type                            |        Default | Description                                                                                                                                                      |
| ------------ | ------------------------------- | -------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `text`       | `string`                        |              — | Text content.                                                                                                                                                    |
| Children     | `string \| number`              |              — | Each framework can supply text via native template children in place of `text`.                                                                                  |
| `fontSize`   | `number`                        |           `16` | Font size, in logical pixels.                                                                                                                                    |
| `width`      | `number`                        |              — | Max line width; content wraps beyond it. Monospaced CJK characters also wrap based on measured width. Inside a `<Grid>`, defaults to the cell's width.           |
| `maxLines`   | `number`                        |              — | Maximum lines to show; the last visible line is cut with an ellipsis. Inside a `<Grid>`, defaults to the lines that fit the cell; unlimited when neither is set. |
| `fontFamily` | `string`                        | `"sans-serif"` | Font family.                                                                                                                                                     |
| `color`      | `string`                        |       `"#333"` | Font color.                                                                                                                                                      |
| `baseline`   | `CanvasTextBaseline`            |        `"top"` | Canvas text baseline.                                                                                                                                            |
| `textAlign`  | `"left" \| "center" \| "right"` |       `"left"` | Horizontal text alignment; when `width` is set, alignment is relative to the text box.                                                                           |

### `<Icon>`

Original vector icons with no dependency on icon fonts or external images. Supports [Common Props](#common-props).

| Prop          | Type                   |     Default | Description                                                                              |
| ------------- | ---------------------- | ----------: | ---------------------------------------------------------------------------------------- |
| `name`        | `IconName`             |    Required | Icon name; see the list below.                                                           |
| `size`        | `number`               |        `24` | Icon width and height.                                                                   |
| `color`       | `string`               |    `"#333"` | Icon color; can be set via `--canvas-ui-icon-color`.                                     |
| `variant`     | `"outline" \| "solid"` | `"outline"` | `outline` for stroked shapes; `solid` uses thicker strokes and fills the primary shapes. |
| `strokeWidth` | `number`               |         `2` | Outline stroke width; solid style uses at least `4`.                                     |

Supported: `home`, `house`, `building`, `apartment`, `store`, `mapPin`, `map`, `globe`, `compass`, `navigation`, `flag`, `mountain`, `tree`, `leaf`, `flower`, `sun`, `moon`, `cloud`, `rain`, `snow`, `fire`, `water`, `wind`, `car`, `bus`, `train`, `plane`, `bicycle`, `ship`, `rocket`, `truck`, `walk`, `phone`, `message`, `mail`, `bell`, `calendar`, `clock`, `alarm`, `camera`, `image`, `video`, `music`, `microphone`, `headphones`, `play`, `pause`, `stop`, `record`, `volume`, `wifi`, `bluetooth`, `battery`, `signal`, `power`, `monitor`, `laptop`, `tablet`, `keyboard`, `mouse`, `printer`, `folder`, `file`, `document`, `download`, `upload`, `share`, `link`, `search`, `settings`, `sliders`, `menu`, `close`, `check`, `plus`, `minus`, `edit`, `trash`, `copy`, `save`, `lock`, `unlock`, `key`, `user`, `users`, `heart`, `star`, `bookmark`, `cart`, `bag`, `gift`, `creditCard`, `wallet`, `chart`, `pieChart`, `barChart`, `analytics`, `shield`, `warning`, `info`, `help`, `question`, `tag`, `puzzle`, `code`, `database`, and `cloudDownload`.

```tsx
<Icon name="search" x={16} y={16} size={28} color="#1677ff" />
<Icon name="heart" x={56} y={16} variant="solid" color="#e74c3c" />
```

### `<Input>`

Single-line input. The control's appearance is painted onto the Canvas; a transparent HTML input handles keyboard, IME, and selection.

| Prop               | Type                               |        Default | Description                                                  |
| ------------------ | ---------------------------------- | -------------: | ------------------------------------------------------------ |
| `width` / `height` | `number`                           |   `200` / `36` | Control size.                                                |
| `value`            | `string`                           |              — | Controlled input value; pair with `onChange` to update.      |
| `defaultValue`     | `string`                           |           `""` | Uncontrolled initial value.                                  |
| `placeholder`      | `string`                           |           `""` | Placeholder text.                                            |
| `type`             | `"text" \| "password" \| "number"` |       `"text"` | Input type. Password content is shown as dots on the Canvas. |
| `fontSize`         | `number`                           |           `14` | Font size.                                                   |
| `fontFamily`       | `string`                           | `"sans-serif"` | Font family.                                                 |
| `color`            | `string`                           |       `"#333"` | Input text color.                                            |
| `bgColor`          | `string`                           |       `"#fff"` | Background color.                                            |
| `borderColor`      | `string`                           |       `"#ccc"` | Normal border color.                                         |
| `focusBorderColor` | `string`                           |    `"#3498db"` | Focused border color.                                        |
| `borderRadius`     | `number`                           |            `4` | Corner radius.                                               |
| `padding`          | `number`                           |            `8` | Text padding.                                                |
| `disabled`         | `boolean`                          |        `false` | Disables input.                                              |
| `maxLength`        | `number`                           |              — | Max character count; a non-negative integer takes effect.    |
| `onChange`         | `(value: string) => void`          |              — | Fires when the input changes.                                |
| `onFocus`          | `() => void`                       |              — | Fires when focused.                                          |
| `onBlur`           | `() => void`                       |              — | Fires when blurred.                                          |

### `<Textarea>`

Multi-line text input; inherits value, size, style, and callback props from `<Input>`. Content scrolls inside the box with a visible scrollbar when overflowing; `type` is not supported. Additional prop:

| Prop   | Type     | Description                                                                                           |
| ------ | -------- | ----------------------------------------------------------------------------------------------------- |
| `rows` | `number` | Can express the expected number of lines; the actual rendered height is still controlled by `height`. |

```tsx
<Textarea
    width={300}
    height={120}
    value={notes}
    placeholder="Enter multi-line content"
    onChange={setNotes}
/>
```

### `<Upload>`

Draws a file-picker button. A built-in vector icon and the label are drawn together as one horizontally centered group. Clicking opens the browser's native file picker; this component does not upload to a server.

| Prop               | Type                      |          Default | Description                                                                |
| ------------------ | ------------------------- | ---------------: | -------------------------------------------------------------------------- |
| `width` / `height` | `number`                  |     `120` / `40` | Button size.                                                               |
| `text`             | `string`                  |  `"Choose File"` | Button label.                                                              |
| `icon`             | `IconName`                |       `"upload"` | Built-in icon drawn before the label; use any name from [`<Icon>`](#icon). |
| `iconSize`         | `number`                  | `fontSize × 1.1` | Icon size.                                                                 |
| `accept`           | `string`                  |                — | File type filter, e.g. `"image/*,.pdf"`.                                   |
| `multiple`         | `boolean`                 |          `false` | Allow multi-selection.                                                     |
| `disabled`         | `boolean`                 |          `false` | Disables file selection.                                                   |
| `onChange`         | `(files: File[]) => void` |                — | Fires after files are selected; canceled picks do not fire.                |

```tsx
<Upload accept="image/*" multiple onChange={(files) => console.log(files)} />
<Upload icon="cloud" text="Upload Photos" />
```

Angular uses `<canvas-upload>` and receives `File[]` via `(change)`.

### `<Dropdown>`

Canvas-drawn dropdown select. Supports [Common Props](#common-props).

| Prop               | Type                              |       Default | Description                                                         |
| ------------------ | --------------------------------- | ------------: | ------------------------------------------------------------------- |
| `width` / `height` | `number`                          |  `200` / `36` | Control size.                                                       |
| `options`          | `Array<string \| DropdownOption>` |      Required | Option list; string options use the same value for label and value. |
| `value`            | `string`                          |             — | Controlled selected value.                                          |
| `defaultValue`     | `string`                          |             — | Uncontrolled initial value.                                         |
| `placeholder`      | `string`                          | `"Select..."` | Text shown when nothing is selected.                                |
| `disabled`         | `boolean`                         |       `false` | Disables interaction.                                               |
| `fontSize`         | `number`                          |          `14` | Font size.                                                          |
| `color`            | `string`                          |      `"#333"` | Text color.                                                         |
| `bgColor`          | `string`                          |      `"#fff"` | Control background.                                                 |
| `borderColor`      | `string`                          |   `"#c7ccd3"` | Normal border color.                                                |
| `focusBorderColor` | `string`                          |   `"#3478f6"` | Opened border color.                                                |
| `borderRadius`     | `number`                          |           `4` | Corner radius.                                                      |
| `onChange`         | `(value: string) => void`         |             — | Selection change callback.                                          |

`DropdownOption` type:

| Prop       | Type      | Description                     |
| ---------- | --------- | ------------------------------- |
| `label`    | `string`  | Display text.                   |
| `value`    | `string`  | Option value.                   |
| `disabled` | `boolean` | Whether the option is disabled. |

```tsx
<Dropdown
    value={role}
    options={['Admin', { label: 'readOnly', value: 'reader', disabled: false }]}
    onChange={setRole}
/>
```

### `<DatePicker>`

Canvas-drawn date input; clicking opens the browser's native date picker.

| Prop               | Type                      |         Default | Description                                 |
| ------------------ | ------------------------- | --------------: | ------------------------------------------- |
| `width` / `height` | `number`                  |    `200` / `36` | Control size.                               |
| `value`            | `string`                  |               — | Controlled date value, format `YYYY-MM-DD`. |
| `defaultValue`     | `string`                  |            `""` | Uncontrolled initial date value.            |
| `placeholder`      | `string`                  | `"Select date"` | Text shown when nothing is selected.        |
| `disabled`         | `boolean`                 |         `false` | Disables date selection.                    |
| `onChange`         | `(value: string) => void` |               — | Fires when the date changes.                |

### `<Radio>` and `<Checkbox>`

Both accept an `options` array; Radio is single-select and Checkbox is multi-select. String options use the same value for label and value; you may also pass `{ label, value, disabled }` objects.

| Prop               | Type                                                                    |        Default | Description                       |
| ------------------ | ----------------------------------------------------------------------- | -------------: | --------------------------------- |
| `options`          | `Array<string \| ChoiceOption>`                                         |       Required | Option list.                      |
| `value`            | Radio: `string`; Checkbox: `string[]`                                   |              — | Controlled selected value.        |
| `defaultValue`     | Radio: `string`; Checkbox: `string[]`                                   |              — | Uncontrolled initial value.       |
| `direction`        | `"horizontal" \| "vertical"`                                            | `"horizontal"` | Option layout direction.          |
| `width` / `height` | `number`                                                                |           Auto | Control size.                     |
| `onChange`         | Radio: `(value: string) => void`; Checkbox: `(value: string[]) => void` |              — | Fires when the selection changes. |

```tsx
<Radio options={['Small', 'Medium', 'Large']} value={size} onChange={setSize} />
<Checkbox options={['Email', 'SMS']} value={channels} onChange={setChannels} />
```

Angular uses `<canvas-date-picker>`, `<canvas-radio>`, and `<canvas-checkbox>`; date selection listens via `(valueChange)` or `(change)`, and Radio/Checkbox use `(change)`.

### `<Slider>`

Draggable slider. Supports [Common Props](#common-props).

| Prop               | Type                      |      Default | Description                    |
| ------------------ | ------------------------- | -----------: | ------------------------------ |
| `width` / `height` | `number`                  | `160` / `32` | Slider size.                   |
| `min` / `max`      | `number`                  |  `0` / `100` | Min and max values.            |
| `step`             | `number`                  |          `1` | Step size.                     |
| `value`            | `number`                  |            — | Controlled value.              |
| `defaultValue`     | `number`                  |        `min` | Uncontrolled initial value.    |
| `disabled`         | `boolean`                 |      `false` | Disables dragging.             |
| `trackColor`       | `string`                  |  `"#d7dde5"` | Track color.                   |
| `activeColor`      | `string`                  |  `"#3478f6"` | Filled track and border color. |
| `thumbColor`       | `string`                  |     `"#fff"` | Thumb color.                   |
| `onChange`         | `(value: number) => void` |            — | Fires when the value changes.  |

### `<Switch>`

Toggle switch. Supports [Common Props](#common-props).

| Prop               | Type                         |     Default | Description                   |
| ------------------ | ---------------------------- | ----------: | ----------------------------- |
| `width` / `height` | `number`                     | `44` / `24` | Switch size.                  |
| `checked`          | `boolean`                    |           — | Controlled checked state.     |
| `defaultChecked`   | `boolean`                    |     `false` | Uncontrolled initial state.   |
| `disabled`         | `boolean`                    |     `false` | Blocks toggling.              |
| `onColor`          | `string`                     | `"#3478f6"` | Track color when on.          |
| `offColor`         | `string`                     | `"#c7ccd3"` | Track color when off.         |
| `thumbColor`       | `string`                     |    `"#fff"` | Thumb color.                  |
| `onChange`         | `(checked: boolean) => void` |           — | Fires when the state changes. |

### `<Button>`

Canvas-drawn button. Supports [Common Props](#common-props).

| Prop               | Type               |      Default | Description                                                |
| ------------------ | ------------------ | -----------: | ---------------------------------------------------------- |
| `width` / `height` | `number`           | `120` / `40` | Button size.                                               |
| Children           | `string \| number` |            — | Button label; can be replaced by `text`.                   |
| `text`             | `string`           |            — | Button label; wins over `children` when both are provided. |
| `fontSize`         | `number`           |         `15` | Font size.                                                 |
| `fontColor`        | `string`           |     `"#fff"` | Text color.                                                |
| `backgroundColor`  | `string`           |  `"#3478f6"` | Background color.                                          |
| `borderColor`      | `string`           |            — | Stroke color.                                              |
| `borderRadius`     | `number`           |          `6` | Corner radius.                                             |
| `disabled`         | `boolean`          |      `false` | Disables the button.                                       |
| `onClick`          | `() => void`       |            — | Click callback.                                            |

## Image Export

Export the image through a `ref` provided by `CanvasHandle`:

```tsx
const canvasRef = useRef<CanvasHandle>(null);

// PNG Data URL — assign directly to img.src
const dataUrl = canvasRef.current?.toDataURL({
    type: 'image/png',
    width: 840,
    height: 600,
    pixelRatio: 2,
});

// JPEG Blob — create a download link or upload
const blob = await canvasRef.current?.toBlob({
    type: 'image/jpeg',
    quality: 0.9,
    pixelRatio: 2,
});

// Get the underlying HTMLCanvasElement
const canvasElement = canvasRef.current?.getCanvas();
```

`CanvasExportOptions`:

| Prop         | Type     |                       Default | Description                                                                                                      |
| ------------ | -------- | ----------------------------: | ---------------------------------------------------------------------------------------------------------------- |
| `width`      | `number` |  Current Canvas logical width | Logical export width.                                                                                            |
| `height`     | `number` | Current Canvas logical height | Logical export height.                                                                                           |
| `pixelRatio` | `number` |          Canvas's pixel ratio | Output pixels per logical pixel; the final bitmap size is roughly `width × pixelRatio` by `height × pixelRatio`. |
| `type`       | `string` |                 `"image/png"` | Image MIME type such as `image/png`, `image/jpeg`, `image/webp`. Unsupported formats fall back to PNG.           |
| `quality`    | `number` |               Browser default | Quality for lossy formats, range `0` to `1`; usually unused by PNG.                                              |

Short-form calls are still supported:

```tsx
canvasRef.current?.toDataURL('image/png');
const jpegBlob = await canvasRef.current?.toBlob('image/jpeg', 0.9);
```

Export size and pixel ratio must be positive numbers. If the scene contains a cross-origin image without server-side CORS authorization, `toDataURL()` throws an error explaining the reason and `toBlob()` rejects with the same error. Configure the image server to return an `Access-Control-Allow-Origin` header that permits the current site, or remove the image before exporting.
