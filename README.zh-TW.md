![Markdown Logo](./src/assets/web-canvas-ui-logo-bright.svg "web-canvas-ui")
# Web Canvas UI (React, Vue 3, Svelte, Angular)

[English](./README.md) · [日本語](./README.ja.md) · [한국어](./README.ko.md) · [繁體中文](./README.zh-TW.md) · [Русский](./README.ru.md) · [简体中文](./README.zh-CN.md)

基於 Canvas 2D 的宣告式元件庫，提供 **React**、**Vue 3**、**Svelte 5+** 和 **Angular 17+** 介面卡。各框架從獨立入口匯入並使用原生元件/範本語法；底層 Canvas engine 和控制繪製邏輯共用。控制項外觀由 Canvas 繪製。

> **介面卡說明：** React、Vue、Svelte、Angular 分別從 `web-canvas-ui/react`、`web-canvas-ui/vue`、`web-canvas-ui/svelte`、`web-canvas-ui/angular` 匯入。請根據主 Canvas 框架選擇入口，不要混用元件。它們可以共用同一套 engine 和控制繪製實作。

> **共用元件契約：** 每個控制項依 `components/<Component>/` 歸檔，入口 `index.ts` 統一匯出元件 API，`<component>.ts` 定義 Props 型別和 Canvas 繪製函式，`logic.ts`（需要時）保存該控制項獨有的互動/業務邏輯。公共型別統一從 `components/types.ts` 匯總，並由 `web-canvas-ui/types.ts` 對外匯出；React、Vue、Svelte、Angular 介面卡共用此型別契約。

## 全域主題色

主題顏色集中定義在 [`theme.scss`](src/canvas-ui/theme.scss) 的 `$primary: #1668dc`。只需修改這個主色變數，就會統一更新按鈕、選取態、焦點邊框、進度條等強調色。淺色由主色與白色混合派生，按壓深色由主色降低亮度派生；公共色階也會輸出為 `--canvas-ui-primary*` CSS 變數。`theme.css` 是編譯輸出，應用程式的全域 CSS 匯入它，不要直接編輯產生檔案：

```css
@import 'web-canvas-ui/theme.css';
```

修改 `theme.scss` 後執行 `npm run build:theme` 重新產生 CSS。編譯後的 CSS 自訂屬性適用於 React、Vue、Svelte 和 Angular，並提供 `.dark` 與 `[data-theme="dark"]` 深色主題。元件明確傳入的顏色屬性優先於主題變數。

內建主色主題為藍、綠、紫、橙、紅，給 Canvas 外層容器加入對應 class 即可切換；可以與深色主題組合：

```tsx
<div className="theme-green">
    <Canvas width={400} height={240}>
        <Button>Green theme</Button>
    </Canvas>
</div>
```

| 主題         | class          | 主色      |
| ------------ | -------------- | --------- |
| 藍色（預設） | `theme-blue`   | `#1668dc` |
| 綠色         | `theme-green`  | `#389e0d` |
| 紫色         | `theme-purple` | `#722ed1` |
| 橙色         | `theme-orange` | `#d46b08` |
| 紅色         | `theme-red`    | `#cf1322` |

例如同時加入 `dark` 和 `theme-purple`，或加入 `data-theme="dark"` 與 `theme-purple`，即可使用紫色深色主題。所有主題的淺色/按壓/深色強調色都根據對應主色由 Sass 統一派生。

| 元件                          | CSS 自訂屬性                                                                                                                                                                                                                                                                                         |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button / Upload               | `--canvas-ui-button-background`、`--canvas-ui-button-color`、`--canvas-ui-button-border`、`--canvas-ui-button-pressed-background`                                                                                                                                                                    |
| Carousel                      | `--canvas-ui-carousel-arrow`、`--canvas-ui-carousel-dot`、`--canvas-ui-carousel-active-dot`                                                                                                                                                                                                          |
| Radio / Checkbox              | `--canvas-ui-choice-active`、`--canvas-ui-choice-border`、`--canvas-ui-choice-color`、`--canvas-ui-choice-disabled`、`--canvas-ui-choice-disabled-background`                                                                                                                                        |
| Collapse                      | `--canvas-ui-collapse-header-background`、`--canvas-ui-collapse-border`、`--canvas-ui-collapse-color`、`--canvas-ui-collapse-disabled-color`                                                                                                                                                         |
| Dialog                        | `--canvas-ui-dialog-mask`、`--canvas-ui-dialog-background`、`--canvas-ui-dialog-title-color`、`--canvas-ui-dialog-border`、`--canvas-ui-dialog-confirm-background`、`--canvas-ui-dialog-cancel-background`、`--canvas-ui-dialog-confirm-color`、`--canvas-ui-dialog-cancel-color`                    |
| Dropdown                      | `--canvas-ui-dropdown-background`、`--canvas-ui-dropdown-color`、`--canvas-ui-dropdown-placeholder-color`、`--canvas-ui-dropdown-border`、`--canvas-ui-dropdown-focus-border`、`--canvas-ui-dropdown-option-background`、`--canvas-ui-dropdown-option-border`、`--canvas-ui-dropdown-disabled-color` |
| Input / Textarea / DatePicker | `--canvas-ui-input-background`、`--canvas-ui-input-color`、`--canvas-ui-input-placeholder-color`、`--canvas-ui-input-border`、`--canvas-ui-input-focus-border`                                                                                                                                       |
| Progress                      | `--canvas-ui-progress-track`、`--canvas-ui-progress-active`、`--canvas-ui-progress-text`                                                                                                                                                                                                             |
| Rect / Circle / Text / Icon   | `--canvas-ui-rect-background`、`--canvas-ui-rect-border`、`--canvas-ui-circle-background`、`--canvas-ui-circle-border`、`--canvas-ui-text-color`、`--canvas-ui-icon-color`                                                                                                                           |
| Slider                        | `--canvas-ui-slider-track`、`--canvas-ui-slider-active`、`--canvas-ui-slider-thumb`                                                                                                                                                                                                                  |
| Switch                        | `--canvas-ui-switch-on`、`--canvas-ui-switch-off`、`--canvas-ui-switch-thumb`                                                                                                                                                                                                                        |
| Tabs                          | `--canvas-ui-tabs-background`、`--canvas-ui-tabs-color`、`--canvas-ui-tabs-active-color`、`--canvas-ui-tabs-indicator`、`--canvas-ui-tabs-disabled-color`                                                                                                                                            |

要自訂某個應用程式主題時，可在自己的 CSS 覆寫所需變數，例如 `.brand { --canvas-ui-button-background: #6d4aff; }`。表中列出了所有元件實際讀取的主題變數。

## 環境與匯入

將 `web-canvas-ui/` 目錄放入專案，並確保主 Canvas 專案已設定對應框架：React 19+、Vue 3、Svelte 5+ 或 Angular 17+。Vue 使用單一檔案元件範本，不需要 JSX 外掛或 `jsxImportSource` 設定；Svelte 專案需要 Svelte 編譯器及對應建置外掛；Angular 專案需要 `@angular/core` 和 Angular 建置設定。框架相依由主 Canvas 專案提供，本目錄不強制其他框架的相依。

| 框架        | 入口                 |
| ----------- | -------------------- |
| React       | `web-canvas-ui/react`   |
| Vue 3       | `web-canvas-ui/vue`     |
| Svelte 5+   | `web-canvas-ui/svelte`  |
| Angular 17+ | `web-canvas-ui/angular` |

元件必須放在對應介面卡的 Canvas 容器內，並使用該框架入口匯出的場景元件。不要在 Canvas 場景裡放一般 DOM 元素。

## 快速開始（React）

```tsx
import { useRef, useState } from 'react';
import { Canvas, Group, Rect, Text, Input, Button } from 'web-canvas-ui/react';
import type { CanvasHandle } from 'web-canvas-ui/react';
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
                        Export Image
                    </Button>
                </Group>
            </Canvas>
        </section>
    );
}
```

`x`、`y` 是元件相對於父層的位置，單位為 Canvas 邏輯像素。`Group` 可巢狀，子元件座標會累加父層的位置、縮放和旋轉。

## 快速開始（Vue 3 單一檔案元件）

Vue 介面卡位於獨立的 `/canvas-ui/vue` 入口。直接在 `.vue` 檔案的範本中巢狀 Canvas UI 元件即可，不需要 TSX、JSX 外掛或手動建立 Canvas 節點陣列：

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
                匯出圖片
            </Button>
        </Group>
    </Canvas>
</template>
```

Vue 範本透過 `:value` 綁定響應式狀態、透過 `@change` 更新；Canvas 元件會在 Vue 更新後同步場景。

## 快速開始（Svelte 5+）

在 Svelte 5 範本中使用 Svelte 入口匯出的元件。`Canvas` 可用 `bind:this` 存取匯出方法：

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

Svelte 控制項屬性變化會同步到 Canvas 場景；

## 快速開始（Angular 17+）

Angular 入口提供 standalone `Canvas` 元件和場景指令。在使用它們的 standalone 元件中匯入所需符號：

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

Angular 使用 `<canvas-...>` 指令選擇器宣告 Canvas 場景節點。輸入框、下拉選單和滑桿使用 `(valueChange)` 輸出，開關使用 `(checkedChange)`，按鈕使用 `(click)`。

互動屬性依框架習慣傳遞：React 使用 `onChange`/`onClick` props，Vue 使用 `@change`/`@click`，Svelte 使用 `onChange`/`onClick` 回呼 props；Angular 使用 `(valueChange)`、`(checkedChange)` 和 `(click)` 輸出綁定。

## 通用屬性

除 `Canvas` 外，所有可見元件都支援以下變換屬性：

| 屬性       | 型別      | 預設值 | 說明                                                      |
| ---------- | --------- | -----: | --------------------------------------------------------- |
| `x`        | `number`  |    `0` | 相對於父層的水平和位置。                                  |
| `y`        | `number`  |    `0` | 相對於父層的垂直位置。                                    |
| `rotation` | `number`  |    `0` | 旋轉弧度。                                                |
| `scaleX`   | `number`  |    `1` | 水平變換縮放。                                            |
| `scaleY`   | `number`  |    `1` | 垂直變換縮放。                                            |
| `visible`  | `boolean` | `true` | 是否繪製；設為 `false` 時，其子元件也隱藏且不會回應點擊。 |

### 尺寸規則

- `Rect`、`Input`、`Textarea`、`Upload`、`Dropdown`、`DatePicker`、`Slider`、`Switch`、`Button` 用 `width` 和 `height` 設定尺寸。
- `Circle` 使用 `radius`（預設 `10`）設定半徑，直徑為半徑的兩倍。
- `Text` 用 `fontSize` 設定字級、用 `width` 設定換行寬度。
- `width`/`height` 未設定時使用各元件文件所列預設值。`Group` 是容器，沒有獨立寬高；`Grid` 依行數和儲存格屬性佈局。
- `Grid` 依子元件順序自動排列，填入指定行數後換到下一列；可指定 `columns`、`cellHeight` 和可選的 `gap`；儲存格寬度可用 `cellWidth` 固定，也可透過 `width` 平均分配。直接子元件預設佔一個儲存格；用 `GridItem` 可以把多個控制項作為一組並設定跨列/跨行，組內子元件尺寸仍由各自屬性決定。

## 元件參數

### `<Canvas>`

建立 Canvas 場景。尺寸為邏輯像素，實際點陣圖會乘以像素比。

| 屬性                                                | 型別                                                                          | 必需 |                                                           預設值 | 說明                                                                                                       |
| --------------------------------------------------- | ----------------------------------------------------------------------------- | ---: | ---------------------------------------------------------------: | ---------------------------------------------------------------------------------------------------------- |
| `width`                                             | `number`                                                                      |   是 |                                                                — | Canvas 邏輯寬度。                                                                                          |
| `height`                                            | `number`                                                                      |   是 |                                                                — | Canvas 邏輯高度。                                                                                          |
| 像素比                                              | 自動                                                                          |    — | 自動讀取 `window.devicePixelRatio`，且至少為 `1`；无需傳入屬性。 | Canvas 繪解像度比例。                                                                                      |
| `className`（React/Angular）/ `class`（Vue/Svelte） | `string`                                                                      |   否 |                                                                — | 外層容器的 CSS class。                                                                                     |
| `style`                                             | 對應框架的樣式物件或字串                                                      |   否 |                                                                — | 外層容器樣式；容器的 `position`、`width`、`height` 由元件設定。                                            |
| `ariaLabel`                                         | `string`                                                                      |   否 |                                                       `"Canvas"` | Canvas 的無障礙標籤。                                                                                      |
| `onFrame`                                           | `(time: number) => void`                                                      |   否 |                                                                — | 每幀回呼，`time` 是瀏覽器動畫幀時間戳。                                                                    |
| `onEvent`                                           | `(event: CanvasUIEvent) => void`                                              |   否 |                                                                — | Canvas 統一事件入口，接收 `pointerdown`、`pointermove`、`pointerup`、`pointercancel`、`click` 和 `wheel`。 |
| 子元件                                              | React children / Vue 預設 slot / Svelte children / Angular content projection |   否 |                                                                — | Canvas UI 元件樹。                                                                                         |

`onEvent` 事件包含 Canvas 邏輯座標 `x`/`y`、命中的 `target`（元件 `type` 和使用者 `key`；空白處為 `null`）以及命中元件區域座標 `localX`/`localY`。`wheel` 事件另含 `deltaY`，指標事件另含 `pointerId`。統一的 `click` 只在同一目標按下並釋放、移動距離不超過 8 個邏輯像素時觸發一次；拖動或取消不會觸發。各元件現有的 `onClick`、`onChange` 等回呼仍照常執行，`onEvent` 適合處理跨元件的業務邏輯或統一埋點。

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

透過 React ref、Vue 範本 ref、Svelte `bind:this` 或 Angular 範本引用可以使用截圖介面，詳情見[圖片匯出](#圖片匯出)；`CanvasHandle` 還提供 `requestRender()`，用於在來源 Canvas 更新後請求主 Canvas 重繪。

### `<CanvasView>`

將第三方或其他模組建立的同頁面 `HTMLCanvasElement` 畫面繪製到當前 Canvas 中。只嵌入像素畫面，不會把來源 Canvas 的 DOM 或事件處理器帶入當前 Canvas。

| 屬性               | 型別                                      | 必需 |      預設值 | 說明                                                                                                                          |
| ------------------ | ----------------------------------------- | ---: | ----------: | ----------------------------------------------------------------------------------------------------------------------------- |
| `source`           | `HTMLCanvasElement`                       |   是 |           — | 要顯示的來源 Canvas 實例。                                                                                                    |
| `width` / `height` | `number`                                  |   是 |           — | 在當前 Canvas 中佔用的邏輯尺寸。                                                                                              |
| `fit`              | `'contain' \| 'cover' \| 'fill'`          |   否 | `'contain'` | 保持比例完整顯示、保持比例裁剪填滿，或拉伸填滿。                                                                              |
| `onPointerEvent`   | `(event: CanvasViewPointerEvent) => void` |   否 |           — | 提供映射後的 `pointerdown`、`pointermove`、`pointerup`、`pointercancel` 和 `click` 事件；不會自動向來源 Canvas 派送合成事件。 |

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

// 第三方 Canvas 更新畫面後，通知主 Canvas 重新繪製：
canvasRef.current?.requestRender();
```

事件同時包含 `x`/`y`（CanvasView 區域邏輯座標）、`sourceX`/`sourceY`（來源 Canvas 點陣圖像素座標）、來源畫布尺寸、按鈕狀態、`pointerId`、`pointerType`、`pressure` 和 `isPrimary`。`contain` 留白區域不會命中；拖動期間事件繼續報告來源畫布座標，即使指標短暫移出元件範圍。開發者可使用這些資料呼叫第三方函式庫的互動 API。來源 Canvas 不會自動通知主 Canvas 內容變化；來源內容更新後呼叫主 Canvas 的 `requestRender()`，也可在動畫幀中更新來源畫布後呼叫。若來源 Canvas 含有未獲 CORS 授權的圖片，主 Canvas 畫布會被污染，匯出同樣會失敗；Canvas 的跨域限制無法透過此元件繞過。

### `<CustomDraw>`

當內建元件無法滿足繪製需求時，使用 `CustomDraw` 提供 Canvas 2D 繪製回呼。它會在每次場景重繪（包括圖片匯出）時執行；回呼座標原點為元件左上角，並可使用通用位置、旋轉、縮放屬性。

| 屬性               | 型別                                                                                   | 必需 | 說明                                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------- | ---: | --------------------------------------------------------------------------------------------------------- |
| `width` / `height` | `number`                                                                               |   是 | 自訂繪製區域尺寸，非負有限數值。                                                                          |
| `draw`             | `(context: CanvasRenderingContext2D, size: { width: number; height: number }) => void` |   是 | 在區域內執行同步繪製；`size` 提供對應寬高。                                                               |
| `onClick`          | `(event: CustomDrawClickEvent) => void`                                                |   否 | 點擊回呼；座標 `x`/`y` 是元件區域座標，`canvasX`/`canvasY` 是 Canvas 邏輯座標，並提供尺寸和 `pointerId`。 |
| `hitTest`          | `(x: number, y: number, size: CustomDrawSize) => boolean`                              |   否 | 自訂圖形命中測試；不傳時使用整個寬高矩形。返回 `false` 時命中測試會繼續檢查下層元件。                     |

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

每次呼叫都會隔離 Canvas 繪圖狀態，回呼設定的顏色、線寬、變換等不會污染其他元件。回呼只應繪製，不要在其中更新 UI 狀態或執行副作用；繪製錯誤會原樣丟出。

### `<Group>`

用於分組、定位和變換子元件。支援[通用屬性](#通用屬性)，以及：

| 屬性   | 型別                                                          | 說明                |
| ------ | ------------------------------------------------------------- | ------------------- |
| 子元件 | React children / Vue/Svelte slot / Angular content projection | 子 Canvas UI 元件。 |

```tsx
<Group x={20} y={30} scaleX={1.2}>
    <Text x={10} y={10}>
        群組內文字
    </Text>
</Group>
```

### `<Grid>`

依順序將子元件放入固定尺寸儲存格，填滿指定行數後換到下一列。`Grid` 不繪製背景；它是佈局容器，可像 `Group` 一樣使用變換屬性。

| 屬性         | 型別                          | 必需 | 預設值 | 說明                                                                                                               |
| ------------ | ----------------------------- | ---: | -----: | ------------------------------------------------------------------------------------------------------------------ |
| `columns`    | `number`                      |   是 |      — | 每列行數，必須是正整數。                                                                                           |
| `width`      | `number`                      |   否 |      — | Grid 總寬度。未傳 `cellWidth` 時必需，扣除列間 gap 後平均分配給各行；傳入 `cellWidth` 時也可省略，寬度按列數計算。 |
| `height`     | `number`                      |   否 |      — | 固定可見高度。超出部分裁剪，並顯示捲軸；可在 Grid 內捲軸捲動。                                                     |
| `cellWidth`  | `number`                      |   否 |      — | 固定儲存格邏輯寬度；傳入時優先於 `width` 自動分配。必須為正數。                                                    |
| `cellHeight` | `number`                      |   是 |      — | 儲存格邏輯高度，必須為正數。                                                                                       |
| `gap`        | `number`                      |   否 |    `0` | 行和列之間相同的間距，不能為負數。                                                                                 |
| `onScroll`   | `(scrollTop: number) => void` |   否 |      — | 捲動位置變化回呼，單位為邏輯像素。                                                                                 |

直接子元件保留自己的 `x`、`y`，並疊加所在儲存格偏移。未傳 `cellWidth` 時按 `(width - gap * (columns - 1)) / columns` 計算等寬列；子元件自己的尺寸不會自動拉伸。

每個子元件還會取得所在儲存格的可用盒子：沒有宣告 `width` 和 `maxLines` 的 `<Text>` 會依儲存格寬度換行，並在高度放不下時以省略符號截斷最後一行。`<GridItem>` 會把跨格後的區域下發給它分組的控制元件。顯式宣告這兩個屬性時永遠以宣告值為準，因此節點可以刻意比儲存格更窄。

```tsx
<Grid columns={3} cellWidth={100} cellHeight={50} gap={8}>
    <Rect width={80} height={40} color="#f5f8fc" />
    <Rect width={80} height={40} color="#e5efff" />
    <Rect width={80} height={40} color="#d5e5ff" />
</Grid>
```

需要依總寬度平均分行時省略 `cellWidth`：

```tsx
<Grid columns={3} width={316} cellHeight={50} gap={8}>
    <Rect width={80} height={40} color="#f5f8fc" />
    <Rect width={80} height={40} color="#e5efff" />
    <Rect width={80} height={40} color="#d5e5ff" />
</Grid>
```

Vue、Svelte 使用相同屬性；Angular 使用 `<canvas-grid [columns]="3" [width]="316" [cellHeight]="50" [gap]="8">`，並在對應元件中匯入 `Grid`。

給 Grid 設定 `height` 後，內容超出視窗時可以捲軸捲動，子項會被裁剪在固定高度內：

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

`GridItem` 是 Grid 內的分組/佈局節點，不會獨立繪製。它可以包含多個控制項，並讓這些控制項作為一個柵格項一起定位；組內子元件仍使用自己的尺寸和區域座標。直接放在 `Grid` 下的普通控制項仍然有效，預設佔一個儲存格。

| 屬性                                         | 型別     | 預設值 | 說明                                           |
| -------------------------------------------- | -------- | -----: | ---------------------------------------------- |
| `columnSpan`                                 | `number` |    `1` | 佔用列數，正整數且不能超過 Grid 的 `columns`。 |
| `rowSpan`                                    | `number` |    `1` | 佔用行數，正整數。                             |
| `backgroundColor`                            | `string` |      — | 繪製柵格項背景，覆蓋其跨列/跨行儲存格區域。    |
| `x` / `y`                                    | `number` |    `0` | 相對柵格儲存格起點的偏移。                     |
| `rotation` / `scaleX` / `scaleY` / `visible` | —        |      — | 與 `Group` 相同的變換和可見性屬性。            |

Grid 會依行優先放置項目，並跳過已被跨行/跨列項目佔用的儲存格：

```tsx
<Grid columns={3} width={316} cellHeight={50} gap={8}>
    <GridItem columnSpan={2}>
        <Rect width={180} height={40} color="#f5f8fc" />
        <Text x={8} y={8}>
            跨兩列的內容群組
        </Text>
    </GridItem>
    <Rect width={80} height={40} color="#e5efff" />
</Grid>
```

Vue、Svelte 可使用同名 `<GridItem>`；Angular 使用 `<canvas-grid-item [columnSpan]="2">...</canvas-grid-item>`，並在對應元件中匯入 `GridItem`。

### `<Image>`

從 `src` 載入圖片並繪製到 Canvas 指定尺寸。`objectFit` 支援 `contain`（預設）、`cover`、`fill`、`none` 和 `scale-down`；載入失敗時呼叫 `onError(error)`。Angular 使用 `(imageError)` 事件綁定錯誤回呼。

| 屬性               | 型別                                                       | 必需 | 預設值      | 說明                 |
| ------------------ | ---------------------------------------------------------- | ---: | ----------- | -------------------- |
| `src`              | `string`                                                   |   是 | —           | 圖片 URL。           |
| `width` / `height` | `number`                                                   |   是 | —           | Canvas 邏輯尺寸。    |
| `objectFit`        | `"contain" \| "cover" \| "fill" \| "none" \| "scale-down"` |   否 | `"contain"` | 圖片縮放和裁剪方式。 |
| `onError`          | `(error: Error) => void`                                   |   否 | —           | 圖片載入失敗回呼。   |

```tsx
<Image x={16} y={16} src="/avatar.png" width={96} height={96} objectFit="cover" />
```

遠端圖片可正常繪製，但瀏覽器的 CORS 規則仍適用於 Canvas 匯出：若圖片伺服器未授權跨域，包含該圖片的 Canvas 可能無法匯出為 PNG。

### `<Progress>`

繪製非互動進度條。`value` 會限制在 `min` 至 `max` 範圍內。

| 屬性                                 | 型別      |       預設值 | 說明                                 |
| ------------------------------------ | --------- | -----------: | ------------------------------------ |
| `value`                              | `number`  |         必需 | 目前進度值。                         |
| `min` / `max`                        | `number`  |  `0` / `100` | 進度範圍。                           |
| `width` / `height`                   | `number`  | `200` / `12` | 軌道尺寸。                           |
| `color` / `trackColor` / `textColor` | `string`  |       主題色 | 進度、軌道和文字顏色；明確屬性優先。 |
| `borderRadius`                       | `number`  |   高度的一半 | 圓角半徑。                           |
| `showText`                           | `boolean` |      `false` | 是否在軌道右側繪製百分比。           |

### `<Carousel>` 和 `<CarouselItem>`

`Carousel` 依子項順序展示一個 `CarouselItem`，可自動輪播、迴圈切換，並使用左右箭頭或底部指示點切換。子項內容支援任意 Canvas UI 元件；未明確傳入 `activeIndex` 時為非受控模式，預設從第 0 項開始。

| 元件           | 屬性                      | 型別                      | 預設值 | 說明                                              |
| -------------- | ------------------------- | ------------------------- | ------ | ------------------------------------------------- |
| `Carousel`     | `width` / `height`        | `number`                  | 必需   | 輪播視窗尺寸，內容超出邊界會裁剪。                |
| `Carousel`     | `activeIndex`             | `number`                  | —      | 受控目前項索引；搭配 `onChange` 更新。            |
| `Carousel`     | `defaultActiveIndex`      | `number`                  | `0`    | 非受控初始項索引。                                |
| `Carousel`     | `autoplay`                | `boolean`                 | `true` | 是否自動輪播；少於兩項時不自動切換。              |
| `Carousel`     | `interval`                | `number`                  | `3000` | 自動切換間隔，單位毫秒，最小按 `250` 毫秒處理。   |
| `Carousel`     | `transitionDuration`      | `number`                  | `450`  | 橫向滑動過渡時長，單位毫秒；設為 `0` 可立即切換。 |
| `Carousel`     | `loop`                    | `boolean`                 | `true` | 到達末項後是否迴圈回首項。                        |
| `Carousel`     | `showArrows` / `showDots` | `boolean`                 | `true` | 是否顯示左右切換箭頭和底部指示點。                |
| `Carousel`     | `onChange`                | `(index: number) => void` | —      | 目前項變化回呼。                                  |
| `CarouselItem` | 子元件                    | Canvas UI 元件            | —      | 目前頁要顯示的內容。                              |

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

Angular 使用 `<canvas-carousel>` 和 `<canvas-carousel-item>`，受控索引變化使用 `(activeIndexChange)`。

### `<Tabs>` 和 `<TabItem>`

`Tabs` 用 `TabItem` 宣告標籤和對應 Canvas 子樹。預設選取第一個 TabItem。

| 元件      | 屬性                                                               | 型別                    | 說明                                                     |
| --------- | ------------------------------------------------------------------ | ----------------------- | -------------------------------------------------------- |
| `Tabs`    | `width` / `height`                                                 | `number`                | 標籤容器尺寸，必需。內容在標籤列下方繪製並裁剪到內容區。 |
| `Tabs`    | `activeKey` / `defaultActiveKey`                                   | `string`                | 受控選取項 / 非受控初始項。                              |
| `Tabs`    | `headerHeight`                                                     | `number`                | 標籤列高度，預設 `40`。                                  |
| `Tabs`    | `backgroundColor` / `textColor` / `activeColor` / `indicatorColor` | `string`                | 標籤列、文字、選取態和指示線顏色。                       |
| `Tabs`    | `onChange`                                                         | `(key: string) => void` | 標籤切換回呼。                                           |
| `TabItem` | `id` / `title`                                                     | `string`                | 標籤唯一識別碼和標題，必需。                             |
| `TabItem` | `disabled`                                                         | `boolean`               | 停用標籤點擊。                                           |
| `TabItem` | 子元件                                                             | Canvas UI 元件          | 該標籤的 Canvas 內容。                                   |

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

Angular 對應 `<canvas-tabs>` 和 `<canvas-tab-item>`，選取項變更使用 `(activeKeyChange)`。

### `<Collapse>` 和 `<CollapseItem>`

每個 `CollapseItem` 的標題列可點擊展開或摺疊，子元件作為面板內容。

| 元件           | 屬性                                            | 型別                       | 說明                                                                         |
| -------------- | ----------------------------------------------- | -------------------------- | ---------------------------------------------------------------------------- |
| `Collapse`     | `width`                                         | `number`                   | 面板寬度，必需。                                                             |
| `Collapse`     | `activeKeys` / `defaultActiveKeys`              | `string[]`                 | 受控展開項 / 非受控初始展開項。                                              |
| `Collapse`     | `accordion`                                     | `boolean`                  | 預設 `false`；為 `true` 時單項展開。                                         |
| `Collapse`     | `headerHeight`                                  | `number`                   | 標題列高度，預設 `40`。                                                      |
| `Collapse`     | `backgroundColor` / `textColor` / `borderColor` | `string`                   | 所有標題列的預設背景、文字和邊框顏色。                                       |
| `Collapse`     | `onChange`                                      | `(keys: string[]) => void` | 展開項變化回呼。                                                             |
| `CollapseItem` | `id` / `title`                                  | `string`                   | 面板唯一識別碼和標題，必需。                                                 |
| `CollapseItem` | `height`                                        | `number`                   | 展開內容高度。預設依子節點所需空間計算，且不低於 `100`；顯式指定時始終生效。 |
| `CollapseItem` | `disabled`                                      | `boolean`                  | 禁止展開/摺疊。                                                              |
| `CollapseItem` | `backgroundColor` / `textColor` / `borderColor` | `string`                   | 覆蓋該項標題列的顏色。                                                       |

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

Angular 對應 `<canvas-collapse>` 和 `<canvas-collapse-item>`，展開項變化使用 `(activeKeysChange)`。

### `<Dialog>`

確認對話框預設置中覆蓋 Canvas，並繪製遮罩、標題、內容區及內建取消/確認按鈕。可在內容區放入任意 Canvas UI 元件。對話框開啟時在内的 Input/Textarea 暫不可輸入，以避免遮罩觸碰穿透。

| 屬性                         | 型別           |              預設值 | 說明                                      |
| ---------------------------- | -------------- | ------------------: | ----------------------------------------- |
| `open`                       | `boolean`      |                必需 | 是否顯示對話框。                          |
| `width` / `height`           | `number`       |       `420` / `240` | 對話框尺寸。                              |
| `title`                      | `string`       |         `"Confirm"` | 標題。                                    |
| `confirmText` / `cancelText` | `string`       | `"OK"` / `"Cancel"` | 內建按鈕文字。                            |
| `closeOnBackdrop`            | `boolean`      |              `true` | 點擊遮罩是否觸發取消回呼。                |
| `onConfirm` / `onCancel`     | `() => void`   |                   — | 確認和取消回呼。                          |
| 子元件                       | Canvas UI 元件 |                   — | 對話框內容區，可放置任意 Canvas UI 元件。 |

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

Angular 使用 `<canvas-dialog>`，對應 `open` 輸入及 `(confirm)` / `(cancel)` 輸出。

### `<Rect>`

繪製矩形。支援[通用屬性](#通用屬性)。

| 屬性          | 型別     |          預設值 | 說明                         |
| ------------- | -------- | --------------: | ---------------------------- |
| `width`       | `number` |           `100` | 寬度。                       |
| `height`      | `number` |            `40` | 高度。                       |
| `color`       | `string` | `"transparent"` | 填充顏色。                   |
| `radius`      | `number` |             `0` | 圓角半徑。                   |
| `stroke`      | `string` |               — | 描邊顏色；不傳時不繪製描邊。 |
| `strokeWidth` | `number` |             `1` | 描邊寬度。                   |

### `<Circle>`

繪製圓形。支援[通用屬性](#通用屬性)。

| 屬性          | 型別     |      預設值 | 說明                         |
| ------------- | -------- | ----------: | ---------------------------- |
| `radius`      | `number` |        `10` | 圓形半徑。                   |
| `color`       | `string` | `"#e74c3c"` | 填充顏色。                   |
| `stroke`      | `string` |           — | 描邊顏色；不傳時不繪製描邊。 |
| `strokeWidth` | `number` |         `1` | 描邊寬度。                   |

### `<Text>`

繪製單行或自動換行文字。節點會報告排版後各行的實際佔用尺寸，`<CollapseItem>` 等容器可據此自適應高度。支援[通用屬性](#通用屬性)。

| 屬性         | 型別                            |         預設值 | 說明                                                                                                                 |
| ------------ | ------------------------------- | -------------: | -------------------------------------------------------------------------------------------------------------------- |
| `text`       | `string`                        |              — | 文字內容。                                                                                                           |
| 子內容       | `string \| number`              |              — | 各框架可用對應的範本文字代替 `text`。                                                                                |
| `fontSize`   | `number`                        |           `16` | 字級，單位為邏輯像素。                                                                                               |
| `width`      | `number`                        |              — | 最大行寬；超出後自動換行。中文等寬字元也會依測量寬度換行。在 `<Grid>` 內未宣告時取儲存格寬度。                       |
| `maxLines`   | `number`                        |              — | 最大顯示行數；最後一行超出部分以省略符號截斷。在 `<Grid>` 內未宣告時依儲存格能容納的行數取值；兩者都未給出時不限制。 |
| `fontFamily` | `string`                        | `"sans-serif"` | 字體族。                                                                                                             |
| `color`      | `string`                        |       `"#333"` | 字型顏色。                                                                                                           |
| `baseline`   | `CanvasTextBaseline`            |        `"top"` | Canvas 文字基線。                                                                                                    |
| `textAlign`  | `"left" \| "center" \| "right"` |       `"left"` | 文字水平對齊方式；設定 `width` 時相對於文字區域對齊。                                                                |

### `<Icon>`

原創通用向量圖示，不依賴圖示字型或外部圖片。支援[通用屬性](#通用屬性)。

| 屬性          | 型別                   |      預設值 | 說明                                                       |
| ------------- | ---------------------- | ----------: | ---------------------------------------------------------- |
| `name`        | `IconName`             |        必需 | 圖示名稱，見下方名稱清單。                                 |
| `size`        | `number`               |        `24` | 圖示寬高。                                                 |
| `color`       | `string`               |    `"#333"` | 圖示顏色；可透過 `--canvas-ui-icon-color` 設定主題預設色。 |
| `variant`     | `"outline" \| "solid"` | `"outline"` | `outline` 為線框；`solid` 使用粗線並填充主要圖形。         |
| `strokeWidth` | `number`               |         `2` | 線框線寬；實底風格使用至少 `4` 的線寬。                    |

支援 `home`、`house`、`building`、`apartment`、`store`、`mapPin`、`map`、`globe`、`compass`、`navigation`、`flag`、`mountain`、`tree`、`leaf`、`flower`、`sun`、`moon`、`cloud`、`rain`、`snow`、`fire`、`water`、`wind`、`car`、`bus`、`train`、`plane`、`bicycle`、`ship`、`rocket`、`truck`、`walk`、`phone`、`message`、`mail`、`bell`、`calendar`、`clock`、`alarm`、`camera`、`image`、`video`、`music`、`microphone`、`headphones`、`play`、`pause`、`stop`、`record`、`volume`、`wifi`、`bluetooth`、`battery`、`signal`、`power`、`monitor`、`laptop`、`tablet`、`keyboard`、`mouse`、`printer`、`folder`、`file`、`document`、`download`、`upload`、`share`、`link`、`search`、`settings`、`sliders`、`menu`、`close`、`check`、`plus`、`minus`、`edit`、`trash`、`copy`、`save`、`lock`、`unlock`、`key`、`user`、`users`、`heart`、`star`、`bookmark`、`cart`、`bag`、`gift`、`creditCard`、`wallet`、`chart`、`pieChart`、`barChart`、`analytics`、`shield`、`warning`、`info`、`help`、`question`、`tag`、`puzzle`、`code`、`database` 和 `cloudDownload`。

```tsx
<Icon name="search" x={16} y={16} size={28} color="#1677ff" />
<Icon name="heart" x={56} y={16} variant="solid" color="#e74c3c" />
```

### `<Input>`

單行輸入框。控制項外觀繪製在 Canvas 上，透明 HTML input 負責鍵盤、輸入法和選取範圍。

| 屬性               | 型別                               |         預設值 | 說明                                       |
| ------------------ | ---------------------------------- | -------------: | ------------------------------------------ |
| `width` / `height` | `number`                           |   `200` / `36` | 控制項寬高。                               |
| `value`            | `string`                           |              — | 受控輸入值；使用時應搭配 `onChange` 更新。 |
| `defaultValue`     | `string`                           |           `""` | 非受控初始值。                             |
| `placeholder`      | `string`                           |           `""` | 佔位文字。                                 |
| `type`             | `"text" \| "password" \| "number"` |       `"text"` | 輸入類型。密碼內容在 Canvas 上以圓點顯示。 |
| `fontSize`         | `number`                           |           `14` | 字級。                                     |
| `fontFamily`       | `string`                           | `"sans-serif"` | 字體族。                                   |
| `color`            | `string`                           |       `"#333"` | 輸入文字顏色。                             |
| `bgColor`          | `string`                           |       `"#fff"` | 背景顏色。                                 |
| `borderColor`      | `string`                           |       `"#ccc"` | 一般邊框顏色。                             |
| `focusBorderColor` | `string`                           |    `"#3498db"` | 聚焦時邊框顏色。                           |
| `borderRadius`     | `number`                           |            `4` | 圓角半徑。                                 |
| `padding`          | `number`                           |            `8` | 文字內邊距。                               |
| `disabled`         | `boolean`                          |        `false` | 停用輸入。                                 |
| `maxLength`        | `number`                           |              — | 最大字元數；非負整數有效。                 |
| `onChange`         | `(value: string) => void`          |              — | 輸入變化回呼。                             |
| `onFocus`          | `() => void`                       |              — | 獲得焦點回呼。                             |
| `onBlur`           | `() => void`                       |              — | 失去焦點回呼。                             |

### `<Textarea>`

多行文字框，繼承 `<Input>` 的值、尺寸、樣式和回呼屬性；超出固定高度時可在文字框內捲動並顯示捲軸；不支援 `type`。額外屬性：

| 屬性   | 型別     | 說明                                               |
| ------ | -------- | -------------------------------------------------- |
| `rows` | `number` | 可用於表達期望行數；當前繪製高度由 `height` 控制。 |

```tsx
<Textarea width={300} height={120} value={notes} placeholder="輸入多行內容" onChange={setNotes} />
```

### `<Upload>`

繪製檔案選擇按鈕，內建向量圖示與文字會作為一個群組水平置中。點擊後開啟瀏覽器本地檔案選擇器；此元件不負責上傳到伺服器。

| 屬性               | 型別                      |           預設值 | 說明                                                              |
| ------------------ | ------------------------- | ---------------: | ----------------------------------------------------------------- |
| `width` / `height` | `number`                  |     `120` / `40` | 按鈕寬高。                                                        |
| `text`             | `string`                  |  `"Choose File"` | 按鈕文字。                                                        |
| `icon`             | `IconName`                |       `"upload"` | 顯示在文字前的內建圖示，可傳 [`<Icon>`](#icon) 中的任意圖示名稱。 |
| `iconSize`         | `number`                  | `fontSize × 1.1` | 圖示尺寸。                                                        |
| `accept`           | `string`                  |                — | 檔案類型篩選，例如 `"image/*,.pdf"`。                             |
| `multiple`         | `boolean`                 |          `false` | 是否允許選擇多個檔案。                                            |
| `disabled`         | `boolean`                 |          `false` | 停用檔案選擇。                                                    |
| `onChange`         | `(files: File[]) => void` |                — | 選擇檔案後回呼；取消選擇時不觸發。                                |

```tsx
<Upload accept="image/*" multiple onChange={(files) => console.log(files)} />
<Upload icon="cloud" text="Upload Photos" />
```

Angular 使用 `<canvas-upload>` 並透過 `(change)` 取得 `File[]`。

### `<Dropdown>`

Canvas 繪製的下拉選單。支援[通用屬性](#通用屬性)。

| 屬性               | 型別                              |        預設值 | 說明                                       |
| ------------------ | --------------------------------- | ------------: | ------------------------------------------ |
| `width` / `height` | `number`                          |  `200` / `36` | 控制項寬高。                               |
| `options`          | `Array<string \| DropdownOption>` |          必需 | 選項清單。字串選項的 label 和 value 相同。 |
| `value`            | `string`                          |             — | 受控選取值。                               |
| `defaultValue`     | `string`                          |             — | 非受控初始值。                             |
| `placeholder`      | `string`                          | `"Select..."` | 未選擇時顯示的文字。                       |
| `disabled`         | `boolean`                         |       `false` | 停用互動。                                 |
| `fontSize`         | `number`                          |          `14` | 字級。                                     |
| `color`            | `string`                          |      `"#333"` | 文字顏色。                                 |
| `bgColor`          | `string`                          |      `"#fff"` | 控制項背景色。                             |
| `borderColor`      | `string`                          |   `"#c7ccd3"` | 一般邊框顏色。                             |
| `focusBorderColor` | `string`                          |   `"#3478f6"` | 展開時邊框顏色。                           |
| `borderRadius`     | `number`                          |           `4` | 圓角半徑。                                 |
| `onChange`         | `(value: string) => void`         |             — | 選擇變化回呼。                             |

`DropdownOption` 型別：

| 屬性       | 型別      | 說明             |
| ---------- | --------- | ---------------- |
| `label`    | `string`  | 顯示文字。       |
| `value`    | `string`  | 選項值。         |
| `disabled` | `boolean` | 是否停用該選項。 |

```tsx
<Dropdown
    value={role}
    options={['Admin', { label: '唯讀使用者', value: 'reader', disabled: false }]}
    onChange={setRole}
/>
```

### `<DatePicker>`

Canvas 繪製日期輸入框，點擊後使用瀏覽器原生日期選擇器。

| 屬性               | 型別                      |          預設值 | 說明                              |
| ------------------ | ------------------------- | --------------: | --------------------------------- |
| `width` / `height` | `number`                  |    `200` / `36` | 控制項寬高。                      |
| `value`            | `string`                  |               — | 受控日期值，格式為 `YYYY-MM-DD`。 |
| `defaultValue`     | `string`                  |            `""` | 非受控初始日期值。                |
| `placeholder`      | `string`                  | `"Select date"` | 未選擇時顯示的文字。              |
| `disabled`         | `boolean`                 |         `false` | 停用日期選擇。                    |
| `onChange`         | `(value: string) => void` |               — | 日期變化回呼。                    |

### `<Radio>` 和 `<Checkbox>`

兩者都接受 `options` 選項陣列；Radio 單選，Checkbox 多選。字串選項的 label 和 value 相同，也可以傳 `{ label, value, disabled }` 物件。

| 屬性               | 型別                                                                    |         預設值 | 說明               |
| ------------------ | ----------------------------------------------------------------------- | -------------: | ------------------ |
| `options`          | `Array<string \| ChoiceOption>`                                         |           必需 | 選項清單。         |
| `value`            | Radio: `string`; Checkbox: `string[]`                                   |              — | 受控選取值。       |
| `defaultValue`     | Radio: `string`; Checkbox: `string[]`                                   |              — | 非受控初始選取值。 |
| `direction`        | `"horizontal" \| "vertical"`                                            | `"horizontal"` | 選項排列方向。     |
| `width` / `height` | `number`                                                                |       自動計算 | 控制項尺寸。       |
| `onChange`         | Radio: `(value: string) => void`; Checkbox: `(value: string[]) => void` |              — | 選取項變化回呼。   |

```tsx
<Radio options={['Small', 'Medium', 'Large']} value={size} onChange={setSize} />
<Checkbox options={['Email', 'SMS']} value={channels} onChange={setChannels} />
```

Angular 分別使用 `<canvas-date-picker>`, `<canvas-radio>` 和 `<canvas-checkbox>`；日期選擇透過 `(valueChange)` 或 `(change)` 監聽，Radio/Checkbox 使用 `(change)`。

### `<Slider>`

拖動滑桿。支援[通用屬性](#通用屬性)。

| 屬性               | 型別                      |       預設值 | 說明                 |
| ------------------ | ------------------------- | -----------: | -------------------- |
| `width` / `height` | `number`                  | `160` / `32` | 滑桿寬高。           |
| `min` / `max`      | `number`                  |  `0` / `100` | 最小值和最大值。     |
| `step`             | `number`                  |          `1` | 每次變化的步長。     |
| `value`            | `number`                  |            — | 受控值。             |
| `defaultValue`     | `number`                  |        `min` | 非受控初始值。       |
| `disabled`         | `boolean`                 |      `false` | 停用拖動。           |
| `trackColor`       | `string`                  |  `"#d7dde5"` | 軌道顏色。           |
| `activeColor`      | `string`                  |  `"#3478f6"` | 已選軌道及描邊顏色。 |
| `thumbColor`       | `string`                  |     `"#fff"` | 滑桿圓點顏色。       |
| `onChange`         | `(value: number) => void` |            — | 值變化回呼。         |

### `<Switch>`

開關控制項。支援[通用屬性](#通用屬性)。

| 屬性               | 型別                         |      預設值 | 說明               |
| ------------------ | ---------------------------- | ----------: | ------------------ |
| `width` / `height` | `number`                     | `44` / `24` | 開關寬高。         |
| `checked`          | `boolean`                    |           — | 受控開關狀態。     |
| `defaultChecked`   | `boolean`                    |     `false` | 非受控初始狀態。   |
| `disabled`         | `boolean`                    |     `false` | 禁止切換。         |
| `onColor`          | `string`                     | `"#3478f6"` | 開啟時的軌道顏色。 |
| `offColor`         | `string`                     | `"#c7ccd3"` | 關閉時的軌道顏色。 |
| `thumbColor`       | `string`                     |    `"#fff"` | 滑塊顏色。         |
| `onChange`         | `(checked: boolean) => void` |           — | 狀態變化回呼。     |

### `<Button>`

Canvas 繪製按鈕。支援[通用屬性](#通用屬性)。

| 屬性               | 型別               |       預設值 | 說明                                    |
| ------------------ | ------------------ | -----------: | --------------------------------------- |
| `width` / `height` | `number`           | `120` / `40` | 按鈕寬高。                              |
| 子內容             | `string \| number` |            — | 按鈕文字，可用 `text` 替代。            |
| `text`             | `string`           |            — | 按鈕文字；同時提供時優先於 `children`。 |
| `fontSize`         | `number`           |         `15` | 字級。                                  |
| `fontColor`        | `string`           |     `"#fff"` | 文字顏色。                              |
| `backgroundColor`  | `string`           |  `"#3478f6"` | 背景顏色。                              |
| `borderColor`      | `string`           |            — | 描邊顏色。                              |
| `borderRadius`     | `number`           |          `6` | 圓角半徑。                              |
| `disabled`         | `boolean`          |      `false` | 停用按鈕。                              |
| `onClick`          | `() => void`       |            — | 按鈕點擊回呼。                          |

## 圖片匯出

透過 `CanvasHandle` 提供的 `ref` 匯出圖像：

```tsx
const canvasRef = useRef<CanvasHandle>(null);

// PNG Data URL，適合直接設定到 img.src
const dataUrl = canvasRef.current?.toDataURL({
    type: 'image/png',
    width: 840,
    height: 600,
    pixelRatio: 2,
});

// JPEG Blob，可建立下載連結或上傳
const blob = await canvasRef.current?.toBlob({
    type: 'image/jpeg',
    quality: 0.9,
    pixelRatio: 2,
});

// 取得底層 HTMLCanvasElement
const canvasElement = canvasRef.current?.getCanvas();
```

`CanvasExportOptions` 參數：

| 屬性         | 型別     |               預設值 | 說明                                                                                       |
| ------------ | -------- | -------------------: | ------------------------------------------------------------------------------------------ |
| `width`      | `number` | 目前 Canvas 邏輯寬度 | 匯出圖邏輯寬度。                                                                           |
| `height`     | `number` | 目前 Canvas 邏輯高度 | 匯出圖邏輯高度。                                                                           |
| `pixelRatio` | `number` |      Canvas 的像素比 | 輸出像素密度；最終點陣圖尺寸約為 `width × pixelRatio` 乘 `height × pixelRatio`。           |
| `type`       | `string` |        `"image/png"` | 圖片 MIME 類型，如 `image/png`、`image/jpeg`、`image/webp`。瀏覽器不支援的格式會退回 PNG。 |
| `quality`    | `number` |         瀏覽器預設值 | 有損格式的品質，範圍 `0` 到 `1`；PNG 通常不使用此參數。                                    |

相容簡寫呼叫：

```tsx
canvasRef.current?.toDataURL('image/png');
const jpegBlob = await canvasRef.current?.toBlob('image/jpeg', 0.9);
```

匯出尺寸和像素比必須為正數。若場景使用的跨網域圖片未獲圖片伺服器 CORS 授權，`toDataURL()` 會丟出帶有原因說明的錯誤，`toBlob()` 會以同樣的錯誤拒絕 Promise。請設定圖片伺服器傳回允許目前站點 `Access-Control-Allow-Origin` 響應標頭，或移除該圖片後再匯出。

## 檔案結構

| 檔案                  | 用途                                                                          |
| --------------------- | ----------------------------------------------------------------------------- |
| `react/`              | React 元件和 Canvas 容器介面卡。                                              |
| `vue/`                | Vue 3 元件和 Canvas 容器介面卡。                                              |
| `svelte/`             | Svelte 5+ 元件介面卡和範本元件。                                              |
| `angular/`            | Angular standalone Canvas 元件和場景指令。                                    |
| `components/`         | 共用元件實作；每個元件有獨立目錄、入口和 Props/繪製檔案，需要時另含互動邏輯。 |
| `components/index.ts` | 元件統一匯出及子樹編譯。                                                      |
| `components/types.ts` | 匯總所有公開元件 Props 型別。                                                 |
| `theme.css`           | Canvas 元件的淺色/深色 CSS 主題變數。                                         |
| `types.ts`            | 元件 Props 匯總、場景節點和輸入橋接型別。                                     |
| `engine.ts`           | 場景同步、輸入橋接、命中測試和控制互動。                                      |
| `renderer.ts`         | 場景遍歷及 Canvas 繪製排程。                                                  |
| `input-bridge.ts`     | Input/Textarea 的透明 HTML 輸入橋接。                                         |
| `types.ts`            | 場景、Canvas 和橋接相關型別。                                                 |

只需修改元件外觀時，優先編輯對應的 `components/<Component>/<component>.ts` 繪製函式；元件專屬互動邏輯放在同目錄的 `logic.ts`。修改通用佈局、事件、匯出行為時再編輯對應介面卡、`engine.ts` 或 `renderer.ts`。
