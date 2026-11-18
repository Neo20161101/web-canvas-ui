# Web Canvas UI (React, Vue 3, Svelte, Angular)

[English](./README.md) · [日本語](./README.ja.md) · [한국어](./README.ko.md) · [繁體中文](./README.zh-TW.md) · [Русский](./README.ru.md) · [简体中文](./README.zh-CN.md)

基于 Canvas 2D 的声明式组件库，提供 **React**、**Vue 3**、**Svelte 5+** 和 **Angular 17+** 适配器。各框架从独立入口导入并使用原生组件/模板语法；底层 Canvas engine 和控件绘制逻辑共用。控件外观由 Canvas 绘制。

> **适配器说明：** React、Vue、Svelte、Angular 分别从 `/canvas-ui/react`、`/canvas-ui/vue`、`/canvas-ui/svelte`、`/canvas-ui/angular` 导入。请根据主Canvas框架选择入口，不要混用组件。它们可以复用同一套 engine 和控件绘制实现。

> **共享组件契约：** 每个控件按 `components/<Component>/` 归档，入口 `components.ts` 统一导出组件 API，`<component>.ts` 定义 Props 类型和 Canvas 绘制函数，`logic.ts`（需要时）保存该控件独有的交互/业务逻辑。公共类型统一从 `components/types.ts` 汇总，并由 `/canvas-ui/types.ts` 对外导出；React、Vue、Svelte、Angular 适配器共用此类型契约。

新增控件时，为其建立独立目录并从目录入口导出公共 API；新增 Props 时同步检查 `CanvasComponentProps` 和框架适配器的属性映射。

## 全局主题色

主题颜色集中定义在 [`theme.scss`](src/canvas-ui/theme.scss) 的 `$primary: #1668dc`。只需修改这个主色变量，就会统一更新按钮、选中态、聚焦边框、进度条等强调色。浅色由主色与白色混合派生，按压深色由主色降低亮度派生；公共色阶也会输出为 `--canvas-ui-primary*` CSS 变量。`theme.css` 是编译输出，应用全局 CSS 引入它，不要直接编辑生成文件：

```css
@import '/canvas-ui/theme.css';
```

修改 `theme.scss` 后运行 `npm run build:theme` 重新生成 CSS。编译后的 CSS 自定义属性适用于 React、Vue、Svelte 和 Angular，并提供 `.dark` 与 `[data-theme="dark"]` 深色主题。组件显式传入的颜色属性优先于主题变量。

内置主色主题为蓝、绿、紫、橙、红，给 Canvas 外层容器添加对应 class 即可切换；可以与深色主题组合：

```tsx
<div className="theme-green">
    <Canvas width={400} height={240}>
        <Button>Green theme</Button>
    </Canvas>
</div>
```

| 主题         | class          | 主色      |
| ------------ | -------------- | --------- |
| 蓝色（默认） | `theme-blue`   | `#1668dc` |
| 绿色         | `theme-green`  | `#389e0d` |
| 紫色         | `theme-purple` | `#722ed1` |
| 橙色         | `theme-orange` | `#d46b08` |
| 红色         | `theme-red`    | `#cf1322` |

例如同时添加 `dark` 和 `theme-purple`，或添加 `data-theme="dark"` 与 `theme-purple`，即可使用紫色深色主题。所有主题的浅色/按压/深色强调色都根据对应主色由 Sass 统一派生。

| 组件                          | CSS 自定义属性                                                                                                                                                                                                                                                                                       |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button / Upload               | `--canvas-ui-button-background`、`--canvas-ui-button-color`、`--canvas-ui-button-border`、`--canvas-ui-button-pressed-background`、`--canvas-ui-button-disabled-background`、`--canvas-ui-button-disabled-color`                                                                                     |
| Carousel                      | `--canvas-ui-carousel-arrow`、`--canvas-ui-carousel-dot`、`--canvas-ui-carousel-active-dot`                                                                                                                                                                                                          |
| Radio / Checkbox              | `--canvas-ui-choice-active`、`--canvas-ui-choice-border`、`--canvas-ui-choice-color`、`--canvas-ui-choice-disabled`、`--canvas-ui-choice-disabled-background`                                                                                                                                        |
| Collapse                      | `--canvas-ui-collapse-header-background`、`--canvas-ui-collapse-border`、`--canvas-ui-collapse-color`、`--canvas-ui-collapse-disabled-color`                                                                                                                                                         |
| Dialog                        | `--canvas-ui-dialog-mask`、`--canvas-ui-dialog-background`、`--canvas-ui-dialog-title-color`、`--canvas-ui-dialog-border`、`--canvas-ui-dialog-confirm-background`、`--canvas-ui-dialog-cancel-background`、`--canvas-ui-dialog-confirm-color`、`--canvas-ui-dialog-cancel-color`                    |
| Dropdown                      | `--canvas-ui-dropdown-background`、`--canvas-ui-dropdown-color`、`--canvas-ui-dropdown-placeholder-color`、`--canvas-ui-dropdown-border`、`--canvas-ui-dropdown-focus-border`、`--canvas-ui-dropdown-option-background`、`--canvas-ui-dropdown-option-border`、`--canvas-ui-dropdown-disabled-color` |
| Input / Textarea / DatePicker | `--canvas-ui-input-background`、`--canvas-ui-input-color`、`--canvas-ui-input-placeholder-color`、`--canvas-ui-input-border`、`--canvas-ui-input-focus-border`                                                                                                                                       |
| Progress                      | `--canvas-ui-progress-track`、`--canvas-ui-progress-active`、`--canvas-ui-progress-text`                                                                                                                                                                                                             |
| Rect / Circle / Text / Icon   | `--canvas-ui-rect-background`、`--canvas-ui-rect-border`、`--canvas-ui-circle-background`、`--canvas-ui-circle-border`、`--canvas-ui-text-color`、`--canvas-ui-icon-color`                                                                                                                           |
| Slider                        | `--canvas-ui-slider-track`、`--canvas-ui-slider-active`、`--canvas-ui-slider-thumb`、`--canvas-ui-slider-disabled-thumb`                                                                                                                                                                             |
| Switch                        | `--canvas-ui-switch-on`、`--canvas-ui-switch-off`、`--canvas-ui-switch-thumb`                                                                                                                                                                                                                        |
| Tabs                          | `--canvas-ui-tabs-background`、`--canvas-ui-tabs-color`、`--canvas-ui-tabs-active-color`、`--canvas-ui-tabs-indicator`、`--canvas-ui-tabs-disabled-color`                                                                                                                                            |

自定义某个应用主题时，可在自己的 CSS 覆盖所需变量，例如 `.brand { --canvas-ui-button-background: #6d4aff; }`。表中列出了所有组件实际读取的主题变量。

## 环境与导入

将 `/canvas-ui/` 目录放入项目，并确保主Canvas项目已配置相应框架：React 19+、Vue 3、Svelte 5+ 或 Angular 17+。Vue 使用单文件组件模板，不需要 JSX 插件或 `jsxImportSource` 配置；Svelte 项目需要 Svelte 编译器及对应构建插件；Angular 项目需要 `@angular/core` 和 Angular 构建配置。框架依赖由主Canvas项目提供，本目录不强制其他框架的依赖。

| 框架        | 入口                 |
| ----------- | -------------------- |
| React       | `/canvas-ui/react`   |
| Vue 3       | `/canvas-ui/vue`     |
| Svelte 5+   | `/canvas-ui/svelte`  |
| Angular 17+ | `/canvas-ui/angular` |

组件必须放在对应适配器的 Canvas 容器内，并使用该框架入口导出的场景组件。不要在 Canvas 场景里放普通 DOM 元素。

## 快速开始（React）

```tsx
import { useRef, useState } from 'react';
import { Canvas, Group, Rect, Text, Input, Button } from '/canvas-ui/react';
import type { CanvasHandle } from '/canvas-ui/react';
import 'theme.css';

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
                        导出图片
                    </Button>
                </Group>
            </Canvas>
        </section>
    );
}
```

`x`、`y` 是组件相对于父级的位置，单位为 Canvas 逻辑像素。`Group` 可嵌套，子组件坐标会叠加父级的位置、缩放和旋转。

## 快速开始（Vue 3 单文件组件）

Vue 适配器位于独立的 `/canvas-ui/vue` 入口。直接在 `.vue` 文件的模板中嵌套 Canvas UI 组件即可，不需要 TSX、JSX 插件或手动创建 Canvas 节点数组：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Canvas, Group, Rect, Text, Input, Button } from '/canvas-ui/vue';
import type { CanvasHandle } from '/canvas-ui/vue';
import 'theme.css';

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
                导出图片
            </Button>
        </Group>
    </Canvas>
</template>
```

Vue 模板通过 `:value` 绑定响应式状态、通过 `@change` 更新；Canvas 组件会在 Vue 更新后同步场景。

## 快速开始（Svelte 5+）

在 Svelte 5 模板中使用 Svelte 入口导出的组件。`Canvas` 可用 `bind:this` 访问导出方法：

```svelte
<script lang="ts">
  import { Canvas, Group, Rect, Text, Input, Button } from '/canvas-ui/svelte';
  import type { CanvasHandle } from '/canvas-ui/svelte';
  import 'theme.css';

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

Svelte 控件属性变化会同步到 Canvas 场景；

## 快速开始（Angular 17+）

Angular 入口提供 standalone `Canvas` 组件和场景指令。在使用它们的 standalone 组件中导入所需符号：

```ts
import { Component, ViewChild } from '@angular/core';
import { Button, Canvas, Group, Input, Rect, Text } from '/canvas-ui/angular';
import 'theme.css';

@Component({
    selector: 'profile-canvas',
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
                    (valueChange)="name = $event"
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
}
```

Angular 使用 `<canvas-...>` 指令选择器声明 Canvas 场景节点。输入框、下拉框和滑块使用 `(valueChange)` 输出，开关使用 `(checkedChange)`，按钮使用 `(click)`。

交互属性按框架习惯传递：React 使用 `onChange`/`onClick` props，Vue 使用 `@change`/`@click`，Svelte 使用 `onChange`/`onClick` 回调 props；Angular 使用 `(valueChange)`、`(checkedChange)` 和 `(click)` 输出绑定。

## 通用属性

除 `Canvas` 外，所有可视组件都支持以下变换属性：

| 属性       | 类型      | 默认值 | 说明                                                      |
| ---------- | --------- | -----: | --------------------------------------------------------- |
| `x`        | `number`  |    `0` | 相对父级的水平位置。                                      |
| `y`        | `number`  |    `0` | 相对父级的垂直位置。                                      |
| `rotation` | `number`  |    `0` | 旋转弧度。                                                |
| `scaleX`   | `number`  |    `1` | 水平变换缩放。                                            |
| `scaleY`   | `number`  |    `1` | 垂直变换缩放。                                            |
| `visible`  | `boolean` | `true` | 是否绘制；设为 `false` 时，其子组件也隐藏且不会响应点击。 |

### 尺寸规则

- `Rect`、`Input`、`Textarea`、`Upload`、`Dropdown`、`DatePicker`、`Slider`、`Switch`、`Button` 用 `width` 和 `height` 设置尺寸。
- `Circle` 使用 `radius`（默认 `10`）设置半径，直径为半径的两倍。
- `Text` 用 `fontSize` 设置字号、用 `width` 设置换行宽度。
- `width`/`height` 未设置时使用各组件文档所列默认值。`Group` 是容器，没有独立宽高；`Grid` 根据列数和单元格属性布局。
- `Grid` 按子组件顺序自动排列，指定 `columns`、`cellHeight` 和可选 `gap`；单元格宽度可用 `cellWidth` 固定，也可通过 `width` 平均分配。直接子组件默认占一个单元格；用 `GridItem` 可以把多个控件作为一组并设置跨列/跨行，组内子组件尺寸仍由各自属性决定。

## 组件参数

### `<Canvas>`

创建 Canvas 场景。尺寸为逻辑像素，实际位图会乘以像素比。

| 属性                                                | 类型                                                                          | 必需 |                                                           默认值 | 说明                                                                                                       |
| --------------------------------------------------- | ----------------------------------------------------------------------------- | ---: | ---------------------------------------------------------------: | ---------------------------------------------------------------------------------------------------------- |
| `width`                                             | `number`                                                                      |   是 |                                                                — | Canvas 逻辑宽度。                                                                                          |
| `height`                                            | `number`                                                                      |   是 |                                                                — | Canvas 逻辑高度。                                                                                          |
| 像素比                                              | 自动                                                                          |    — | 自动读取 `window.devicePixelRatio`，且至少为 `1`；无需传入属性。 | Canvas 绘制分辨率比例。                                                                                    |
| `className`（React/Angular）/ `class`（Vue/Svelte） | `string`                                                                      |   否 |                                                                — | 外层容器的 CSS class。                                                                                     |
| `style`                                             | 对应框架的样式对象或字符串                                                    |   否 |                                                                — | 外层容器样式；容器的 `position`、`width`、`height` 由组件设置。                                            |
| `ariaLabel`                                         | `string`                                                                      |   否 |                                                       `"Canvas"` | Canvas 的无障碍标签。                                                                                      |
| `onFrame`                                           | `(time: number) => void`                                                      |   否 |                                                                — | 每帧回调，`time` 是浏览器动画帧时间戳。                                                                    |
| `onEvent`                                           | `(event: CanvasUIEvent) => void`                                              |   否 |                                                                — | Canvas 统一事件入口，接收 `pointerdown`、`pointermove`、`pointerup`、`pointercancel`、`click` 和 `wheel`。 |
| 子组件                                              | React children / Vue 默认 slot / Svelte children / Angular content projection |   否 |                                                                — | Canvas UI 组件树。                                                                                         |

`onEvent` 事件包含 Canvas 逻辑坐标 `x`/`y`、命中的 `target`（组件 `type` 和用户 `key`；空白处为 `null`）以及命中组件局部坐标 `localX`/`localY`。`wheel` 事件另含 `deltaY`，指针事件另含 `pointerId`。统一的 `click` 只在同一目标按下并释放、移动距离不超过 8 个逻辑像素时触发一次；拖动或取消不会触发。各组件已有的 `onClick`、`onChange` 等回调仍照常执行，`onEvent` 适合处理跨组件的业务逻辑或统一埋点。

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

通过 React ref、Vue 模板 ref、Svelte `bind:this` 或 Angular 模板引用可以使用截图接口，详情见[图片导出](#图片导出)；`CanvasHandle` 还提供 `requestRender()`，用于在源 Canvas 更新后请求主Canvas重绘。

### `<CanvasView>`

将第三方或其他模块创建的同页面 `HTMLCanvasElement` 画面绘制到当前 Canvas 中。只嵌入像素画面，不会把源 Canvas 的 DOM 或事件处理器带入当前 Canvas。

| 属性               | 类型                                      | 必需 |      默认值 | 说明                                                                                                                        |
| ------------------ | ----------------------------------------- | ---: | ----------: | --------------------------------------------------------------------------------------------------------------------------- |
| `source`           | `HTMLCanvasElement`                       |   是 |           — | 要显示的源 Canvas 实例。                                                                                                    |
| `width` / `height` | `number`                                  |   是 |           — | 在当前 Canvas 中占用的逻辑尺寸。                                                                                            |
| `fit`              | `'contain' \| 'cover' \| 'fill'`          |   否 | `'contain'` | 保持比例完整显示、保持比例裁剪填满，或拉伸填满。                                                                            |
| `onPointerEvent`   | `(event: CanvasViewPointerEvent) => void` |   否 |           — | 提供映射后的 `pointerdown`、`pointermove`、`pointerup`、`pointercancel` 和 `click` 事件；不会自动向源 Canvas 派发合成事件。 |

```tsx
import { Canvas, CanvasView } from '/canvas-ui/react';

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

// 第三方 Canvas 更新画面后，通知主Canvas重新绘制：
canvasRef.current?.requestRender();
```

事件同时包含 `x`/`y`（CanvasView 局部逻辑坐标）、`sourceX`/`sourceY`（源 Canvas 位图像素坐标）、源画布尺寸、按钮状态、`pointerId`、`pointerType`、`pressure` 和 `isPrimary`。`contain` 留白区域不会命中；拖动期间事件继续报告源画布坐标，即使指针短暂移出组件范围。开发者可使用这些数据调用第三方库的交互 API。源 Canvas 不会自动通知主Canvas内容变化；源内容更新后调用主Canvas的 `requestRender()`，也可在动画帧中更新源画布后调用。若源 Canvas 含有未获 CORS 授权的图片，主Canvas画布会被污染，导出同样会失败；Canvas 的跨域限制无法通过此组件绕过。

### `<CustomDraw>`

当内置组件无法满足绘制需求时，使用 `CustomDraw` 提供 Canvas 2D 绘制回调。它会在每次场景重绘（包括图片导出）时执行；回调坐标原点为组件左上角，并可使用通用位置、旋转、缩放属性。

| 属性               | 类型                                                                                   | 必需 | 说明                                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------- | ---: | --------------------------------------------------------------------------------------------------------- |
| `width` / `height` | `number`                                                                               |   是 | 自定义绘制区域尺寸，非负有限数值。                                                                        |
| `draw`             | `(context: CanvasRenderingContext2D, size: { width: number; height: number }) => void` |   是 | 在区域内执行同步绘制；`size` 提供对应宽高。                                                               |
| `onClick`          | `(event: CustomDrawClickEvent) => void`                                                |   否 | 点击回调；坐标 `x`/`y` 是组件局部坐标，`canvasX`/`canvasY` 是 Canvas 逻辑坐标，并提供尺寸和 `pointerId`。 |
| `hitTest`          | `(x: number, y: number, size: CustomDrawSize) => boolean`                              |   否 | 自定义图形命中测试；不传时使用整个宽高矩形。返回 `false` 时命中测试会继续检查下层组件。                   |

```tsx
import { Canvas, CustomDraw } from '/canvas-ui/react';

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

每次调用都会隔离 Canvas 绘图状态，回调设置的颜色、线宽、变换等不会污染其他组件。回调只应绘制，不要在其中更新 UI 状态或执行副作用；绘制错误会原样抛出。

### `<Group>`

用于分组、定位和变换子组件。支持[通用属性](#通用属性)，以及：

| 属性   | 类型                                                          | 说明                |
| ------ | ------------------------------------------------------------- | ------------------- |
| 子组件 | React children / Vue/Svelte slot / Angular content projection | 子 Canvas UI 组件。 |

```tsx
<Group x={20} y={30} scaleX={1.2}>
    <Text x={10} y={10}>
        组内文字
    </Text>
</Group>
```

### `<Grid>`

按顺序将子组件放入固定尺寸单元格，填满指定列数后换到下一行。`Grid` 不绘制背景；它是布局容器，可像 `Group` 一样使用变换属性。

| 属性         | 类型                          | 必需 | 默认值 | 说明                                                                                                               |
| ------------ | ----------------------------- | ---: | -----: | ------------------------------------------------------------------------------------------------------------------ |
| `columns`    | `number`                      |   是 |      — | 每行列数，必须是正整数。                                                                                           |
| `width`      | `number`                      |   否 |      — | Grid 总宽度。未传 `cellWidth` 时必需，扣除列间 gap 后平均分配给各列；传入 `cellWidth` 时也可省略，宽度按列数计算。 |
| `height`     | `number`                      |   否 |      — | 固定可视高度。超出部分裁剪，并显示滚动条；可在 Grid 内滚轮滚动。                                                   |
| `cellWidth`  | `number`                      |   否 |      — | 固定单元格逻辑宽度；传入时优先于 `width` 自动分配。必须为正数。                                                    |
| `cellHeight` | `number`                      |   是 |      — | 单元格逻辑高度，必须为正数。                                                                                       |
| `gap`        | `number`                      |   否 |    `0` | 行和列之间相同的间距，不能为负数。                                                                                 |
| `onScroll`   | `(scrollTop: number) => void` |   否 |      — | 滚动位置变化回调，单位为逻辑像素。                                                                                 |

直接子组件保留自己的 `x`、`y`，并叠加所在单元格偏移。未传 `cellWidth` 时按 `(width - gap * (columns - 1)) / columns` 计算等宽列；子组件本身的尺寸不会自动拉伸。

```tsx
<Grid columns={3} cellWidth={100} cellHeight={50} gap={8}>
    <Rect width={80} height={40} color="#f5f8fc" />
    <Rect width={80} height={40} color="#e5efff" />
    <Rect width={80} height={40} color="#d5e5ff" />
</Grid>
```

需要按总宽度平均分列时省略 `cellWidth`：

```tsx
<Grid columns={3} width={316} cellHeight={50} gap={8}>
    <Rect width={80} height={40} color="#f5f8fc" />
    <Rect width={80} height={40} color="#e5efff" />
    <Rect width={80} height={40} color="#d5e5ff" />
</Grid>
```

Vue、Svelte 使用相同属性；Angular 使用 `<canvas-grid [columns]="3" [width]="316" [cellHeight]="50" [gap]="8">`，并在对应组件中导入 `Grid`。

给 Grid 设置 `height` 后，内容超出视口时可以滚轮滚动，子项会被裁剪在固定高度内：

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

`GridItem` 是 Grid 内的分组/布局节点，不会独立绘制。它可以包含多个控件，并让这些控件作为一个栅格项一起定位；组内子组件仍使用自己的尺寸和局部坐标。直接放在 `Grid` 下的普通控件仍然有效，默认占一个单元格。

| 属性                                         | 类型     | 默认值 | 说明                                           |
| -------------------------------------------- | -------- | -----: | ---------------------------------------------- |
| `columnSpan`                                 | `number` |    `1` | 占用列数，正整数且不能超过 Grid 的 `columns`。 |
| `rowSpan`                                    | `number` |    `1` | 占用行数，正整数。                             |
| `backgroundColor`                            | `string` |      — | 绘制栅格项背景，覆盖其跨列/跨行单元格区域。    |
| `x` / `y`                                    | `number` |    `0` | 相对栅格单元格起点的偏移。                     |
| `rotation` / `scaleX` / `scaleY` / `visible` | —        |      — | 与 `Group` 相同的变换和可见性属性。            |

Grid 会按行优先放置项目，并跳过已被跨行/跨列项目占用的单元格：

```tsx
<Grid columns={3} width={316} cellHeight={50} gap={8}>
    <GridItem columnSpan={2}>
        <Rect width={180} height={40} color="#f5f8fc" />
        <Text x={8} y={8}>
            跨两列的内容组
        </Text>
    </GridItem>
    <Rect width={80} height={40} color="#e5efff" />
</Grid>
```

Vue、Svelte 可使用同名 `<GridItem>`；Angular 使用 `<canvas-grid-item [columnSpan]="2">...</canvas-grid-item>`，并在对应组件中导入 `GridItem`。

### `<Image>`

从 `src` 加载图片并绘制到 Canvas 指定尺寸。`objectFit` 支持 `contain`（默认）、`cover`、`fill`、`none` 和 `scale-down`；加载失败时调用 `onError(error)`。Angular 使用 `(imageError)` 事件绑定错误回调。

| 属性               | 类型                                                       | 必需 | 默认值      | 说明                 |
| ------------------ | ---------------------------------------------------------- | ---: | ----------- | -------------------- |
| `src`              | `string`                                                   |   是 | —           | 图片 URL。           |
| `width` / `height` | `number`                                                   |   是 | —           | Canvas 逻辑尺寸。    |
| `objectFit`        | `"contain" \| "cover" \| "fill" \| "none" \| "scale-down"` |   否 | `"contain"` | 图片缩放和裁剪方式。 |
| `onError`          | `(error: Error) => void`                                   |   否 | —           | 图片加载失败回调。   |

```tsx
<Image x={16} y={16} src="/avatar.png" width={96} height={96} objectFit="cover" />
```

远程图片可正常绘制，但浏览器的 CORS 规则仍适用于 Canvas 导出：若图片服务器未授权跨域，包含该图片的 Canvas 可能无法导出为 PNG。

### `<Progress>`

绘制非交互进度条。`value` 会限制在 `min` 至 `max` 范围内。

| 属性                                 | 类型      |       默认值 | 说明                                 |
| ------------------------------------ | --------- | -----------: | ------------------------------------ |
| `value`                              | `number`  |         必需 | 当前进度值。                         |
| `min` / `max`                        | `number`  |  `0` / `100` | 进度范围。                           |
| `width` / `height`                   | `number`  | `200` / `12` | 轨道尺寸。                           |
| `color` / `trackColor` / `textColor` | `string`  |       主题色 | 进度、轨道和文字颜色；显式属性优先。 |
| `borderRadius`                       | `number`  |   高度的一半 | 圆角半径。                           |
| `showText`                           | `boolean` |      `false` | 是否在轨道右侧绘制百分比。           |

### `<Carousel>` 和 `<CarouselItem>`

`Carousel` 按子项顺序展示一个 `CarouselItem`，可自动轮播、循环切换，并使用左右箭头或底部指示点切换。子项内容支持任意 Canvas UI 组件；未显式传入 `activeIndex` 时为非受控模式，默认从第 0 项开始。

| 组件           | 属性                      | 类型                      | 默认值 | 说明                                              |
| -------------- | ------------------------- | ------------------------- | ------ | ------------------------------------------------- |
| `Carousel`     | `width` / `height`        | `number`                  | 必需   | 轮播视口尺寸，内容超出边界会裁剪。                |
| `Carousel`     | `activeIndex`             | `number`                  | —      | 受控当前项索引；配合 `onChange` 更新。            |
| `Carousel`     | `defaultActiveIndex`      | `number`                  | `0`    | 非受控初始项索引。                                |
| `Carousel`     | `autoplay`                | `boolean`                 | `true` | 是否自动轮播；少于两项时不自动切换。              |
| `Carousel`     | `interval`                | `number`                  | `3000` | 自动切换间隔，单位毫秒，最小按 `250` 毫秒处理。   |
| `Carousel`     | `transitionDuration`      | `number`                  | `450`  | 横向滑动过渡时长，单位毫秒；设为 `0` 可立即切换。 |
| `Carousel`     | `loop`                    | `boolean`                 | `true` | 到达末项后是否循环回首项。                        |
| `Carousel`     | `showArrows` / `showDots` | `boolean`                 | `true` | 是否显示左右切换箭头和底部指示点。                |
| `Carousel`     | `onChange`                | `(index: number) => void` | —      | 当前项变化回调。                                  |
| `CarouselItem` | 子组件                    | Canvas UI 组件            | —      | 当前页要显示的内容。                              |

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

Angular 使用 `<canvas-carousel>` 和 `<canvas-carousel-item>`，受控索引变化使用 `(activeIndexChange)`。

### `<Tabs>` 和 `<TabItem>`

`Tabs` 用 `TabItem` 声明标签和对应 Canvas 子树。默认选中第一个 TabItem。

| 组件      | 属性                                                               | 类型                    | 说明                                                     |
| --------- | ------------------------------------------------------------------ | ----------------------- | -------------------------------------------------------- |
| `Tabs`    | `width` / `height`                                                 | `number`                | 标签容器尺寸，必需。内容在标签栏下方绘制并裁剪到内容区。 |
| `Tabs`    | `activeKey` / `defaultActiveKey`                                   | `string`                | 受控选中项 / 非受控初始项。                              |
| `Tabs`    | `headerHeight`                                                     | `number`                | 标签栏高度，默认 `40`。                                  |
| `Tabs`    | `backgroundColor` / `textColor` / `activeColor` / `indicatorColor` | `string`                | 标签栏、文字、选中态和指示线颜色。                       |
| `Tabs`    | `onChange`                                                         | `(key: string) => void` | 标签切换回调。                                           |
| `TabItem` | `id` / `title`                                                     | `string`                | 标签唯一标识和标题，必需。                               |
| `TabItem` | `disabled`                                                         | `boolean`               | 禁用标签点击。                                           |
| `TabItem` | 子组件                                                             | Canvas UI 组件          | 该标签的 Canvas 内容。                                   |

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

Angular 对应 `<canvas-tabs>` 和 `<canvas-tab-item>`，选中项变更使用 `(activeKeyChange)`。

### `<Collapse>` 和 `<CollapseItem>`

每个 `CollapseItem` 的标题栏可点击展开或折叠，子组件作为面板内容。

| 组件           | 属性                                            | 类型                       | 说明                                   |
| -------------- | ----------------------------------------------- | -------------------------- | -------------------------------------- |
| `Collapse`     | `width`                                         | `number`                   | 面板宽度，必需。                       |
| `Collapse`     | `activeKeys` / `defaultActiveKeys`              | `string[]`                 | 受控展开项 / 非受控初始展开项。        |
| `Collapse`     | `accordion`                                     | `boolean`                  | 默认 `false`；为 `true` 时单项展开。   |
| `Collapse`     | `headerHeight`                                  | `number`                   | 标题栏高度，默认 `40`。                |
| `Collapse`     | `backgroundColor` / `textColor` / `borderColor` | `string`                   | 所有标题栏的默认背景、文字和边框颜色。 |
| `Collapse`     | `onChange`                                      | `(keys: string[]) => void` | 展开项变化回调。                       |
| `CollapseItem` | `id` / `title`                                  | `string`                   | 面板唯一标识和标题，必需。             |
| `CollapseItem` | `height`                                        | `number`                   | 展开内容高度，默认 `100`。             |
| `CollapseItem` | `disabled`                                      | `boolean`                  | 禁止展开/折叠。                        |
| `CollapseItem` | `backgroundColor` / `textColor` / `borderColor` | `string`                   | 覆盖该项标题栏的颜色。                 |

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

Angular 对应 `<canvas-collapse>` 和 `<canvas-collapse-item>`，展开项变化使用 `(activeKeysChange)`。

### `<Dialog>`

确认对话框默认居中覆盖 Canvas，并绘制遮罩、标题、内容区及内置取消/确认按钮。可在内容区放入任意 Canvas UI 组件。对话框打开时在内的 Input/Textarea 暂不可输入，以避免遮罩触摸穿透。

| 属性                         | 类型           |              默认值 | 说明                                      |
| ---------------------------- | -------------- | ------------------: | ----------------------------------------- |
| `open`                       | `boolean`      |                必需 | 是否显示对话框。                          |
| `width` / `height`           | `number`       |       `420` / `240` | 对话框尺寸。                              |
| `title`                      | `string`       |         `"Confirm"` | 标题。                                    |
| `confirmText` / `cancelText` | `string`       | `"OK"` / `"Cancel"` | 内置按钮文本。                            |
| `closeOnBackdrop`            | `boolean`      |              `true` | 点击遮罩是否触发取消回调。                |
| `onConfirm` / `onCancel`     | `() => void`   |                   — | 确认和取消回调。                          |
| 子组件                       | Canvas UI 组件 |                   — | 对话框内容区，可放置任意 Canvas UI 组件。 |

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

Angular 使用 `<canvas-dialog>`，对应 `open` 输入及 `(confirm)` / `(cancel)` 输出。

### `<Rect>`

绘制矩形。支持[通用属性](#通用属性)。

| 属性          | 类型     |          默认值 | 说明                         |
| ------------- | -------- | --------------: | ---------------------------- |
| `width`       | `number` |           `100` | 宽度。                       |
| `height`      | `number` |            `40` | 高度。                       |
| `color`       | `string` | `"transparent"` | 填充颜色。                   |
| `radius`      | `number` |             `0` | 圆角半径。                   |
| `stroke`      | `string` |               — | 描边颜色；不传时不绘制描边。 |
| `strokeWidth` | `number` |             `1` | 描边宽度。                   |

### `<Circle>`

绘制圆形。支持[通用属性](#通用属性)。

| 属性          | 类型     |      默认值 | 说明                         |
| ------------- | -------- | ----------: | ---------------------------- |
| `radius`      | `number` |        `10` | 圆形半径。                   |
| `color`       | `string` | `"#e74c3c"` | 填充颜色。                   |
| `stroke`      | `string` |           — | 描边颜色；不传时不绘制描边。 |
| `strokeWidth` | `number` |         `1` | 描边宽度。                   |

### `<Text>`

绘制单行或自动换行文本。支持[通用属性](#通用属性)。

| 属性         | 类型                            |         默认值 | 说明                                                       |
| ------------ | ------------------------------- | -------------: | ---------------------------------------------------------- |
| `text`       | `string`                        |              — | 文本内容。                                                 |
| 子内容       | `string \| number`              |              — | 各框架可用对应的模板文本代替 `text`。                      |
| `fontSize`   | `number`                        |           `16` | 字号，单位为逻辑像素。                                     |
| `width`      | `number`                        |              — | 最大行宽；超出后自动换行。中文等宽字符也会按测量宽度换行。 |
| `fontFamily` | `string`                        | `"sans-serif"` | 字体族。                                                   |
| `color`      | `string`                        |       `"#333"` | 字体颜色。                                                 |
| `baseline`   | `CanvasTextBaseline`            |        `"top"` | Canvas 文本基线。                                          |
| `textAlign`  | `"left" \| "center" \| "right"` |       `"left"` | 文字水平对齐方式；设置 `width` 时相对于文本区域对齐。      |

### `<Icon>`

原创通用矢量图标，不依赖图标字体或外部图片。支持[通用属性](#通用属性)。

| 属性          | 类型                   |      默认值 | 说明                                                       |
| ------------- | ---------------------- | ----------: | ---------------------------------------------------------- |
| `name`        | `IconName`             |        必需 | 图标名称，见下方名称清单。                                 |
| `size`        | `number`               |        `24` | 图标宽高。                                                 |
| `color`       | `string`               |    `"#333"` | 图标颜色；可通过 `--canvas-ui-icon-color` 设置主题默认色。 |
| `variant`     | `"outline" \| "solid"` | `"outline"` | `outline` 为线框；`solid` 使用粗线并填充主要图形。         |
| `strokeWidth` | `number`               |         `2` | 线框线宽；实底风格使用至少 `4` 的线宽。                    |

支持 `home`、`house`、`building`、`apartment`、`store`、`mapPin`、`map`、`globe`、`compass`、`navigation`、`flag`、`mountain`、`tree`、`leaf`、`flower`、`sun`、`moon`、`cloud`、`rain`、`snow`、`fire`、`water`、`wind`、`car`、`bus`、`train`、`plane`、`bicycle`、`ship`、`rocket`、`truck`、`walk`、`phone`、`message`、`mail`、`bell`、`calendar`、`clock`、`alarm`、`camera`、`image`、`video`、`music`、`microphone`、`headphones`、`play`、`pause`、`stop`、`record`、`volume`、`wifi`、`bluetooth`、`battery`、`signal`、`power`、`monitor`、`laptop`、`tablet`、`keyboard`、`mouse`、`printer`、`folder`、`file`、`document`、`download`、`upload`、`share`、`link`、`search`、`settings`、`sliders`、`menu`、`close`、`check`、`plus`、`minus`、`edit`、`trash`、`copy`、`save`、`lock`、`unlock`、`key`、`user`、`users`、`heart`、`star`、`bookmark`、`cart`、`bag`、`gift`、`creditCard`、`wallet`、`chart`、`pieChart`、`barChart`、`analytics`、`shield`、`warning`、`info`、`help`、`question`、`tag`、`puzzle`、`code`、`database` 和 `cloudDownload`。

```tsx
<Icon name="search" x={16} y={16} size={28} color="#1677ff" />
<Icon name="heart" x={56} y={16} variant="solid" color="#e74c3c" />
```

### `<Input>`

单行输入框。控件外观绘制在 Canvas 上，透明 HTML input 负责键盘、输入法和选区。

| 属性               | 类型                               |         默认值 | 说明                                       |
| ------------------ | ---------------------------------- | -------------: | ------------------------------------------ |
| `width` / `height` | `number`                           |   `200` / `36` | 控件宽高。                                 |
| `value`            | `string`                           |              — | 受控输入值；使用时应配合 `onChange` 更新。 |
| `defaultValue`     | `string`                           |           `""` | 非受控初始值。                             |
| `placeholder`      | `string`                           |           `""` | 占位文本。                                 |
| `type`             | `"text" \| "password" \| "number"` |       `"text"` | 输入类型。密码内容在 Canvas 上以圆点显示。 |
| `fontSize`         | `number`                           |           `14` | 字号。                                     |
| `fontFamily`       | `string`                           | `"sans-serif"` | 字体族。                                   |
| `color`            | `string`                           |       `"#333"` | 输入文字颜色。                             |
| `bgColor`          | `string`                           |       `"#fff"` | 背景颜色。                                 |
| `borderColor`      | `string`                           |       `"#ccc"` | 普通边框颜色。                             |
| `focusBorderColor` | `string`                           |    `"#3498db"` | 聚焦时边框颜色。                           |
| `borderRadius`     | `number`                           |            `4` | 圆角半径。                                 |
| `padding`          | `number`                           |            `8` | 文本内边距。                               |
| `disabled`         | `boolean`                          |        `false` | 禁用输入。                                 |
| `maxLength`        | `number`                           |              — | 最大字符数；非负整数有效。                 |
| `onChange`         | `(value: string) => void`          |              — | 输入变化回调。                             |
| `onFocus`          | `() => void`                       |              — | 获得焦点回调。                             |
| `onBlur`           | `() => void`                       |              — | 失去焦点回调。                             |

### `<Textarea>`

多行文本框，继承 `<Input>` 的值、尺寸、样式和回调属性；超出固定高度时可在文本框内滚动并显示滚动条；不支持 `type`。额外属性：

| 属性   | 类型     | 说明                                               |
| ------ | -------- | -------------------------------------------------- |
| `rows` | `number` | 可用于表达期望行数；当前绘制高度由 `height` 控制。 |

```tsx
<Textarea width={300} height={120} value={notes} placeholder="输入多行内容" onChange={setNotes} />
```

### `<Upload>`

绘制文件选择按钮。点击后打开浏览器本地文件选择器；此组件不负责上传到服务器。

| 属性               | 类型                      |       默认值 | 说明                                  |
| ------------------ | ------------------------- | -----------: | ------------------------------------- |
| `width` / `height` | `number`                  | `120` / `40` | 按钮宽高。                            |
| `text`             | `string`                  | `"选择文件"` | 按钮文本。                            |
| `accept`           | `string`                  |            — | 文件类型筛选，例如 `"image/*,.pdf"`。 |
| `multiple`         | `boolean`                 |      `false` | 是否允许选择多个文件。                |
| `disabled`         | `boolean`                 |      `false` | 禁用文件选择。                        |
| `onChange`         | `(files: File[]) => void` |            — | 选择文件后回调；取消选择时不触发。    |

```tsx
<Upload accept="image/*" multiple onChange={(files) => console.log(files)} />
```

Angular 使用 `<canvas-upload>` 并通过 `(change)` 获取 `File[]`。

### `<Dropdown>`

Canvas 绘制的下拉选择框。支持[通用属性](#通用属性)。

| 属性               | 类型                              |        默认值 | 说明                                         |
| ------------------ | --------------------------------- | ------------: | -------------------------------------------- |
| `width` / `height` | `number`                          |  `200` / `36` | 控件宽高。                                   |
| `options`          | `Array<string \| DropdownOption>` |          必需 | 选项列表。字符串选项的 label 和 value 相同。 |
| `value`            | `string`                          |             — | 受控选中值。                                 |
| `defaultValue`     | `string`                          |             — | 非受控初始值。                               |
| `placeholder`      | `string`                          | `"Select..."` | 未选择时显示的文本。                         |
| `disabled`         | `boolean`                         |       `false` | 禁用交互。                                   |
| `fontSize`         | `number`                          |          `14` | 字号。                                       |
| `color`            | `string`                          |      `"#333"` | 文字颜色。                                   |
| `bgColor`          | `string`                          |      `"#fff"` | 控件背景色。                                 |
| `borderColor`      | `string`                          |   `"#c7ccd3"` | 普通边框颜色。                               |
| `focusBorderColor` | `string`                          |   `"#3478f6"` | 展开时边框颜色。                             |
| `borderRadius`     | `number`                          |           `4` | 圆角半径。                                   |
| `onChange`         | `(value: string) => void`         |             — | 选择变化回调。                               |

`DropdownOption` 类型：

| 属性       | 类型      | 说明             |
| ---------- | --------- | ---------------- |
| `label`    | `string`  | 展示文本。       |
| `value`    | `string`  | 选项值。         |
| `disabled` | `boolean` | 是否禁用该选项。 |

```tsx
<Dropdown
    value={role}
    options={['Admin', { label: '只读用户', value: 'reader', disabled: false }]}
    onChange={setRole}
/>
```

### `<DatePicker>`

Canvas 绘制日期输入框，点击后使用浏览器原生日期选择器。

| 属性               | 类型                      |          默认值 | 说明                              |
| ------------------ | ------------------------- | --------------: | --------------------------------- |
| `width` / `height` | `number`                  |    `200` / `36` | 控件宽高。                        |
| `value`            | `string`                  |               — | 受控日期值，格式为 `YYYY-MM-DD`。 |
| `defaultValue`     | `string`                  |            `""` | 非受控初始日期值。                |
| `placeholder`      | `string`                  | `"Select date"` | 未选择时显示的文本。              |
| `disabled`         | `boolean`                 |         `false` | 禁用日期选择。                    |
| `onChange`         | `(value: string) => void` |               — | 日期变化回调。                    |

### `<Radio>` 和 `<Checkbox>`

两者都接受 `options` 选项数组；Radio 单选，Checkbox 多选。字符串选项的 label 和 value 相同，也可以传 `{ label, value, disabled }` 对象。

| 属性               | 类型                                                                    |         默认值 | 说明               |
| ------------------ | ----------------------------------------------------------------------- | -------------: | ------------------ |
| `options`          | `Array<string \| ChoiceOption>`                                         |           必需 | 选项列表。         |
| `value`            | Radio: `string`; Checkbox: `string[]`                                   |              — | 受控选中值。       |
| `defaultValue`     | Radio: `string`; Checkbox: `string[]`                                   |              — | 非受控初始选中值。 |
| `direction`        | `"horizontal" \| "vertical"`                                            | `"horizontal"` | 选项排列方向。     |
| `width` / `height` | `number`                                                                |       自动计算 | 控件尺寸。         |
| `onChange`         | Radio: `(value: string) => void`; Checkbox: `(value: string[]) => void` |              — | 选中项变化回调。   |

```tsx
<Radio options={['Small', 'Medium', 'Large']} value={size} onChange={setSize} />
<Checkbox options={['Email', 'SMS']} value={channels} onChange={setChannels} />
```

Angular 分别使用 `<canvas-date-picker>`, `<canvas-radio>` 和 `<canvas-checkbox>`；日期选择通过 `(valueChange)` 或 `(change)` 监听，Radio/Checkbox 使用 `(change)`。

### `<Slider>`

拖动滑块。支持[通用属性](#通用属性)。

| 属性               | 类型                      |       默认值 | 说明                 |
| ------------------ | ------------------------- | -----------: | -------------------- |
| `width` / `height` | `number`                  | `160` / `32` | 滑块宽高。           |
| `min` / `max`      | `number`                  |  `0` / `100` | 最小值和最大值。     |
| `step`             | `number`                  |          `1` | 每次变化的步长。     |
| `value`            | `number`                  |            — | 受控值。             |
| `defaultValue`     | `number`                  |        `min` | 非受控初始值。       |
| `disabled`         | `boolean`                 |      `false` | 禁用拖动。           |
| `trackColor`       | `string`                  |  `"#d7dde5"` | 滑轨颜色。           |
| `activeColor`      | `string`                  |  `"#3478f6"` | 已选轨道及描边颜色。 |
| `thumbColor`       | `string`                  |     `"#fff"` | 滑块圆点颜色。       |
| `onChange`         | `(value: number) => void` |            — | 值变化回调。         |

### `<Switch>`

开关控件。支持[通用属性](#通用属性)。

| 属性               | 类型                         |      默认值 | 说明               |
| ------------------ | ---------------------------- | ----------: | ------------------ |
| `width` / `height` | `number`                     | `44` / `24` | 开关宽高。         |
| `checked`          | `boolean`                    |           — | 受控开关状态。     |
| `defaultChecked`   | `boolean`                    |     `false` | 非受控初始状态。   |
| `disabled`         | `boolean`                    |     `false` | 禁止切换。         |
| `onColor`          | `string`                     | `"#3478f6"` | 开启时的轨道颜色。 |
| `offColor`         | `string`                     | `"#c7ccd3"` | 关闭时的轨道颜色。 |
| `thumbColor`       | `string`                     |    `"#fff"` | 滑块颜色。         |
| `onChange`         | `(checked: boolean) => void` |           — | 状态变化回调。     |

### `<Button>`

Canvas 绘制按钮。支持[通用属性](#通用属性)。

| 属性               | 类型               |       默认值 | 说明                                    |
| ------------------ | ------------------ | -----------: | --------------------------------------- |
| `width` / `height` | `number`           | `120` / `40` | 按钮宽高。                              |
| 子内容             | `string \| number` |            — | 按钮文字，可用 `text` 替代。            |
| `text`             | `string`           |            — | 按钮文字；同时提供时优先于 `children`。 |
| `fontSize`         | `number`           |         `15` | 字号。                                  |
| `fontColor`        | `string`           |     `"#fff"` | 文字颜色。                              |
| `backgroundColor`  | `string`           |  `"#3478f6"` | 背景颜色。                              |
| `borderColor`      | `string`           |            — | 描边颜色。                              |
| `borderRadius`     | `number`           |          `6` | 圆角半径。                              |
| `disabled`         | `boolean`          |      `false` | 禁用按钮。                              |
| `onClick`          | `() => void`       |            — | 按钮点击回调。                          |

## 图片导出

通过 `CanvasHandle` 提供的 `ref` 导出图像：

```tsx
const canvasRef = useRef<CanvasHandle>(null);

// PNG Data URL，适合直接设置到 img.src
const dataUrl = canvasRef.current?.toDataURL({
    type: 'image/png',
    width: 840,
    height: 600,
    pixelRatio: 2,
});

// JPEG Blob，可创建下载链接或上传
const blob = await canvasRef.current?.toBlob({
    type: 'image/jpeg',
    quality: 0.9,
    pixelRatio: 2,
});

// 获取底层 HTMLCanvasElement
const canvasElement = canvasRef.current?.getCanvas();
```

`CanvasExportOptions` 参数：

| 属性         | 类型     |               默认值 | 说明                                                                                         |
| ------------ | -------- | -------------------: | -------------------------------------------------------------------------------------------- |
| `width`      | `number` | 当前 Canvas 逻辑宽度 | 导出图逻辑宽度。                                                                             |
| `height`     | `number` | 当前 Canvas 逻辑高度 | 导出图逻辑高度。                                                                             |
| `pixelRatio` | `number` |      Canvas 的像素比 | 输出像素密度；最终位图尺寸约为 `width × pixelRatio` 乘 `height × pixelRatio`。               |
| `type`       | `string` |        `"image/png"` | 图片 MIME 类型，如 `image/png`、`image/jpeg`、`image/webp`。浏览器不支持的格式会回退到 PNG。 |
| `quality`    | `number` |         浏览器默认值 | 有损格式的质量，范围 `0` 到 `1`；PNG 通常不使用此参数。                                      |

兼容简写调用：

```tsx
canvasRef.current?.toDataURL('image/png');
const jpegBlob = await canvasRef.current?.toBlob('image/jpeg', 0.9);
```

导出尺寸和像素比必须为正数。若场景使用的跨域图片未获图片服务器 CORS 授权，`toDataURL()` 会抛出带有原因说明的错误，`toBlob()` 会以同样的错误拒绝 Promise。请配置图片服务器返回允许当前站点的 `Access-Control-Allow-Origin` 响应头，或移除该图片后再导出。

## 文件结构

| 文件                       | 用途                                                                          |
| -------------------------- | ----------------------------------------------------------------------------- |
| `react/`                   | React 组件和 Canvas 容器适配器。                                              |
| `vue/`                     | Vue 3 组件和 Canvas 容器适配器。                                              |
| `svelte/`                  | Svelte 5+ 组件适配器和模板组件。                                              |
| `angular/`                 | Angular standalone Canvas 组件和场景指令。                                    |
| `components/`              | 共用组件实现；每个组件有独立目录、入口和 Props/绘制文件，需要时另含交互逻辑。 |
| `components/components.ts` | 组件统一导出及子树编译。                                                      |
| `components/types.ts`      | 汇总所有公开组件 Props 类型。                                                 |
| `theme.css`                | Canvas 组件的浅色/深色 CSS 主题变量。                                         |
| `types.ts`                 | 组件 Props 汇总、场景节点和输入桥接类型。                                     |
| `renderer.ts`              | 场景遍历及 Canvas 绘制调度。                                                  |
| `input-bridge.ts`          | Input/Textarea 的透明 HTML 输入桥接。                                         |
| `types.ts`                 | 场景、Canvas 和桥接相关类型。                                                 |
| `engine.ts`                | 场景同步、输入桥接、命中测试和控件交互。                                      |
| `engine/transform.ts`      | 纯矩阵数学。                                                                  |
| `engine/interaction.ts`    | pointer/wheel → 组件状态变更。                                                |
| `engine/layout.ts`         | prepare 声明式树归一化。                                                      |
| `engine/carousel.ts`       | 轮播状态机 + 时序动画。                                                       |
| `engine/images.ts`         | 图片订阅生命周期。                                                            |
| `engine/text-controls.ts`  | DOM 输入桥接同步。                                                            |
| `engine/events.ts`         | 公共事件 / canvasView 事件发射。                                              |
| `engine/hit-test.ts`       | 坐标解析 + 命中测试。                                                         |
| `engine/vnodes.ts`         | VNode 树原语（layoutGridChildren 等）。                                       |
| `engine/nodes.ts`          | SceneNode 纯谓词/派生（controlSize 等）。                                     |
| `engine/state.ts`          | 内部类型 + EngineCore 接口 + EngineState 容器。                               |

只需修改组件外观时，优先编辑对应的 `components/<Component>/<component>.ts` 绘制函数；组件专属交互逻辑放在同目录的 `logic.ts`。修改通用布局、事件、导出行为时再编辑对应适配器、`engine.ts` 或 `renderer.ts`。
