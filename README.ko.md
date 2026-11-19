![Markdown Logo](./src/assets/web-canvas-ui-logo-bright.svg "web-canvas-ui")
# Web Canvas UI (React, Vue 3, Svelte, Angular)

[English](./README.md) · [日本語](./README.ja.md) · [한국어](./README.ko.md) · [繁體中文](./README.zh-TW.md) · [Русский](./README.ru.md) · [简体中文](./README.zh-CN.md)

Canvas 2D 기반 선언형 컴포넌트 라이브러리로 **React**, **Vue 3**, **Svelte 5+**, **Angular 17+** 어댑터를 제공합니다. 각 프레임워크는 독립된 entry에서 import하고 네이티브 컴포넌트/템플릿 문법을 사용하며, 하위의 Canvas engine과 컨트롤 렌더링 로직은 공통으로 재사용됩니다. 모든 컨트롤의 외형은 Canvas가 직접 그립니다.

> **어댑터 안내:** React, Vue, Svelte, Angular는 각각 `/canvas-ui/react`, `/canvas-ui/vue`, `/canvas-ui/svelte`, `/canvas-ui/angular`에서 import합니다. 호스트 Canvas 프레임워크에 맞는 entry를 선택하고, 어댑터 간 컴포넌트를 섞어 쓰지 마세요. 모든 entry가 동일한 engine과 렌더링 구현을 재사용합니다.

> **컴포넌트 계약:** 각 컨트롤은 `components/<Component>/` 아래에 위치합니다. `index.ts` entry가 공용 API를 export하고, `<component>.ts`가 Props 타입과 Canvas 렌더 함수를 정의하며, 필요 시 `logic.ts`에 해당 컨트롤 전용 인터랙션/비즈니스 로직을 둡니다. 공용 타입은 `components/types.ts`에 모이고 `/canvas-ui/types.ts`로 재export됩니다. React, Vue, Svelte, Angular 어댑터가 이 타입 계약을 공유합니다.

컨트롤을 추가할 때는 전용 디렉터리를 만들고 그 entry에서 공용 API를 export하세요. Props를 추가할 때는 `CanvasComponentProps`와 각 프레임워크 어댑터의 속성 매핑도 함께 동기화해야 합니다.

## 전역 테마 색상

테마 색상은 [`theme.scss`](theme.scss)의 `$primary: #1668dc`에 집중됩니다. 이 변수 하나만 수정해도 버튼, 선택 상태, 포커스 테두리, 진행률 막대 등 강조색이 일괄 갱신됩니다. 밝은 색은 primary와 흰색을 섞어 파생되고, 눌림 상태의 어두운 색은 primary 명도를 낮춰 파생되며, 공용 색상 스케일은 `--canvas-ui-primary*` CSS 변수로도 출력됩니다. `theme.css`는 컴파일 결과물이므로 전역 CSS에서 import하고 생성 파일을 직접 수정하지 마세요:

```css
@import '/canvas-ui/theme.css';
```

`theme.scss`를 수정한 뒤 `npm run build:theme`를 실행해 CSS를 재생성합니다. 컴파일된 CSS 커스텀 프로퍼티는 React, Vue, Svelte, Angular에 동일하게 적용되며 `.dark`와 `[data-theme="dark"]` 다크 테마도 제공합니다. 컴포넌트에 명시적으로 전달한 색상이 테마 변수보다 우선합니다.

기본 제공되는 primary 팔레트는 파랑, 초록, 보라, 주황, 빨강 다섯 가지이며, Canvas 외곽 컨테이너에 해당 class를 추가해 전환합니다. 다크 테마와 조합할 수도 있습니다:

```tsx
<div className="theme-green">
    <Canvas width={400} height={240}>
        <Button>Green theme</Button>
    </Canvas>
</div>
```

| 팔레트     | class          | Primary   |
| ---------- | -------------- | --------- |
| 파랑(기본) | `theme-blue`   | `#1668dc` |
| 초록       | `theme-green`  | `#389e0d` |
| 보라       | `theme-purple` | `#722ed1` |
| 주황       | `theme-orange` | `#d46b08` |
| 빨강       | `theme-red`    | `#cf1322` |

예를 들어 `dark`와 `theme-purple`을 함께 추가하거나, `data-theme="dark"`와 `theme-purple`을 조합하면 보라 다크 테마가 적용됩니다. 모든 팔레트에서 밝은/눌림/어두운 강조색은 대응 primary로부터 Sass로 파생됩니다.

| 컴포넌트                      | CSS 커스텀 프로퍼티                                                                                                                                                                                                                                                                                  |
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

앱별 테마를 커스터마이즈하려면 자체 CSS에서 필요한 변수만 덮어쓰면 됩니다. 예: `.brand { --canvas-ui-button-background: #6d4aff; }`. 위 표는 각 컴포넌트가 실제로 읽는 테마 변수를 정리한 것입니다.

## 환경 및 import

`/canvas-ui/` 디렉터리를 프로젝트에 배치하고 호스트 Canvas 프로젝트가 선택한 프레임워크(React 19+, Vue 3, Svelte 5+, Angular 17+)에 맞게 설정되어 있는지 확인하세요. Vue는 SFC 템플릿을 사용하므로 JSX 플러그인이나 `jsxImportSource` 설정이 필요 없습니다. Svelte 프로젝트에는 Svelte 컴파일러와 대응 빌드 플러그인이 필요합니다. Angular 프로젝트에는 `@angular/core`와 Angular 빌드 설정이 필요합니다. 프레임워크 의존성은 호스트 Canvas 프로젝트가 제공하며, 이 디렉터리는 다른 프레임워크의 의존성을 강제하지 않습니다.

| 프레임워크  | Entry                |
| ----------- | -------------------- |
| React       | `/canvas-ui/react`   |
| Vue 3       | `/canvas-ui/vue`     |
| Svelte 5+   | `/canvas-ui/svelte`  |
| Angular 17+ | `/canvas-ui/angular` |

컴포넌트는 반드시 대응 어댑터의 Canvas 컨테이너 내부에 배치하고, 해당 프레임워크 entry가 export하는 scene 컴포넌트를 사용해야 합니다. Canvas scene 안에 일반 DOM 요소를 넣지 마세요.

## 빠른 시작 (React)

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
                        Export Image
                    </Button>
                </Group>
            </Canvas>
        </section>
    );
}
```

`x`, `y`는 부모 기준 상대 위치이며 단위는 Canvas logical pixel입니다. `Group`은 중첩할 수 있고, 자식 컴포넌트의 좌표는 부모의 위치/스케일/회전을 누적합니다.

## 빠른 시작 (Vue 3 SFC)

Vue 어댑터는 독립된 `/canvas-ui/vue` entry에 위치합니다. `.vue` 파일의 template에서 Canvas UI 컴포넌트를 그대로 중첩하면 됩니다. TSX, JSX 플러그인, Canvas 노드 배열을 직접 구성할 필요가 없습니다:

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
                Export Image
            </Button>
        </Group>
    </Canvas>
</template>
```

Vue template에서는 `:value`로 reactive 상태를 바인딩하고 `@change`로 갱신합니다. Canvas 컴포넌트는 Vue 업데이트 이후 scene을 동기화합니다.

## 빠른 시작 (Svelte 5+)

Svelte 5 템플릿에서 Svelte entry가 export하는 컴포넌트를 사용합니다. `Canvas`는 `bind:this`로 메서드에 접근할 수 있습니다:

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

Svelte 컨트롤의 props가 변경되면 Canvas scene에 동기화됩니다;

## 빠른 시작 (Angular 17+)

Angular entry는 standalone `Canvas` 컴포넌트와 scene 디렉터리를 제공합니다. 이를 사용하는 standalone 컴포넌트에서 필요한 심볼을 import하세요:

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

Angular는 `<canvas-...>` 디렉터리 셀렉터로 Canvas scene 노드를 선언합니다. 입력·드롭다운·슬라이더는 `(valueChange)`, 스위치는 `(checkedChange)`, 버튼은 `(click)`을 사용합니다.

인터랙션 속성은 각 프레임워크의 관례를 따릅니다: React는 `onChange`/`onClick` props, Vue는 `@change`/`@click`, Svelte는 `onChange`/`onClick` callback props, Angular는 `(valueChange)`, `(checkedChange)`, `(click)` output binding을 사용합니다.

## 공통 속성

`<Canvas>`를 제외한 모든 시각 컴포넌트는 아래 transform 속성을 지원합니다:

| 속성       | 타입      | 기본값 | 설명                                                                                  |
| ---------- | --------- | -----: | ------------------------------------------------------------------------------------- |
| `x`        | `number`  |    `0` | 부모 기준 수평 상대 위치.                                                             |
| `y`        | `number`  |    `0` | 부모 기준 수직 상대 위치.                                                             |
| `rotation` | `number`  |    `0` | 회전(라디안).                                                                         |
| `scaleX`   | `number`  |    `1` | 수평 transform scale.                                                                 |
| `scaleY`   | `number`  |    `1` | 수직 transform scale.                                                                 |
| `visible`  | `boolean` | `true` | 렌더 여부. `false`로 설정하면 자식 컴포넌트도 함께 숨겨지고 클릭에 반응하지 않습니다. |

### 크기 규칙

- `Rect`, `Input`, `Textarea`, `Upload`, `Dropdown`, `DatePicker`, `Slider`, `Switch`, `Button`은 `width`와 `height`로 크기를 지정합니다.
- `Circle`은 `radius`(기본 `10`)로 반지름을 지정하며, 지름은 반지름의 두 배입니다.
- `Text`는 `fontSize`로 폰트 크기, `width`로 줄바꿈 폭을 지정합니다.
- `width`/`height` 미지정 시 각 컴포넌트 문서에 명시된 기본값을 사용합니다. `Group`은 컨테이너라 자체 너비·높이가 없으며, `Grid`는 열 수와 cell prop에 따라 레이아웃됩니다.
- `Grid`는 자식을 순서대로 자동 배치하며, `columns`, `cellHeight`, 선택적으로 `gap`을 지정합니다. cell 폭은 `cellWidth`로 고정하거나 `width`로 균등 분배할 수 있습니다. 직접 자식은 기본적으로 1개 cell을 차지하며, `GridItem`을 사용하면 여러 컨트롤을 하나의 grid 항목으로 묶어 열/행 span을 지정할 수 있습니다. 그룹 내부 자식의 크기는 여전히 각자의 prop으로 결정됩니다.

## 컴포넌트 Props

### `<Canvas>`

Canvas scene을 생성합니다. 크기는 logical pixel 기준이며, 실제 bitmap에는 pixel ratio가 곱해집니다.

| 속성                                             | 타입                                                                             |   필수 |                                                 기본값 | 설명                                                                                                                       |
| ------------------------------------------------ | -------------------------------------------------------------------------------- | -----: | -----------------------------------------------------: | -------------------------------------------------------------------------------------------------------------------------- |
| `width`                                          | `number`                                                                         |     예 |                                                      — | Canvas logical 너비.                                                                                                       |
| `height`                                         | `number`                                                                         |     예 |                                                      — | Canvas logical 높이.                                                                                                       |
| Pixel ratio                                      | 자동                                                                             |      — | `window.devicePixelRatio` 자동(최소 `1`); prop 불필요. | Canvas 렌더링 해상도 배율.                                                                                                 |
| `className`(React/Angular) / `class`(Vue/Svelte) | `string`                                                                         | 아니오 |                                                      — | 외곽 컨테이너 CSS class.                                                                                                   |
| `style`                                          | 프레임워크별 style object 또는 string                                            | 아니오 |                                                      — | 외곽 컨테이너 style. 컨테이너의 `position`, `width`, `height`는 컴포넌트가 설정합니다.                                     |
| `ariaLabel`                                      | `string`                                                                         | 아니오 |                                             `"Canvas"` | Canvas 접근성 라벨.                                                                                                        |
| `onFrame`                                        | `(time: number) => void`                                                         | 아니오 |                                                      — | 프레임별 callback. `time`은 브라우저 animation frame timestamp입니다.                                                      |
| `onEvent`                                        | `(event: CanvasUIEvent) => void`                                                 | 아니오 |                                                      — | Canvas 통합 이벤트 entry point. `pointerdown`, `pointermove`, `pointerup`, `pointercancel`, `click`, `wheel`을 수신합니다. |
| Children                                         | React children / Vue default slot / Svelte children / Angular content projection | 아니오 |                                                      — | Canvas UI 컴포넌트 트리.                                                                                                   |

`onEvent` 이벤트에는 Canvas logical 좌표 `x`/`y`, hit된 `target`(컴포넌트의 `type`과 사용자 `key`; 빈 영역은 `null`), hit된 컴포넌트 local 좌표 `localX`/`localY`가 포함됩니다. `wheel`은 추가적으로 `deltaY`를, pointer 이벤트는 `pointerId`를 노출합니다. 통합 `click`은 동일한 대상에서 눌림·놓기가 이루어지고 이동 거리가 8 logical pixel 이하일 때만 1회 발생합니다. 드래그나 취소로는 발생하지 않습니다. 각 컴포넌트의 기존 `onClick`, `onChange` 등은 평소대로 실행되며, `onEvent`는 컴포넌트 간 비즈니스 로직이나 통합 분석에 적합합니다.

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

React ref, Vue template ref, Svelte `bind:this`, Angular template reference로 스크린샷 API에 접근할 수 있습니다. 자세한 내용은 [이미지 내보내기](#이미지-내보내기)를 참고하세요. `CanvasHandle`은 `requestRender()`도 제공하여, source Canvas가 갱신된 뒤 호스트 Canvas의 재생성을 요청할 수 있습니다.

### `<CanvasView>`

서드파티 또는 동일 페이지의 다른 모듈이 만든 `HTMLCanvasElement`의 화면을 현재 Canvas에 렌더링합니다. 픽처 화면만 임베드되며, source Canvas의 DOM이나 이벤트 핸들러는 현재 Canvas로 가져오지 않습니다.

| 속성               | 타입                                      |   필수 |      기본값 | 설명                                                                                                                                                    |
| ------------------ | ----------------------------------------- | -----: | ----------: | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`           | `HTMLCanvasElement`                       |     예 |           — | 표시할 source Canvas instance.                                                                                                                          |
| `width` / `height` | `number`                                  |     예 |           — | 현재 Canvas에서 차지하는 logical 크기.                                                                                                                  |
| `fit`              | `'contain' \| 'cover' \| 'fill'`          | 아니오 | `'contain'` | 비율 유지 후 모두 표시, 비율 유지 후 crop 채움, 또는 늘어나게 표시.                                                                                     |
| `onPointerEvent`   | `(event: CanvasViewPointerEvent) => void` | 아니오 |           — | 매핑된 `pointerdown`, `pointermove`, `pointerup`, `pointercancel`, `click` 이벤트 제공. source Canvas로 composite event를 자동 dispatch하지는 않습니다. |

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

// 서드파티 Canvas가 화면을 갱신한 뒤 호스트 Canvas에 재생성을 요청:
canvasRef.current?.requestRender();
```

이벤트에는 `x`/`y`(CanvasView local logical 좌표), `sourceX`/`sourceY`(source Canvas bitmap pixel 좌표), source canvas 크기, 버튼 상태, `pointerId`, `pointerType`, `pressure`, `isPrimary`가 포함됩니다. `contain`의 여백 영역은 hit되지 않습니다. 드래그 중 포인터가 잠깐 범위를 벗어나더라도 source canvas 좌표를 보고합니다. 이 데이터를 사용해 서드파티 라이브러리의 인터랙션 API를 호출할 수 있습니다. source Canvas는 content 변경을 호스트 Canvas에 자동 통보하지 않으므로, source를 갱신한 뒤 호스트 Canvas의 `requestRender()`를 호출하거나 animation frame에서 갱신 후 호출하면 됩니다. source Canvas에 CORS 승인을 받지 못한 이미지가 있으면 호스트 Canvas가 오염되고 export도 실패합니다. Canvas의 cross-origin 제한은 이 컴포넌트로 우회할 수 없습니다.

### `<CustomDraw>`

내장 컴포넌트로 렌더 요구를 충족할 수 없을 때 `CustomDraw`로 Canvas 2D 렌더 callback을 제공합니다. scene 재생성 시(이미지 export 포함) 매번 실행되며, callback의 원점은 컴포넌트 좌상단이고 공통 위치/회전/scale 속성을 사용할 수 있습니다.

| 속성               | 타입                                                                                   |   필수 | 설명                                                                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------- | -----: | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `width` / `height` | `number`                                                                               |     예 | custom 렌더 영역의 크기. 음이 아닌 유한 number.                                                                                                   |
| `draw`             | `(context: CanvasRenderingContext2D, size: { width: number; height: number }) => void` |     예 | 영역 안에서 동기 렌더 실행. `size`에 width/height 제공.                                                                                           |
| `onClick`          | `(event: CustomDrawClickEvent) => void`                                                | 아니오 | 클릭 callback. `x`/`y`는 컴포넌트 local 좌표, `canvasX`/`canvasY`는 Canvas logical 좌표이며 크기와 `pointerId`도 제공됩니다.                      |
| `hitTest`          | `(x: number, y: number, size: CustomDrawSize) => boolean`                              | 아니오 | shape용 custom hit test. 미지정 시 width/height의 전 영역 rectangle을 사용. `false`를 반환하면 아래 레이어 컴포넌트의 hit test를 계속 진행합니다. |

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

호출마다 Canvas 렌더 state가 격리되어 callback에서 설정한 색상·선 굵기·transform 등이 다른 컴포넌트로 새지 않습니다. callback에서는 렌더만 수행하고 UI state 갱신이나 side effect는 피하세요. 렌더 중 오류는 그대로 throw됩니다.

### `<Group>`

자식 컴포넌트의 그룹핑·배치·transform에 사용합니다. [공통 속성](#공통-속성) 외에:

| 속성     | 타입                                                          | 설명                     |
| -------- | ------------------------------------------------------------- | ------------------------ |
| Children | React children / Vue·Svelte slot / Angular content projection | 자식 Canvas UI 컴포넌트. |

```tsx
<Group x={20} y={30} scaleX={1.2}>
    <Text x={10} y={10}>
        Group 안 텍스트
    </Text>
</Group>
```

### `<Grid>`

자식을 순서대로 고정 크기 cell에 배치하며, 지정 열 수를 채우면 다음 행으로 넘어갑니다. `Grid`는 background를 그리지 않는 레이아웃 컨테이너로 `Group`처럼 transform 속성을 사용할 수 있습니다.

| 속성         | 타입                          |   필수 | 기본값 | 설명                                                                                                                                             |
| ------------ | ----------------------------- | -----: | -----: | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `columns`    | `number`                      |     예 |      — | 한 행의 열 수. 양의 정수.                                                                                                                        |
| `width`      | `number`                      | 아니오 |      — | Grid 전체 너비. `cellWidth` 미지정 시 필수. column 사이 gap을 제외한 나머지를 균등 분배합니다. `cellWidth` 지정 시 열 수로 계산되므로 생략 가능. |
| `height`     | `number`                      | 아니오 |      — | 고정 표시 높이. 넘치는 영역은 clip되고 scrollbar가 표시됩니다. Grid 안에서 wheel scroll 가능.                                                    |
| `cellWidth`  | `number`                      | 아니오 |      — | cell logical 너비 고정. 지정 시 `width` 균등 분배보다 우선. 양수.                                                                                |
| `cellHeight` | `number`                      |     예 |      — | cell logical 높이. 양수.                                                                                                                         |
| `gap`        | `number`                      | 아니오 |    `0` | 행·열 공통 gap. 음수 불가.                                                                                                                       |
| `onScroll`   | `(scrollTop: number) => void` | 아니오 |      — | scroll 위치 변경 callback. 단위: logical pixel.                                                                                                  |

직접 자식은 자신의 `x`, `y`를 유지하고 배치된 cell의 offset이 더해집니다. `cellWidth` 미지정 시 `(width - gap * (columns - 1)) / columns`로 균등 폭을 계산합니다. 자식의 크기는 자동으로 늘어나지 않습니다.

각 자식에는 점유하는 cell의 박스도 전달됩니다. `width`와 `maxLines`를 지정하지 않은 `<Text>`는 cell 폭으로 줄바꿈하고 `cellHeight`에 넘치는 마지막 줄을 줄임표로 잘라냅니다. `<GridItem>`은 span 후의 영역을 내부 컨트롤에 전달합니다. 값을 직접 지정하면 cell 박스보다 항상 우선하므로 cell보다 의도적으로 좁게 둘 수 있습니다.

```tsx
<Grid columns={3} cellWidth={100} cellHeight={50} gap={8}>
    <Rect width={80} height={40} color="#f5f8fc" />
    <Rect width={80} height={40} color="#e5efff" />
    <Rect width={80} height={40} color="#d5e5ff" />
</Grid>
```

전체 너비를 균등 분배하려면 `cellWidth`를 생략하세요:

```tsx
<Grid columns={3} width={316} cellHeight={50} gap={8}>
    <Rect width={80} height={40} color="#f5f8fc" />
    <Rect width={80} height={40} color="#e5efff" />
    <Rect width={80} height={40} color="#d5e5ff" />
</Grid>
```

Vue, Svelte는 동일한 prop 이름을 사용하며, Angular는 `<canvas-grid [columns]="3" [width]="316" [cellHeight]="50" [gap]="8">`를 사용하고 대응 module에서 `Grid`를 import합니다.

`Grid`에 `height`를 지정하면 내용이 viewport를 넘칠 때 wheel로 스크롤할 수 있고, 자식은 고정 높이 내부로 clip됩니다:

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

`GridItem`은 Grid 내부의 group/layout 노드로 자체 렌더는 하지 않습니다. 여러 컨트롤을 포함해 하나의 grid 항목으로 함께 배치할 수 있으며, 그룹 내 자식은 각자의 크기와 local 좌표를 그대로 사용합니다. `Grid` 아래 일반 컨트롤을 직접 두면 기본적으로 1개 cell을 차지합니다.

| 속성                                         | 타입     | 기본값 | 설명                                                               |
| -------------------------------------------- | -------- | -----: | ------------------------------------------------------------------ |
| `columnSpan`                                 | `number` |    `1` | 차지할 열 수. 양의 정수이며 Grid의 `columns`를 초과할 수 없습니다. |
| `rowSpan`                                    | `number` |    `1` | 차지할 행 수. 양의 정수.                                           |
| `backgroundColor`                            | `string` |      — | grid 항목 배경색. span 범위를 덮습니다.                            |
| `x` / `y`                                    | `number` |    `0` | grid cell 시작점 기준 offset.                                      |
| `rotation` / `scaleX` / `scaleY` / `visible` | —        |      — | `Group`과 동일한 transform 및 가시성 속성.                         |

Grid는 행 우선으로 항목을 배치하며 span으로 점유된 cell은 건너뜁니다:

```tsx
<Grid columns={3} width={316} cellHeight={50} gap={8}>
    <GridItem columnSpan={2}>
        <Rect width={180} height={40} color="#f5f8fc" />
        <Text x={8} y={8}>
            2개 열을 차지하는 그룹
        </Text>
    </GridItem>
    <Rect width={80} height={40} color="#e5efff" />
</Grid>
```

Vue, Svelte는 같은 `<GridItem>`을 사용하며, Angular는 `<canvas-grid-item [columnSpan]="2">...</canvas-grid-item>`를 사용하고 대응 module에서 `GridItem`을 import합니다.

### `<Image>`

`src`에서 이미지를 로드해 Canvas 지정 크기로 렌더링합니다. `objectFit`은 `contain`(기본), `cover`, `fill`, `none`, `scale-down`을 지원합니다. 로드 실패 시 `onError(error)`를 호출합니다. Angular는 error callback에 `(imageError)` event binding을 사용합니다.

| 속성               | 타입                                                       |   필수 | 기본값      | 설명                       |
| ------------------ | ---------------------------------------------------------- | -----: | ----------- | -------------------------- |
| `src`              | `string`                                                   |     예 | —           | 이미지 URL.                |
| `width` / `height` | `number`                                                   |     예 | —           | Canvas logical 크기.       |
| `objectFit`        | `"contain" \| "cover" \| "fill" \| "none" \| "scale-down"` | 아니오 | `"contain"` | 이미지 scale/crop 방식.    |
| `onError`          | `(error: Error) => void`                                   | 아니오 | —           | 이미지 로드 실패 callback. |

```tsx
<Image x={16} y={16} src="/avatar.png" width={96} height={96} objectFit="cover" />
```

remote 이미지는 정상 렌더링되지만, Canvas export에는 브라우저 CORS 규칙이 적용됩니다. 이미지 서버가 cross-origin을 승인하지 않으면 해당 이미지가 포함된 Canvas가 PNG export에 실패할 수 있습니다.

### `<Progress>`

비인터랙티브 진행률 막대를 그립니다. `value`는 `min`~`max` 범위로 clamp됩니다.

| 속성                                 | 타입      |       기본값 | 설명                                      |
| ------------------------------------ | --------- | -----------: | ----------------------------------------- |
| `value`                              | `number`  |         필수 | 현재 진행률 값.                           |
| `min` / `max`                        | `number`  |  `0` / `100` | 진행률 범위.                              |
| `width` / `height`                   | `number`  | `200` / `12` | track 크기.                               |
| `color` / `trackColor` / `textColor` | `string`  |       테마색 | 진행·track·텍스트 색상. 명시 prop이 우선. |
| `borderRadius`                       | `number`  |  높이의 절반 | 모서리 radius.                            |
| `showText`                           | `boolean` |      `false` | track 오른쪽에 백분율 표시 여부.          |

### `<Carousel>` 과 `<CarouselItem>`

`Carousel`은 자식 순서대로 하나의 `CarouselItem`을 보여주며, 자동 재생·순환·좌우 화살표·하단 indicator dot으로 전환할 수 있습니다. 자식 내용은 임의의 Canvas UI 컴포넌트 가능합니다. `activeIndex`를 명시하지 않으면 uncontrolled 모드로, 기본 0번부터 시작합니다.

| 컴포넌트       | 속성                      | 타입                      | 기본값 | 설명                                                        |
| -------------- | ------------------------- | ------------------------- | ------ | ----------------------------------------------------------- |
| `Carousel`     | `width` / `height`        | `number`                  | 필수   | Carousel viewport 크기. 범위를 넘는 내용은 clip됩니다.      |
| `Carousel`     | `activeIndex`             | `number`                  | —      | controlled 현재 index. `onChange`와 조합해 갱신합니다.      |
| `Carousel`     | `defaultActiveIndex`      | `number`                  | `0`    | uncontrolled 초기 index.                                    |
| `Carousel`     | `autoplay`                | `boolean`                 | `true` | 자동 재생 여부. 항목이 2개 미만이면 자동 전환되지 않습니다. |
| `Carousel`     | `interval`                | `number`                  | `3000` | 자동 전환 주기(ms). 최소 `250`ms로 처리됩니다.              |
| `Carousel`     | `transitionDuration`      | `number`                  | `450`  | 가로 slide 전환 시간(ms). `0`이면 즉시 전환.                |
| `Carousel`     | `loop`                    | `boolean`                 | `true` | 마지막에서 처음으로 순환 여부.                              |
| `Carousel`     | `showArrows` / `showDots` | `boolean`                 | `true` | 좌우 화살표·하단 indicator 표시 여부.                       |
| `Carousel`     | `onChange`                | `(index: number) => void` | —      | 현재 index 변경 callback.                                   |
| `CarouselItem` | Children                  | Canvas UI 컴포넌트        | —      | 현재 slide에 표시할 내용.                                   |

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

Angular는 `<canvas-carousel>`과 `<canvas-carousel-item>`을 사용하며, controlled index 변경은 `(activeIndexChange)`를 사용합니다.

### `<Tabs>` 와 `<TabItem>`

`Tabs`는 `TabItem`으로 탭과 대응 Canvas subtree를 선언합니다. 기본적으로 첫 번째 TabItem이 선택됩니다.

| 컴포넌트  | 속성                                                               | 타입                    | 설명                                                                                 |
| --------- | ------------------------------------------------------------------ | ----------------------- | ------------------------------------------------------------------------------------ |
| `Tabs`    | `width` / `height`                                                 | `number`                | 탭 컨테이너 크기. 필수. 콘텐츠는 헤더 아래에 렌더링되며 content 영역으로 clip됩니다. |
| `Tabs`    | `activeKey` / `defaultActiveKey`                                   | `string`                | Controlled 선택 key / uncontrolled 초기 key.                                         |
| `Tabs`    | `headerHeight`                                                     | `number`                | 헤더 바 높이. 기본 `40`.                                                             |
| `Tabs`    | `backgroundColor` / `textColor` / `activeColor` / `indicatorColor` | `string`                | 탭 바·텍스트·선택 상태·indicator 색상.                                               |
| `Tabs`    | `onChange`                                                         | `(key: string) => void` | 탭 전환 callback.                                                                    |
| `TabItem` | `id` / `title`                                                     | `string`                | 탭 고유 식별자와 제목. 필수.                                                         |
| `TabItem` | `disabled`                                                         | `boolean`               | 탭 클릭 비활성화.                                                                    |
| `TabItem` | Children                                                           | Canvas UI 컴포넌트      | 해당 탭의 Canvas 콘텐츠.                                                             |

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

Angular는 `<canvas-tabs>`와 `<canvas-tab-item>`을 사용하며, 선택 변경은 `(activeKeyChange)`를 사용합니다.

### `<Collapse>` 와 `<CollapseItem>`

각 `CollapseItem`의 헤더 바를 클릭해 펼치기/접기를 전환하고, 자식 요소를 panel content로 사용합니다.

| 컴포넌트       | 속성                                            | 타입                       | 설명                                                                                                |
| -------------- | ----------------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------- |
| `Collapse`     | `width`                                         | `number`                   | panel 너비. 필수.                                                                                   |
| `Collapse`     | `activeKeys` / `defaultActiveKeys`              | `string[]`                 | Controlled 펼쳐진 항목 / uncontrolled 초기 펼쳐진 항목.                                             |
| `Collapse`     | `accordion`                                     | `boolean`                  | 기본 `false`. `true`면 단일 항목만 펼쳐짐.                                                          |
| `Collapse`     | `headerHeight`                                  | `number`                   | 헤더 바 높이. 기본 `40`.                                                                            |
| `Collapse`     | `backgroundColor` / `textColor` / `borderColor` | `string`                   | 모든 헤더의 기본 배경·텍스트·border 색상.                                                           |
| `Collapse`     | `onChange`                                      | `(keys: string[]) => void` | 펼침 집합 변경 callback.                                                                            |
| `CollapseItem` | `id` / `title`                                  | `string`                   | panel 고유 식별자와 제목. 필수.                                                                     |
| `CollapseItem` | `height`                                        | `number`                   | 펼침 시 콘텐츠 높이. 자식 노드에 필요한 높이로 자동 계산되며 최소 `100`. 명시 값이 항상 우선됩니다. |
| `CollapseItem` | `disabled`                                      | `boolean`                  | 펼치기/접기 금지.                                                                                   |
| `CollapseItem` | `backgroundColor` / `textColor` / `borderColor` | `string`                   | 해당 항목 헤더 색상 override.                                                                       |

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

Angular는 `<canvas-collapse>`와 `<canvas-collapse-item>`을 사용하며, 펼침 변경은 `(activeKeysChange)`를 사용합니다.

### `<Dialog>`

확인 dialog는 기본으로 Canvas 중앙을 overlay하며 mask, 제목, content 영역, 내장 cancel/confirm 버튼을 그립니다. content 영역에는 임의의 Canvas UI 컴포넌트를 넣을 수 있습니다. dialog가 열려 있는 동안 mask click-through를 방지하기 위해 내부의 Input/Textarea는 입력할 수 없습니다.

| 속성                         | 타입               |              기본값 | 설명                                                                 |
| ---------------------------- | ------------------ | ------------------: | -------------------------------------------------------------------- |
| `open`                       | `boolean`          |                필수 | dialog 표시 여부.                                                    |
| `width` / `height`           | `number`           |       `420` / `240` | dialog 크기.                                                         |
| `title`                      | `string`           |         `"Confirm"` | 제목.                                                                |
| `confirmText` / `cancelText` | `string`           | `"OK"` / `"Cancel"` | 내장 버튼 텍스트.                                                    |
| `closeOnBackdrop`            | `boolean`          |              `true` | mask 클릭 시 cancel callback을 발생시킬지 여부.                      |
| `onConfirm` / `onCancel`     | `() => void`       |                   — | confirm / cancel callback.                                           |
| Children                     | Canvas UI 컴포넌트 |                   — | dialog content 영역. 임의의 Canvas UI 컴포넌트를 배치할 수 있습니다. |

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

Angular는 `<canvas-dialog>`와 `open` input, `(confirm)` / `(cancel)` output을 사용합니다.

### `<Rect>`

사각형을 그립니다. [공통 속성](#공통-속성)을 지원합니다.

| 속성          | 타입     |          기본값 | 설명                                    |
| ------------- | -------- | --------------: | --------------------------------------- |
| `width`       | `number` |           `100` | 너비.                                   |
| `height`      | `number` |            `40` | 높이.                                   |
| `color`       | `string` | `"transparent"` | 채우기 색상.                            |
| `radius`      | `number` |             `0` | 모서리 radius.                          |
| `stroke`      | `string` |               — | stroke 색상. 미지정 시 그리지 않습니다. |
| `strokeWidth` | `number` |             `1` | stroke 굵기.                            |

### `<Circle>`

원을 그립니다. [공통 속성](#공통-속성)을 지원합니다.

| 속성          | 타입     |      기본값 | 설명                                    |
| ------------- | -------- | ----------: | --------------------------------------- |
| `radius`      | `number` |        `10` | 반지름.                                 |
| `color`       | `string` | `"#e74c3c"` | 채우기 색상.                            |
| `stroke`      | `string` |           — | stroke 색상. 미지정 시 그리지 않습니다. |
| `strokeWidth` | `number` |         `1` | stroke 굵기.                            |

### `<Text>`

한 줄 또는 자동 줄바꿈 텍스트를 그립니다. 노드는 줄바꿈 결과 실제로 필요한 크기를 보고하므로 `<CollapseItem>` 같은 컨테이너가 높이를 자동 조정할 수 있습니다. [공통 속성](#공통-속성)을 지원합니다.

| 속성         | 타입                            |         기본값 | 설명                                                                                                                                                   |
| ------------ | ------------------------------- | -------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `text`       | `string`                        |              — | 텍스트 내용.                                                                                                                                           |
| Children     | `string \| number`              |              — | 각 프레임워크의 template text로 `text`를 대체할 수 있습니다.                                                                                           |
| `fontSize`   | `number`                        |           `16` | 글자 크기(logical pixel 단위).                                                                                                                         |
| `width`      | `number`                        |              — | 최대 줄 폭. 초과 시 자동 줄바꿈. 중국어 등 고정 폭 문자도 측정 폭에 따라 줄바꿈됩니다. `<Grid>` 안에서 지정하지 않으면 cell 폭을 사용합니다.           |
| `maxLines`   | `number`                        |              — | 표시할 최대 줄 수. 마지막 줄의 초과분은 줄임표로 잘라냅니다. `<Grid>` 안에서 지정하지 않으면 cell에 들어가는 줄 수를 사용하며, 둘 다 없으면 제한 없음. |
| `fontFamily` | `string`                        | `"sans-serif"` | 폰트 family.                                                                                                                                           |
| `color`      | `string`                        |       `"#333"` | 글자색.                                                                                                                                                |
| `baseline`   | `CanvasTextBaseline`            |        `"top"` | Canvas text baseline.                                                                                                                                  |
| `textAlign`  | `"left" \| "center" \| "right"` |       `"left"` | 수평 정렬. `width` 지정 시 text box 기준 정렬.                                                                                                         |

### `<Icon>`

아이콘 폰트나 external image에 의존하지 않는 자체 vector icon. [공통 속성](#공통-속성)을 지원합니다.

| 속성          | 타입                   |      기본값 | 설명                                                                    |
| ------------- | ---------------------- | ----------: | ----------------------------------------------------------------------- |
| `name`        | `IconName`             |        필수 | icon name. 아래 목록 참고.                                              |
| `size`        | `number`               |        `24` | icon 너비·높이.                                                         |
| `color`       | `string`               |    `"#333"` | icon 색상. `--canvas-ui-icon-color`로 테마 기본값을 지정할 수 있습니다. |
| `variant`     | `"outline" \| "solid"` | `"outline"` | `outline`은 선, `solid`은 굵은 선과 주요 도형의 fill.                   |
| `strokeWidth` | `number`               |         `2` | outline 선 굵기. solid는 최소 `4`.                                      |

지원 이름: `home`, `house`, `building`, `apartment`, `store`, `mapPin`, `map`, `globe`, `compass`, `navigation`, `flag`, `mountain`, `tree`, `leaf`, `flower`, `sun`, `moon`, `cloud`, `rain`, `snow`, `fire`, `water`, `wind`, `car`, `bus`, `train`, `plane`, `bicycle`, `ship`, `rocket`, `truck`, `walk`, `phone`, `message`, `mail`, `bell`, `calendar`, `clock`, `alarm`, `camera`, `image`, `video`, `music`, `microphone`, `headphones`, `play`, `pause`, `stop`, `record`, `volume`, `wifi`, `bluetooth`, `battery`, `signal`, `power`, `monitor`, `laptop`, `tablet`, `keyboard`, `mouse`, `printer`, `folder`, `file`, `document`, `download`, `upload`, `share`, `link`, `search`, `settings`, `sliders`, `menu`, `close`, `check`, `plus`, `minus`, `edit`, `trash`, `copy`, `save`, `lock`, `unlock`, `key`, `user`, `users`, `heart`, `star`, `bookmark`, `cart`, `bag`, `gift`, `creditCard`, `wallet`, `chart`, `pieChart`, `barChart`, `analytics`, `shield`, `warning`, `info`, `help`, `question`, `tag`, `puzzle`, `code`, `database`, `cloudDownload`.

```tsx
<Icon name="search" x={16} y={16} size={28} color="#1677ff" />
<Icon name="heart" x={56} y={16} variant="solid" color="#e74c3c" />
```

### `<Input>`

한 줄 입력란. 컨트롤의 외형은 Canvas에 그리고, 투명한 HTML input이 키보드·IME·selection을 담당합니다.

| 속성               | 타입                               |         기본값 | 설명                                              |
| ------------------ | ---------------------------------- | -------------: | ------------------------------------------------- |
| `width` / `height` | `number`                           |   `200` / `36` | 컨트롤 크기.                                      |
| `value`            | `string`                           |              — | Controlled 값. `onChange`와 조합해 갱신하세요.    |
| `defaultValue`     | `string`                           |           `""` | Uncontrolled 초기값.                              |
| `placeholder`      | `string`                           |           `""` | Placeholder 텍스트.                               |
| `type`             | `"text" \| "password" \| "number"` |       `"text"` | 입력 타입. password는 Canvas에 점으로 표시됩니다. |
| `fontSize`         | `number`                           |           `14` | 글자 크기.                                        |
| `fontFamily`       | `string`                           | `"sans-serif"` | 폰트 family.                                      |
| `color`            | `string`                           |       `"#333"` | 입력 텍스트 색상.                                 |
| `bgColor`          | `string`                           |       `"#fff"` | 배경색.                                           |
| `borderColor`      | `string`                           |       `"#ccc"` | 일반 border 색상.                                 |
| `focusBorderColor` | `string`                           |    `"#3498db"` | focus 시 border 색상.                             |
| `borderRadius`     | `number`                           |            `4` | 모서리 radius.                                    |
| `padding`          | `number`                           |            `8` | 텍스트 안쪽 여백.                                 |
| `disabled`         | `boolean`                          |        `false` | 입력 비활성화.                                    |
| `maxLength`        | `number`                           |              — | 최대 문자 수. 음이 아닌 정수.                     |
| `onChange`         | `(value: string) => void`          |              — | 입력 변경 callback.                               |
| `onFocus`          | `() => void`                       |              — | focus gained callback.                            |
| `onBlur`           | `() => void`                       |              — | focus lost callback.                              |

### `<Textarea>`

여러 줄 입력란. `<Input>`의 값·크기·스타일·callback props를 상속하며, 고정 높이를 넘으면 내부 scroll과 scrollbar가 표시됩니다. `type`은 지원하지 않습니다. 추가 속성:

| 속성   | 타입     | 설명                                                                   |
| ------ | -------- | ---------------------------------------------------------------------- |
| `rows` | `number` | 기대 줄 수를 표현하는 데 사용. 실제 렌더 높이는 `height`로 결정됩니다. |

```tsx
<Textarea
    width={300}
    height={120}
    value={notes}
    placeholder="여러 줄 내용 입력"
    onChange={setNotes}
/>
```

### `<Upload>`

파일 선택 버튼을 그립니다. 내장 벡터 아이콘과 라벨이 하나의 그룹으로 수평 중앙 정렬됩니다. 클릭 시 브라우저의 로컬 파일 선택 dialog를 엽니다. 서버 upload는 담당하지 않습니다.

| 속성               | 타입                      |           기본값 | 설명                                                                                |
| ------------------ | ------------------------- | ---------------: | ----------------------------------------------------------------------------------- |
| `width` / `height` | `number`                  |     `120` / `40` | 버튼 크기.                                                                          |
| `text`             | `string`                  |  `"Choose File"` | 버튼 텍스트.                                                                        |
| `icon`             | `IconName`                |       `"upload"` | 라벨 앞에 그려지는 내장 아이콘. [`<Icon>`](#icon)의 아무 아이콘 이름이나 지정 가능. |
| `iconSize`         | `number`                  | `fontSize × 1.1` | 아이콘 크기.                                                                        |
| `accept`           | `string`                  |                — | 파일 타입 필터. 예: `"image/*,.pdf"`.                                               |
| `multiple`         | `boolean`                 |          `false` | 복수 선택 허용 여부.                                                                |
| `disabled`         | `boolean`                 |          `false` | 파일 선택 비활성화.                                                                 |
| `onChange`         | `(files: File[]) => void` |                — | 파일 선택 후 callback. 선택을 취소하면 발생하지 않습니다.                           |

```tsx
<Upload accept="image/*" multiple onChange={(files) => console.log(files)} />
<Upload icon="cloud" text="Upload Photos" />
```

Angular는 `<canvas-upload>`를 사용하고 `(change)`로 `File[]`를 받습니다.

### `<Dropdown>`

Canvas로 그리는 드롭다운 선택. [공통 속성](#공통-속성)을 지원합니다.

| 속성               | 타입                              |        기본값 | 설명                                               |
| ------------------ | --------------------------------- | ------------: | -------------------------------------------------- |
| `width` / `height` | `number`                          |  `200` / `36` | 컨트롤 크기.                                       |
| `options`          | `Array<string \| DropdownOption>` |          필수 | option 목록. string option은 label과 value가 동일. |
| `value`            | `string`                          |             — | Controlled 선택 값.                                |
| `defaultValue`     | `string`                          |             — | Uncontrolled 초기값.                               |
| `placeholder`      | `string`                          | `"Select..."` | 미선택 시 표시 텍스트.                             |
| `disabled`         | `boolean`                         |       `false` | 인터랙션 비활성화.                                 |
| `fontSize`         | `number`                          |          `14` | 글자 크기.                                         |
| `color`            | `string`                          |      `"#333"` | 텍스트 색상.                                       |
| `bgColor`          | `string`                          |      `"#fff"` | 컨트롤 배경색.                                     |
| `borderColor`      | `string`                          |   `"#c7ccd3"` | 일반 border 색상.                                  |
| `focusBorderColor` | `string`                          |   `"#3478f6"` | 펼침 시 border 색상.                               |
| `borderRadius`     | `number`                          |           `4` | 모서리 radius.                                     |
| `onChange`         | `(value: string) => void`         |             — | 선택 변경 callback.                                |

`DropdownOption` 타입:

| 속성       | 타입      | 설명                     |
| ---------- | --------- | ------------------------ |
| `label`    | `string`  | 표시 텍스트.             |
| `value`    | `string`  | option 값.               |
| `disabled` | `boolean` | 이 option 비활성화 여부. |

```tsx
<Dropdown
    value={role}
    options={['Admin', { label: 'readOnly', value: 'reader', disabled: false }]}
    onChange={setRole}
/>
```

### `<DatePicker>`

Canvas로 그리는 날짜 입력. 클릭하면 브라우저의 native picker를 사용합니다.

| 속성               | 타입                      |          기본값 | 설명                               |
| ------------------ | ------------------------- | --------------: | ---------------------------------- |
| `width` / `height` | `number`                  |    `200` / `36` | 컨트롤 크기.                       |
| `value`            | `string`                  |               — | Controlled 값. 포맷: `YYYY-MM-DD`. |
| `defaultValue`     | `string`                  |            `""` | Uncontrolled 초기값.               |
| `placeholder`      | `string`                  | `"Select date"` | 미선택 시 표시 텍스트.             |
| `disabled`         | `boolean`                 |         `false` | 날짜 선택 비활성화.                |
| `onChange`         | `(value: string) => void` |               — | 날짜 변경 callback.                |

### `<Radio>` 와 `<Checkbox>`

둘 다 `options` 배열을 받습니다. Radio는 단일 선택, Checkbox는 다중 선택입니다. string option은 label과 value가 동일하며, `{ label, value, disabled }` object도 전달할 수 있습니다.

| 속성               | 타입                                                                    |         기본값 | 설명                 |
| ------------------ | ----------------------------------------------------------------------- | -------------: | -------------------- |
| `options`          | `Array<string \| ChoiceOption>`                                         |           필수 | option 목록.         |
| `value`            | Radio: `string`; Checkbox: `string[]`                                   |              — | Controlled 값.       |
| `defaultValue`     | Radio: `string`; Checkbox: `string[]`                                   |              — | Uncontrolled 초기값. |
| `direction`        | `"horizontal" \| "vertical"`                                            | `"horizontal"` | option 배치 방향.    |
| `width` / `height` | `number`                                                                |      자동 계산 | 컨트롤 크기.         |
| `onChange`         | Radio: `(value: string) => void`; Checkbox: `(value: string[]) => void` |              — | 선택 변경 callback.  |

```tsx
<Radio options={['Small', 'Medium', 'Large']} value={size} onChange={setSize} />
<Checkbox options={['Email', 'SMS']} value={channels} onChange={setChannels} />
```

Angular는 `<canvas-date-picker>`, `<canvas-radio>`, `<canvas-checkbox>`를 사용하며, 날짜 선택은 `(valueChange)` 또는 `(change)`, Radio/Checkbox는 `(change)`로 받습니다.

### `<Slider>`

슬라이더 조작. [공통 속성](#공통-속성)을 지원합니다.

| 속성               | 타입                      |       기본값 | 설명                        |
| ------------------ | ------------------------- | -----------: | --------------------------- |
| `width` / `height` | `number`                  | `160` / `32` | 슬라이더 크기.              |
| `min` / `max`      | `number`                  |  `0` / `100` | 최소·최대 값.               |
| `step`             | `number`                  |          `1` | step 크기.                  |
| `value`            | `number`                  |            — | Controlled 값.              |
| `defaultValue`     | `number`                  |        `min` | Uncontrolled 초기값.        |
| `disabled`         | `boolean`                 |      `false` | 드래그 비활성화.            |
| `trackColor`       | `string`                  |  `"#d7dde5"` | track 색상.                 |
| `activeColor`      | `string`                  |  `"#3478f6"` | 채워진 track과 border 색상. |
| `thumbColor`       | `string`                  |     `"#fff"` | thumb 색상.                 |
| `onChange`         | `(value: number) => void` |            — | 값 변경 callback.           |

### `<Switch>`

스위치 컨트롤. [공통 속성](#공통-속성)을 지원합니다.

| 속성               | 타입                         |      기본값 | 설명                     |
| ------------------ | ---------------------------- | ----------: | ------------------------ |
| `width` / `height` | `number`                     | `44` / `24` | 스위치 크기.             |
| `checked`          | `boolean`                    |           — | Controlled checked 상태. |
| `defaultChecked`   | `boolean`                    |     `false` | Uncontrolled 초기값.     |
| `disabled`         | `boolean`                    |     `false` | 전환 비활성화.           |
| `onColor`          | `string`                     | `"#3478f6"` | 켜짐 시 track 색상.      |
| `offColor`         | `string`                     | `"#c7ccd3"` | 꺼짐 시 track 색상.      |
| `thumbColor`       | `string`                     |    `"#fff"` | thumb 색상.              |
| `onChange`         | `(checked: boolean) => void` |           — | 상태 변경 callback.      |

### `<Button>`

Canvas로 그리는 버튼. [공통 속성](#공통-속성)을 지원합니다.

| 속성               | 타입               |       기본값 | 설명                                       |
| ------------------ | ------------------ | -----------: | ------------------------------------------ |
| `width` / `height` | `number`           | `120` / `40` | 버튼 크기.                                 |
| Children           | `string \| number` |            — | 버튼 텍스트. `text`로도 대체 가능.         |
| `text`             | `string`           |            — | 버튼 텍스트. 둘 다 주어지면 `text`가 우선. |
| `fontSize`         | `number`           |         `15` | 글자 크기.                                 |
| `fontColor`        | `string`           |     `"#fff"` | 텍스트 색상.                               |
| `backgroundColor`  | `string`           |  `"#3478f6"` | 배경색.                                    |
| `borderColor`      | `string`           |            — | stroke 색상.                               |
| `borderRadius`     | `number`           |          `6` | 모서리 radius.                             |
| `disabled`         | `boolean`          |      `false` | 버튼 비활성화.                             |
| `onClick`          | `() => void`       |            — | 클릭 callback.                             |

## 이미지 내보내기

`CanvasHandle`이 제공하는 `ref`로 이미지를 export합니다:

```tsx
const canvasRef = useRef<CanvasHandle>(null);

// PNG Data URL — img.src에 바로 대입 가능
const dataUrl = canvasRef.current?.toDataURL({
    type: 'image/png',
    width: 840,
    height: 600,
    pixelRatio: 2,
});

// JPEG Blob — download link 생성 또는 upload에 사용
const blob = await canvasRef.current?.toBlob({
    type: 'image/jpeg',
    quality: 0.9,
    pixelRatio: 2,
});

// 내부 HTMLCanvasElement 획득
const canvasElement = canvasRef.current?.getCanvas();
```

`CanvasExportOptions` 매개변수:

| 속성         | 타입     |                   기본값 | 설명                                                                                                 |
| ------------ | -------- | -----------------------: | ---------------------------------------------------------------------------------------------------- |
| `width`      | `number` | 현재 Canvas logical 너비 | export 이미지의 logical 너비.                                                                        |
| `height`     | `number` | 현재 Canvas logical 높이 | export 이미지의 logical 높이.                                                                        |
| `pixelRatio` | `number` |     Canvas의 pixel ratio | 출력 pixel 밀도. 최종 bitmap 크기는 약 `width × pixelRatio` × `height × pixelRatio`.                 |
| `type`       | `string` |            `"image/png"` | 이미지 MIME 타입(`image/png`, `image/jpeg`, `image/webp` 등). 브라우저 미지원 포맷은 PNG로 fallback. |
| `quality`    | `number` |          브라우저 기본값 | 손실 포맷의 품질. 범위 `0`~`1`. PNG에서는 일반적으로 사용되지 않습니다.                              |

짧은 인자 호출도 호환됩니다:

```tsx
canvasRef.current?.toDataURL('image/png');
const jpegBlob = await canvasRef.current?.toBlob('image/jpeg', 0.9);
```

export 크기와 pixel ratio는 반드시 양수여야 합니다. scene에 사용된 cross-origin 이미지가 CORS 승인을 받지 못하면 `toDataURL()`은 사유가 명시된 error를 throw하고 `toBlob()`은 동일한 error로 Promise를 reject합니다. 이미지 서버에서 현재 사이트를 허용하는 `Access-Control-Allow-Origin` response header를 반환하도록 설정하거나, 해당 이미지를 제거한 후 export하세요.

## 파일 구조

| 파일                  | 용도                                                                                                                             |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `react/`              | React 컴포넌트와 Canvas 컨테이너 어댑터.                                                                                         |
| `vue/`                | Vue 3 컴포넌트와 Canvas 컨테이너 어댑터.                                                                                         |
| `svelte/`             | Svelte 5+ 컴포넌트 어댑터와 template 컴포넌트.                                                                                   |
| `angular/`            | Angular standalone Canvas 컴포넌트와 scene 디렉터리.                                                                             |
| `components/`         | 공용 컴포넌트 구현. 각 컴포넌트는 독립 디렉터리·entry·Props/렌더 파일을 가지며, 필요 시 인터랙션 로직을 `logic.ts`에 분리합니다. |
| `components/index.ts` | 컴포넌트 통합 export와 subtree 컴파일.                                                                                           |
| `components/types.ts` | 모든 public Props 타입 모음.                                                                                                     |
| `theme.css`           | Canvas 컴포넌트의 light/dark CSS theme 변수.                                                                                     |
| `types.ts`            | 컴포넌트 Props 모음, scene node, input bridge 타입.                                                                              |
| `engine.ts`           | scene 동기화, input bridge, hit test, 컨트롤 인터랙션.                                                                           |
| `renderer.ts`         | scene 순회와 Canvas 렌더 dispatch.                                                                                               |
| `input-bridge.ts`     | Input/Textarea용 투명한 HTML input bridge.                                                                                       |
| `types.ts`            | scene, Canvas, bridge 관련 타입.                                                                                                 |

모양만 수정할 때는 우선 대응하는 `components/<Component>/<component>.ts` 렌더 함수를 수정하세요. 컴포넌트별 인터랙션 로직은 같은 디렉터리의 `logic.ts`에 둡니다. 공통 layout, event, export 동작을 수정할 때만 대응 어댑터, `engine.ts`, `renderer.ts`를 수정하세요.
