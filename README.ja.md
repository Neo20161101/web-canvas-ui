![Markdown Logo](./src/assets/web-canvas-ui-logo-bright.svg "web-canvas-ui")
# Web Canvas UI (React, Vue 3, Svelte, Angular)

[English](./README.md) · [日本語](./README.ja.md) · [한국어](./README.ko.md) · [繁體中文](./README.zh-TW.md) · [Русский](./README.ru.md) · [简体中文](./README.zh-CN.md)

Canvas 2D ベースの宣言的コンポーネントライブラリで、**React**、**Vue 3**、**Svelte 5+**、**Angular 17+** のアダプターを提供します。各フレームワークは専用のエントリからインポートし、ネイティブのコンポーネント／テンプレート構文を使用しますが、内部の Canvas エンジンとコントロール描画ロジックは共有されます。すべてのコントロールの外観は Canvas 自身によって描画されます。

> **アダプターについて：** React、Vue、Svelte、Angular は、それぞれ `/canvas-ui/react`、`/canvas-ui/vue`、`/canvas-ui/svelte`、`/canvas-ui/angular` からインポートします。宿主 Canvas フレームワークに一致するエントリを選び、アダプター間でコンポーネントを混在しないでください。すべて同じエンジンとコントロール描画実装を再利用します。

> **共有コンポーネント契約：** 各コントロールは `components/<Component>/` 配下に配置されます。`index.ts` エントリが公開 API をエクスポートし、`<component>.ts` が Props 型と Canvas 描画関数を定義し、必要に応じて `logic.ts` がそのコントロール固有のインタラクション／ビジネスロジックを保持します。共通型は `components/types.ts` に集約され、`/canvas-ui/types.ts` 経由で再エクスポートされます。React、Vue、Svelte、Angular のアダプターはこの型契約を共有します。

## グローバルテーマカラー

テーマカラーは [`theme.scss`](theme.scss) の `$primary: #1668dc` に集約されています。この変数を 1 つ変更するだけで、ボタン、選択状態、フォーカスボーダー、プログレスバーなどのアクセントカラーがまとめて更新されます。淡色はプライマリと白の混合で、押下状態の濃色はプライマリの明度を下げて派生し、共通の色階は `--canvas-ui-primary*` CSS 変数としても出力されます。`theme.css` はビルド成果物なので、アプリのグローバル CSS から読み込み、生成ファイルを直接編集しないでください：

```css
@import '/canvas-ui/theme.css';
```

`theme.scss` を編集した後は `npm run build:theme` を実行して CSS を再生成します。コンパイル済みの CSS カスタムプロパティは React、Vue、Svelte、Angular のすべてに適用され、`.dark` と `[data-theme="dark"]` のダークテーマも提供されます。コンポーネントに明示的に渡した色はテーマ変数より優先されます。

5 種類のプリマリパレット（青・緑・紫・橙・赤）が組み込まれており、Canvas の外側コンテナに対応するクラスを付与すると切り替えられます。ダークテーマとの併用も可能です：

```tsx
<div className="theme-green">
    <Canvas width={400} height={240}>
        <Button>Green theme</Button>
    </Canvas>
</div>
```

| パレット         | class          | プリマリ  |
| ---------------- | -------------- | --------- |
| 青（デフォルト） | `theme-blue`   | `#1668dc` |
| 緑               | `theme-green`  | `#389e0d` |
| 紫               | `theme-purple` | `#722ed1` |
| 橙               | `theme-orange` | `#d46b08` |
| 赤               | `theme-red`    | `#cf1322` |

たとえば `dark` と `theme-purple` を同時に付与するか、`data-theme="dark"` と `theme-purple` を組み合わせると、紫のダークテーマになります。どのパレットでも、淡色／押下／ダーク系のアクセントは Sass により対応するプリマリから導出されます。

| コンポーネント                | CSS カスタムプロパティ                                                                                                                                                                                                                                                                               |
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

アプリ独自のカスタムテーマを作るには、自分の CSS で必要な変数のみを上書きします。例：`.brand { --canvas-ui-button-background: #6d4aff; }`。上の表は各コンポーネントが実際に読み取るテーマ変数を一覧化したものです。

## 環境とインポート

`/canvas-ui/` ディレクトリをプロジェクトに配置し、宿主 Canvas プロジェクトが選択したフレームワーク（React 19+、Vue 3、Svelte 5+、Angular 17+）用に設定済みであることを確認してください。Vue はシングルファイルコンポーネントのテンプレートを使い、JSX プラグインや `jsxImportSource` の設定は不要です。Svelte プロジェクトには Svelte コンパイラと対応するビルドプラグインが必要です。Angular プロジェクトには `@angular/core` と Angular ビルド設定が必要です。フレームワークの依存関係は宿主 Canvas プロジェクト側で提供され、このディレクトリでは他のフレームワークの依存を強制しません。

| フレームワーク | エントリ             |
| -------------- | -------------------- |
| React          | `/canvas-ui/react`   |
| Vue 3          | `/canvas-ui/vue`     |
| Svelte 5+      | `/canvas-ui/svelte`  |
| Angular 17+    | `/canvas-ui/angular` |

コンポーネントは対応するアダプターの Canvas コンテナ内部に配置し、そのフレームワークのエントリからエクスポートされたシーンコンポーネントを使用してください。Canvas シーン内にプレーンな DOM 要素を置かないでください。

## クイックスタート（React）

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

`x`、`y` は親に対する相対位置で、単位は Canvas 論理ピクセルです。`Group` は入れ子にでき、子コンポーネントの座標は親の位置・スケール・回転を累積します。

## クイックスタート（Vue 3 シングルファイルコンポーネント）

Vue アダプターは専用の `/canvas-ui/vue` エントリに配置されています。`.vue` ファイルのテンプレート内で Canvas UI コンポーネントをそのまま入れ子にできます。TSX、JSX プラグイン、Canvas ノード配列の手動構築は不要です：

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

Vue のテンプレートでは `:value` でリアクティブ状態をバインドし、`@change` で更新します。Canvas コンポーネントは Vue の更新後にシーンを同期します。

## クイックスタート（Svelte 5+）

Svelte 5 のテンプレートで、Svelte エントリからエクスポートされたコンポーネントを使用します。`Canvas` は `bind:this` でメソッドにアクセスできます：

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

Svelte のコントロールの Props が変化すると Canvas シーンに同期されます；

## クイックスタート（Angular 17+）

Angular エントリは standalone の `Canvas` コンポーネントとシーンディレクティブを提供します。それらを使用する standalone コンポーネントで必要なシンボルをインポートします：

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

Angular では `<canvas-...>` ディレクティブセレクタで Canvas シーンノードを宣言します。入力・ドロップダウン・スライダーは `(valueChange)`、スイッチは `(checkedChange)`、ボタンは `(click)` を使います。

インタラクション関連のプロップは各フレームワークの慣習に従います：React は `onChange`/`onClick` プロップ、Vue は `@change`/`@click`、Svelte は `onChange`/`onClick` のコールバックプロップ、Angular は `(valueChange)`、`(checkedChange)`、`(click)` の出力バインディングを使用します。

## 共通プロップ

`<Canvas>` を除くすべての表示コンポーネントは、次の变换プロップをサポートします：

| プロップ   | 型        | デフォルト | 説明                                                                                       |
| ---------- | --------- | ---------: | ------------------------------------------------------------------------------------------ |
| `x`        | `number`  |        `0` | 親からの水平方向の相対位置。                                                               |
| `y`        | `number`  |        `0` | 親からの垂直方向の相対位置。                                                               |
| `rotation` | `number`  |        `0` | 回転ラジアン。                                                                             |
| `scaleX`   | `number`  |        `1` | 水平方向の变换スケール。                                                                   |
| `scaleY`   | `number`  |        `1` | 垂直方向の变换スケール。                                                                   |
| `visible`  | `boolean` |     `true` | 描画するかどうか。`false` の場合、子コンポーネントも非表示になりクリックにも反応しません。 |

### サイズ規則

- `Rect`、`Input`、`Textarea`、`Upload`、`Dropdown`、`DatePicker`、`Slider`、`Switch`、`Button` は `width` と `height` でサイズを指定します。
- `Circle` は `radius`（デフォルト `10`）で半径を指定し、直径は半径の 2 倍です。
- `Text` は `fontSize` でフォントサイズ、`width` で折返し幅を指定します。
- `width`/`height` 未指定時は、各コンポーネントのドキュメントに記載されたデフォルト値が使われます。`Group` はコンテナで固有の幅・高さを持ちません。`Grid` は列数とセルプロップに基づいてレイアウトします。
- `Grid` は子コンポーネントを順序通りに自動配置し、`columns`、`cellHeight`、任意で `gap` を指定します。セル幅は `cellWidth` で固定するか、`width` で等分できます。直接の子はデフォルトで 1 セルを占有し、`GridItem` を使うと複数のコントロールを 1 つのグリッド項目としてまとめ、列／行スパンを指定できます。グループ内の子のサイズは引き続き各自のプロップで決まります。

## コンポーネントの Props

### `<Canvas>`

Canvas シーンを作成します。サイズは論理ピクセル指定で、実ビットマップはピクセル比を乗じたものになります。

| プロップ                                            | 型                                                                                     |   必須 |                                                               デフォルト | 説明                                                                                                                     |
| --------------------------------------------------- | -------------------------------------------------------------------------------------- | -----: | -----------------------------------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------ |
| `width`                                             | `number`                                                                               |   はい |                                                                        — | Canvas の論理幅。                                                                                                        |
| `height`                                            | `number`                                                                               |   はい |                                                                        — | Canvas の論理高さ。                                                                                                      |
| ピクセル比                                          | 自動                                                                                   |      — | `window.devicePixelRatio` を自動取得し、最低 `1`。プロップの指定は不要。 | Canvas の描画解像度比。                                                                                                  |
| `className`（React/Angular）/ `class`（Vue/Svelte） | `string`                                                                               | いいえ |                                                                        — | 外側コンテナの CSS クラス。                                                                                              |
| `style`                                             | 各フレームワークのスタイルオブジェクトまたは文字列                                     | いいえ |                                                                        — | 外側コンテナのスタイル。`position`、`width`、`height` はコンポーネント側で設定されます。                                 |
| `ariaLabel`                                         | `string`                                                                               | いいえ |                                                               `"Canvas"` | Canvas のアクセシビリティラベル。                                                                                        |
| `onFrame`                                           | `(time: number) => void`                                                               | いいえ |                                                                        — | 毎フレームのコールバック。`time` はブラウザのアニメーションフレームのタイムスタンプ。                                    |
| `onEvent`                                           | `(event: CanvasUIEvent) => void`                                                       | いいえ |                                                                        — | Canvas の統一イベント入口。`pointerdown`、`pointermove`、`pointerup`、`pointercancel`、`click`、`wheel` を受け取ります。 |
| 子要素                                              | React children / Vue デフォルトスロット / Svelte children / Angular content projection | いいえ |                                                                        — | Canvas UI コンポーネントツリー。                                                                                         |

`onEvent` のイベントには、Canvas 論理座標 `x`/`y`、ヒットした `target`（コンポーネントの `type` とユーザー指定 `key`。空白部は `null`）、ヒットしたコンポーネントのローカル座標 `localX`/`localY` が含まれます。`wheel` には追加で `deltaY`、ポインター系イベントには `pointerId` が含まれます。統一 `click` は同じ対象を押し、同じ対象で離し、移動距離が 8 論理ピクセル以下の場合にのみ 1 度発火します。ドラッグやキャンセルでは発火しません。各コンポーネントの既存の `onClick`、`onChange` などは通常通り実行され、`onEvent` はコンポーネント横断のビジネスロジックや統一計測に向いています。

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

React の ref、Vue のテンプレート ref、Svelte の `bind:this`、Angular のテンプレート参照を通じてスクリーンショット API にアクセスできます。詳細は[画像エクスポート](#画像エクスポート)を参照してください。`CanvasHandle` は `requestRender()` も提供し、ソース Canvas の更新後に宿主 Canvas の再描画を要求できます。

### `<CanvasView>`

サードパーティや他モジュールが同じページ上で作成した `HTMLCanvasElement` の映像を、現在の Canvas に描画します。ピクセル映像のみを埋め込み、ソース Canvas の DOM やイベントハンドラは現在の Canvas に持ち込みません。

| プロップ           | 型                                        |   必須 |  デフォルト | 説明                                                                                                                                                          |
| ------------------ | ----------------------------------------- | -----: | ----------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`           | `HTMLCanvasElement`                       |   はい |           — | 表示するソース Canvas インスタンス。                                                                                                                          |
| `width` / `height` | `number`                                  |   はい |           — | 現在の Canvas 上で占有する論理サイズ。                                                                                                                        |
| `fit`              | `'contain' \| 'cover' \| 'fill'`          | いいえ | `'contain'` | 比率を保ったまま全体表示、比率を保ったままトリミング表示、または引き伸ばして表示。                                                                            |
| `onPointerEvent`   | `(event: CanvasViewPointerEvent) => void` | いいえ |           — | マッピング済みの `pointerdown`、`pointermove`、`pointerup`、`pointercancel`、`click` を提供。ソース Canvas への合成イベントの自動ディスパッチは行われません。 |

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

// サードパーティ Canvas が映像を更新した後、宿主 Canvas に再描画を要求：
canvasRef.current?.requestRender();
```

イベントには `x`/`y`（CanvasView ローカル論理座標）、`sourceX`/`sourceY`（ソース Canvas のビットマップピクセル座標）、ソース Canvas サイズ、ボタン状態、`pointerId`、`pointerType`、`pressure`、`isPrimary` が含まれます。`contain` のレターボックス領域はヒットしません。ドラッグ中はポインターが一時的に範囲外に出ても、ソース Canvas 座標を報告し続けます。このデータを使ってサードパーティライブラリのインタラクション API を呼び出せます。ソース Canvas は宿主 Canvas へコンテンツ変化を自動通知しないため、ソース内容を更新した後に宿主 Canvas の `requestRender()` を呼び出してください。アニメーションフレーム内で更新する方法も可能です。ソース Canvas に CORS 認可のない画像が含まれる場合、宿主 Canvas は汚染されエクスポートも失敗します。Canvas のクロスオリジン制限はこのコンポーネントでは回避できません。

### `<CustomDraw>`

組み込みコンポーネントで描画要件をカバーできない場合は、`CustomDraw` で Canvas 2D の描画コールバックを提供します。シーン再描画時（画像エクスポートを含む）に毎回実行され、コールバックの原点はコンポーネントの左上で、共通の位置・回転・スケールプロップを使用できます。

| プロップ           | 型                                                                                     |   必須 | 説明                                                                                                                                             |
| ------------------ | -------------------------------------------------------------------------------------- | -----: | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `width` / `height` | `number`                                                                               |   はい | カスタム描画領域のサイズ。非負の有限数値。                                                                                                       |
| `draw`             | `(context: CanvasRenderingContext2D, size: { width: number; height: number }) => void` |   はい | 領域内で同期描画を実行。`size` に幅と高さを提供。                                                                                                |
| `onClick`          | `(event: CustomDrawClickEvent) => void`                                                | いいえ | クリックコールバック。`x`/`y` はコンポーネントローカル座標、`canvasX`/`canvasY` は Canvas 論理座標で、サイズと `pointerId` も提供されます。      |
| `hitTest`          | `(x: number, y: number, size: CustomDrawSize) => boolean`                              | いいえ | カスタムヒットテスト。省略時は幅と高さで構成される矩形全体を使います。`false` を返すと下のレイヤーのコンポーネントのヒットテストが続行されます。 |

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

呼び出しのたびに Canvas の描画状態が分離され、コールバック内で設定した色、線幅、变换などが他のコンポーネントに漏れることはありません。コールバック内では描画のみを行い、UI 状態の更新や副作用は行わないでください。描画時のエラーはそのまま送出されます。

### `<Group>`

子コンポーネントのグループ化、位置指定、变换に使用します。[共通プロップ](#共通プロップ)に加え：

| プロップ | 型                                                                 | 説明                          |
| -------- | ------------------------------------------------------------------ | ----------------------------- |
| 子要素   | React children / Vue・Svelte スロット / Angular content projection | 子 Canvas UI コンポーネント。 |

```tsx
<Group x={20} y={30} scaleX={1.2}>
    <Text x={10} y={10}>
        グループ内のテキスト
    </Text>
</Group>
```

### `<Grid>`

指定した列数を超えると次の行に折り返しつつ、子を順に固定サイズセルへ配置します。`Grid` は背景を描画せず、`Group` のように变换プロップが使えるレイアウトコンテナです。

| プロップ     | 型                            |   必須 | デフォルト | 説明                                                                                                                                       |
| ------------ | ----------------------------- | -----: | ---------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `columns`    | `number`                      |   はい |          — | 1 行あたりの列数。正の整数。                                                                                                               |
| `width`      | `number`                      | いいえ |          — | Grid 全体の幅。`cellWidth` 未指定時は必須。列間 gap を差し引いた残りを等分します。`cellWidth` 指定時は省略可で、幅は列数から算出されます。 |
| `height`     | `number`                      | いいえ |          — | 固定表示高さ。はみ出した内容はトリミングされスクロールバーが表示されます。Grid 内でホイールスクロールが可能。                              |
| `cellWidth`  | `number`                      | いいえ |          — | セルの論理幅を固定。指定時は `width` 自動等分より優先されます。正の数。                                                                    |
| `cellHeight` | `number`                      |   はい |          — | セルの論理高さ。正の数。                                                                                                                   |
| `gap`        | `number`                      | いいえ |        `0` | 行・列の共通間隔。負値不可。                                                                                                               |
| `onScroll`   | `(scrollTop: number) => void` | いいえ |          — | スクロール位置変化コールバック。単位は論理ピクセル。                                                                                       |

直接の子は自身の `x`、`y` を保持し、配置セルのオフセットが加算されます。`cellWidth` 未指定時は `(width - gap * (columns - 1)) / columns` で等幅列を算出します。子自身のサイズは自動的に引き伸ばされません。

各子ノードには占有するセルのボックスも渡されます。`width` と `maxLines` を未指定の `<Text>` はセル幅で改行し、`cellHeight` に収まらない分を省略記号で打ち切ります。`<GridItem>` はスパン後の領域を内部のコントロールに引き渡します。いずれかを明示すればセルのボックスより常に優先されるため、セルより意図的に狭くできます。

```tsx
<Grid columns={3} cellWidth={100} cellHeight={50} gap={8}>
    <Rect width={80} height={40} color="#f5f8fc" />
    <Rect width={80} height={40} color="#e5efff" />
    <Rect width={80} height={40} color="#d5e5ff" />
</Grid>
```

総幅を等分する場合は `cellWidth` を省略します：

```tsx
<Grid columns={3} width={316} cellHeight={50} gap={8}>
    <Rect width={80} height={40} color="#f5f8fc" />
    <Rect width={80} height={40} color="#e5efff" />
    <Rect width={80} height={40} color="#d5e5ff" />
</Grid>
```

Vue・Svelte は同じプロップ名を使用。Angular は `<canvas-grid [columns]="3" [width]="316" [cellHeight]="50" [gap]="8">` のように書き、対応するモジュールで `Grid` をインポートします。

`Grid` に `height` を設定すると、内容がビューポートを超える場合にホイールでスクロールでき、子は固定高さ内にトリミングされます：

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

`GridItem` は Grid 内のグループ／レイアウトノードで、それ自体は描画されません。複数のコントロールを含めて 1 つのグリッド項目としてまとめて配置できます。グループ内の子は引き続き各自のサイズとローカル座標を使います。`Grid` 直下に通常のコントロールを置いた場合は、デフォルトで 1 セルを占有します。

| プロップ                                     | 型       | デフォルト | 説明                                              |
| -------------------------------------------- | -------- | ---------: | ------------------------------------------------- |
| `columnSpan`                                 | `number` |        `1` | 占有する列数。正の整数で Grid の `columns` 以下。 |
| `rowSpan`                                    | `number` |        `1` | 占有する行数。正の整数。                          |
| `backgroundColor`                            | `string` |          — | Grid 項目の背景色。スパン範囲を覆います。         |
| `x` / `y`                                    | `number` |        `0` | グリッドセル起点からのオフセット。                |
| `rotation` / `scaleX` / `scaleY` / `visible` | —        |          — | `Group` と同じ变换と表示プロップ。                |

Grid は行優先で項目を配置し、スパン済みのセルはスキップします：

```tsx
<Grid columns={3} width={316} cellHeight={50} gap={8}>
    <GridItem columnSpan={2}>
        <Rect width={180} height={40} color="#f5f8fc" />
        <Text x={8} y={8}>
            2 列にまたがるグループ
        </Text>
    </GridItem>
    <Rect width={80} height={40} color="#e5efff" />
</Grid>
```

Vue・Svelte は同じ `<GridItem>` を使用。Angular は `<canvas-grid-item [columnSpan]="2">...</canvas-grid-item>` のように書き、対応するモジュールで `GridItem` をインポートします。

### `<Image>`

`src` から画像を読み込み、Canvas の指定サイズに描画します。`objectFit` は `contain`（デフォルト）、`cover`、`fill`、`none`、`scale-down` に対応。読み込み失敗時は `onError(error)` を呼び出します。Angular ではエラーコールバックに `(imageError)` イベントバインディングを使います。

| プロップ           | 型                                                         |   必須 | デフォルト  | 説明                                 |
| ------------------ | ---------------------------------------------------------- | -----: | ----------- | ------------------------------------ |
| `src`              | `string`                                                   |   はい | —           | 画像 URL。                           |
| `width` / `height` | `number`                                                   |   はい | —           | Canvas 論理サイズ。                  |
| `objectFit`        | `"contain" \| "cover" \| "fill" \| "none" \| "scale-down"` | いいえ | `"contain"` | 画像のスケーリングとトリミング方法。 |
| `onError`          | `(error: Error) => void`                                   | いいえ | —           | 画像読み込み失敗時のコールバック。   |

```tsx
<Image x={16} y={16} src="/avatar.png" width={96} height={96} objectFit="cover" />
```

リモート画像は通常通り描画できますが、Canvas のエクスポートにはブラウザの CORS ルールが適用されます。画像サーバーがクロスオリジンを認可していない場合、その画像を含む Canvas は PNG としてエクスポートできないことがあります。

### `<Progress>`

インタラクティブでないプログレスバーを描画します。`value` は `min` から `max` の範囲にクランプされます。

| プロップ                             | 型        |   デフォルト | 説明                                             |
| ------------------------------------ | --------- | -----------: | ------------------------------------------------ |
| `value`                              | `number`  |         必須 | 現在の進捗値。                                   |
| `min` / `max`                        | `number`  |  `0` / `100` | 進捗の範囲。                                     |
| `width` / `height`                   | `number`  | `200` / `12` | トラックサイズ。                                 |
| `color` / `trackColor` / `textColor` | `string`  |     テーマ色 | 進捗・トラック・テキストの色。明示指定が優先。   |
| `borderRadius`                       | `number`  |   高さの半分 | 角丸半径。                                       |
| `showText`                           | `boolean` |      `false` | トラック右側にパーセンテージを描画するかどうか。 |

### `<Carousel>` と `<CarouselItem>`

`Carousel` は子要素順に 1 つの `CarouselItem` を表示し、自動送信中はループや前後矢印、下部インジケーターで切り替えられます。子内容は任意の Canvas UI コンポーネント可。`activeIndex` を明示しない場合は非制御モードで、デフォルトは 0 番目です。

| コンポーネント | プロップ                  | 型                        | デフォルト | 説明                                                                 |
| -------------- | ------------------------- | ------------------------- | ---------- | -------------------------------------------------------------------- |
| `Carousel`     | `width` / `height`        | `number`                  | 必須       | .Carousel のビューポートサイズ。はみ出した内容はトリミングされます。 |
| `Carousel`     | `activeIndex`             | `number`                  | —          | 制御された現在のインデックス。`onChange` と組み合わせて更新します。  |
| `Carousel`     | `defaultActiveIndex`      | `number`                  | `0`        | 非制御時の初期インデックス。                                         |
| `Carousel`     | `autoplay`                | `boolean`                 | `true`     | 自動送信中。項目が 2 件未満のときは自動で切り替わりません。          |
| `Carousel`     | `interval`                | `number`                  | `3000`     | 自動切り替え間隔（ミリ秒）。最小は `250` ms として扱われます。       |
| `Carousel`     | `transitionDuration`      | `number`                  | `450`      | 横スライド遷移時間（ミリ秒）。`0` で即時切り替え。                   |
| `Carousel`     | `loop`                    | `boolean`                 | `true`     | 末尾から先頭へループするかどうか。                                   |
| `Carousel`     | `showArrows` / `showDots` | `boolean`                 | `true`     | 前後矢印・下部インジケーターの表示有無。                             |
| `Carousel`     | `onChange`                | `(index: number) => void` | —          | 現在インデックス変化時のコールバック。                               |
| `CarouselItem` | 子要素                    | Canvas UI コンポーネント  | —          | 現在のスライドで表示する内容。                                       |

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

Angular では `<canvas-carousel>` と `<canvas-carousel-item>` を使用。制御インデックスの変化は `(activeIndexChange)` を利用します。

### `<Tabs>` と `<TabItem>`

`Tabs` は `TabItem` でタブとその Canvas サブツリーを宣言します。デフォルトは先頭の TabItem が選択されます。

| コンポーネント | プロップ                                                           | 型                       | 説明                                                                                               |
| -------------- | ------------------------------------------------------------------ | ------------------------ | -------------------------------------------------------------------------------------------------- |
| `Tabs`         | `width` / `height`                                                 | `number`                 | タブコンテナのサイズ。必須。内容はヘッダーバー下側に表示され、コンテンツ領域にトリミングされます。 |
| `Tabs`         | `activeKey` / `defaultActiveKey`                                   | `string`                 | 制御された選択キー／非制御時の初期キー。                                                           |
| `Tabs`         | `headerHeight`                                                     | `number`                 | ヘッダーバー高さ。デフォルト `40`。                                                                |
| `Tabs`         | `backgroundColor` / `textColor` / `activeColor` / `indicatorColor` | `string`                 | タブバー・テキスト・選択状態・インジケーター線の色。                                               |
| `Tabs`         | `onChange`                                                         | `(key: string) => void`  | タブ切り替え時のコールバック。                                                                     |
| `TabItem`      | `id` / `title`                                                     | `string`                 | タブの一意 ID とタイトル。必須。                                                                   |
| `TabItem`      | `disabled`                                                         | `boolean`                | タブクリックを無効化。                                                                             |
| `TabItem`      | 子要素                                                             | Canvas UI コンポーネント | そのタブの Canvas コンテンツ。                                                                     |

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

Angular では `<canvas-tabs>` と `<canvas-tab-item>` を使用し、選択変化は `(activeKeyChange)` を利用します。

### `<Collapse>` と `<CollapseItem>`

各 `CollapseItem` のヘッダーバーをクリックして展開／折りたたみを切り替え、子要素をパネル内容として扱います。

| コンポーネント | プロップ                                        | 型                         | 説明                                                                                               |
| -------------- | ----------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------- |
| `Collapse`     | `width`                                         | `number`                   | パネル幅。必須。                                                                                   |
| `Collapse`     | `activeKeys` / `defaultActiveKeys`              | `string[]`                 | 制御された展開項目／非制御時の初期展開項目。                                                       |
| `Collapse`     | `accordion`                                     | `boolean`                  | デフォルト `false`。`true` の場合は単一項目のみ展開可。                                            |
| `Collapse`     | `headerHeight`                                  | `number`                   | ヘッダーバー高さ。デフォルト `40`。                                                                |
| `Collapse`     | `backgroundColor` / `textColor` / `borderColor` | `string`                   | すべてのヘッダーバーのデフォルト背景・テキスト・ボーダー色。                                       |
| `Collapse`     | `onChange`                                      | `(keys: string[]) => void` | 展開集合の変化コールバック。                                                                       |
| `CollapseItem` | `id` / `title`                                  | `string`                   | パネルの一意 ID とタイトル。必須。                                                                 |
| `CollapseItem` | `height`                                        | `number`                   | 展開時のコンテンツの高さ。既定は子要素が必要とする高さで、最低 `100`。明示指定が常に優先されます。 |
| `CollapseItem` | `disabled`                                      | `boolean`                  | 展開／折りたたみ禁止。                                                                             |
| `CollapseItem` | `backgroundColor` / `textColor` / `borderColor` | `string`                   | この項目のヘッダーバーの色を上書き。                                                               |

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

Angular では `<canvas-collapse>` と `<canvas-collapse-item>` を使用し、展開変化は `(activeKeysChange)` を利用します。

### `<Dialog>`

確認ダイアログはデフォルトで Canvas 中央にオーバーレイし、マスク、タイトル、コンテンツ領域、組み込みのキャンセル／確認ボタンを描画します。コンテンツ領域には任意の Canvas UI コンポーネントを配置できます。ダイアログが開いている間は、マスクへのクリック透過を防ぐため、その中の Input/Textarea は入力不可になります。

| プロップ                     | 型                       |          デフォルト | 説明                                                                  |
| ---------------------------- | ------------------------ | ------------------: | --------------------------------------------------------------------- |
| `open`                       | `boolean`                |                必須 | ダイアログを表示するか。                                              |
| `width` / `height`           | `number`                 |       `420` / `240` | ダイアログサイズ。                                                    |
| `title`                      | `string`                 |         `"Confirm"` | タイトル。                                                            |
| `confirmText` / `cancelText` | `string`                 | `"OK"` / `"Cancel"` | 組み込みボタンのテキスト。                                            |
| `closeOnBackdrop`            | `boolean`                |              `true` | マスククリックでキャンセルコールバックを発火するか。                  |
| `onConfirm` / `onCancel`     | `() => void`             |                   — | 確認とキャンセルのコールバック。                                      |
| 子要素                       | Canvas UI コンポーネント |                   — | ダイアログのコンテンツ領域。任意の Canvas UI コンポーネントを配置可。 |

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

Angular では `<canvas-dialog>` を使い、`open` 入力と `(confirm)` / `(cancel)` 出力を対応させます。

### `<Rect>`

矩形を描画します。[共通プロップ](#共通プロップ)に対応。

| プロップ      | 型       |      デフォルト | 説明                             |
| ------------- | -------- | --------------: | -------------------------------- |
| `width`       | `number` |           `100` | 幅。                             |
| `height`      | `number` |            `40` | 高さ。                           |
| `color`       | `string` | `"transparent"` | 塗り色。                         |
| `radius`      | `number` |             `0` | 角丸半径。                       |
| `stroke`      | `string` |               — | 線の色。未指定時は描画しません。 |
| `strokeWidth` | `number` |             `1` | 線幅。                           |

### `<Circle>`

円を描画します。[共通プロップ](#共通プロップ)に対応。

| プロップ      | 型       |  デフォルト | 説明                             |
| ------------- | -------- | ----------: | -------------------------------- |
| `radius`      | `number` |        `10` | 半径。                           |
| `color`       | `string` | `"#e74c3c"` | 塗り色。                         |
| `stroke`      | `string` |           — | 線の色。未指定時は描画しません。 |
| `strokeWidth` | `number` |         `1` | 線幅。                           |

### `<Text>`

1 行または自動改行テキストを描画します。ノードは折り返し後の各行が実際に必要とする領域のサイズを報告するため、`<CollapseItem>` などのコンテナは高さを自動調整できます。[共通プロップ](#共通プロップ)に対応。

| プロップ     | 型                              |     デフォルト | 説明                                                                                                                                |
| ------------ | ------------------------------- | -------------: | ----------------------------------------------------------------------------------------------------------------------------------- |
| `text`       | `string`                        |              — | テキスト内容。                                                                                                                      |
| 子内容       | `string \| number`              |              — | 各フレームワークのテンプレートテキストで `text` を代用可。                                                                          |
| `fontSize`   | `number`                        |           `16` | 文字サイズ（論理ピクセル単位）。                                                                                                    |
| `width`      | `number`                        |              — | 最大行幅。超過後は自動改行。中文など等幅文字も計測幅に基づき改行。`<Grid>` 内で未指定時はセル幅を使用。                             |
| `maxLines`   | `number`                        |              — | 表示する最大行数。最終行の超過分は省略記号で切り詰めます。`<Grid>` 内で未指定時はセルに収まる行数を使用し、どちらも不明なら無制限。 |
| `fontFamily` | `string`                        | `"sans-serif"` | フォントファミリ。                                                                                                                  |
| `color`      | `string`                        |       `"#333"` | 文字色。                                                                                                                            |
| `baseline`   | `CanvasTextBaseline`            |        `"top"` | Canvas のテキストベースライン。                                                                                                     |
| `textAlign`  | `"left" \| "center" \| "right"` |       `"left"` | 水平方向の文字揃え。`width` 指定時はテキスト領域に対する配置。                                                                      |

### `<Icon>`

アイコンフォントや外部画像に依存しない、オリジナルの汎用ベクターアイコン。[共通プロップ](#共通プロップ)に対応。

| プロップ      | 型                     |  デフォルト | 説明                                                          |
| ------------- | ---------------------- | ----------: | ------------------------------------------------------------- |
| `name`        | `IconName`             |        必須 | アイコン名。下記一覧を参照。                                  |
| `size`        | `number`               |        `24` | アイコンの幅と高さ。                                          |
| `color`       | `string`               |    `"#333"` | アイコン色。`--canvas-ui-icon-color` でテーマ既定色を設定可。 |
| `variant`     | `"outline" \| "solid"` | `"outline"` | `outline` は線、`solid` は太線と主要図形の塗り。              |
| `strokeWidth` | `number`               |         `2` | アウトライン線幅。ソリッドスタイルは最低 `4`。                |

対応名：`home`、`house`、`building`、`apartment`、`store`、`mapPin`、`map`、`globe`、`compass`、`navigation`、`flag`、`mountain`、`tree`、`leaf`、`flower`、`sun`、`moon`、`cloud`、`rain`、`snow`、`fire`、`water`、`wind`、`car`、`bus`、`train`、`plane`、`bicycle`、`ship`、`rocket`、`truck`、`walk`、`phone`、`message`、`mail`、`bell`、`calendar`、`clock`、`alarm`、`camera`、`image`、`video`、`music`、`microphone`、`headphones`、`play`、`pause`、`stop`、`record`、`volume`、`wifi`、`bluetooth`、`battery`、`signal`、`power`、`monitor`、`laptop`、`tablet`、`keyboard`、`mouse`、`printer`、`folder`、`file`、`document`、`download`、`upload`、`share`、`link`、`search`、`settings`、`sliders`、`menu`、`close`、`check`、`plus`、`minus`、`edit`、`trash`、`copy`、`save`、`lock`、`unlock`、`key`、`user`、`users`、`heart`、`star`、`bookmark`、`cart`、`bag`、`gift`、`creditCard`、`wallet`、`chart`、`pieChart`、`barChart`、`analytics`、`shield`、`warning`、`info`、`help`、`question`、`tag`、`puzzle`、`code`、`database`、`cloudDownload`。

```tsx
<Icon name="search" x={16} y={16} size={28} color="#1677ff" />
<Icon name="heart" x={56} y={16} variant="solid" color="#e74c3c" />
```

### `<Input>`

1 行入力欄。コントロールの見た目は Canvas 上に描画し、透明な HTML input がキーボード・IME・選択範囲を担当します。

| プロップ           | 型                                 |     デフォルト | 説明                                                    |
| ------------------ | ---------------------------------- | -------------: | ------------------------------------------------------- |
| `width` / `height` | `number`                           |   `200` / `36` | コントロールサイズ。                                    |
| `value`            | `string`                           |              — | 制御された入力値。`onChange` と組み合わせて更新します。 |
| `defaultValue`     | `string`                           |           `""` | 非制御時の初期値。                                      |
| `placeholder`      | `string`                           |           `""` | プレースホルダーテキスト。                              |
| `type`             | `"text" \| "password" \| "number"` |       `"text"` | 入力タイプ。パスワードの内容は Canvas 上にドット表示。  |
| `fontSize`         | `number`                           |           `14` | 文字サイズ。                                            |
| `fontFamily`       | `string`                           | `"sans-serif"` | フォントファミリ。                                      |
| `color`            | `string`                           |       `"#333"` | 入力テキストの色。                                      |
| `bgColor`          | `string`                           |       `"#fff"` | 背景色。                                                |
| `borderColor`      | `string`                           |       `"#ccc"` | 通常時のボーダー色。                                    |
| `focusBorderColor` | `string`                           |    `"#3498db"` | フォーカス時のボーダー色。                              |
| `borderRadius`     | `number`                           |            `4` | 角丸半径。                                              |
| `padding`          | `number`                           |            `8` | テキスト内側の余白。                                    |
| `disabled`         | `boolean`                          |        `false` | 入力不可。                                              |
| `maxLength`        | `number`                           |              — | 最大文字数。非負整数が有効。                            |
| `onChange`         | `(value: string) => void`          |              — | 入力変化コールバック。                                  |
| `onFocus`          | `() => void`                       |              — | フォーカス取得時コールバック。                          |
| `onBlur`           | `() => void`                       |              — | フォーカス解除時コールバック。                          |

### `<Textarea>`

複数行テキスト欄。`<Input>` の値・サイズ・スタイル・コールバックプロップを継承し、固定高さを超えると欄内でスクロールでき、スクロールバーも表示されます。`type` には対応しません。追加プロップ：

| プロップ | 型       | 説明                                                                         |
| -------- | -------- | ---------------------------------------------------------------------------- |
| `rows`   | `number` | 期待する行数を表現するために使用可。実際の描画高さは `height` で決まります。 |

```tsx
<Textarea
    width={300}
    height={120}
    value={notes}
    placeholder="複数行の内容を入力"
    onChange={setNotes}
/>
```

### `<Upload>`

ファイル選択ボタンを描画します。組み込みのベクターアイコンとラベルがひとまとまりになり、水平中央に配置されます。クリックするとブラウザのローカルファイル選択ダイアログが開きますが、このコンポーネントはサーバーへのアップロードは行いません。

| プロップ           | 型                        |       デフォルト | 説明                                                                                         |
| ------------------ | ------------------------- | ---------------: | -------------------------------------------------------------------------------------------- |
| `width` / `height` | `number`                  |     `120` / `40` | ボタンサイズ。                                                                               |
| `text`             | `string`                  |  `"Choose File"` | ボタンテキスト。                                                                             |
| `icon`             | `IconName`                |       `"upload"` | ラベルの前に描画される組み込みアイコン。[`<Icon>`](#icon) の任意のアイコン名を指定できます。 |
| `iconSize`         | `number`                  | `fontSize × 1.1` | アイコンサイズ。                                                                             |
| `accept`           | `string`                  |                — | ファイルタイプ絞り込み。例：`"image/*,.pdf"`。                                               |
| `multiple`         | `boolean`                 |          `false` | 複数選択を許可するか。                                                                       |
| `disabled`         | `boolean`                 |          `false` | ファイル選択を無効化。                                                                       |
| `onChange`         | `(files: File[]) => void` |                — | ファイル選択後のコールバック。選択キャンセル時は発火しません。                               |

```tsx
<Upload accept="image/*" multiple onChange={(files) => console.log(files)} />
<Upload icon="cloud" text="Upload Photos" />
```

Angular では `<canvas-upload>` を使い、`(change)` で `File[]` を受け取ります。

### `<Dropdown>`

Canvas で描画されるドロップダウン選択欄。[共通プロップ](#共通プロップ)に対応。

| プロップ           | 型                                |    デフォルト | 説明                                                       |
| ------------------ | --------------------------------- | ------------: | ---------------------------------------------------------- |
| `width` / `height` | `number`                          |  `200` / `36` | コントロールサイズ。                                       |
| `options`          | `Array<string \| DropdownOption>` |          必須 | オプション一覧。文字列オプションは label と value が同じ。 |
| `value`            | `string`                          |             — | 制御された選択値。                                         |
| `defaultValue`     | `string`                          |             — | 非制御時の初期値。                                         |
| `placeholder`      | `string`                          | `"Select..."` | 未選択時に表示するテキスト。                               |
| `disabled`         | `boolean`                         |       `false` | インタラクション無効化。                                   |
| `fontSize`         | `number`                          |          `14` | 文字サイズ。                                               |
| `color`            | `string`                          |      `"#333"` | テキスト色。                                               |
| `bgColor`          | `string`                          |      `"#fff"` | コントロール背景色。                                       |
| `borderColor`      | `string`                          |   `"#c7ccd3"` | 通常時のボーダー色。                                       |
| `focusBorderColor` | `string`                          |   `"#3478f6"` | 展開時のボーダー色。                                       |
| `borderRadius`     | `number`                          |           `4` | 角丸半径。                                                 |
| `onChange`         | `(value: string) => void`         |             — | 選択変化コールバック。                                     |

`DropdownOption` 型：

| プロップ   | 型        | 説明                           |
| ---------- | --------- | ------------------------------ |
| `label`    | `string`  | 表示テキスト。                 |
| `value`    | `string`  | オプション値。                 |
| `disabled` | `boolean` | このオプションを無効化するか。 |

```tsx
<Dropdown
    value={role}
    options={['Admin', { label: 'readOnly', value: 'reader', disabled: false }]}
    onChange={setRole}
/>
```

### `<DatePicker>`

Canvas で描画する日付入力欄。クリックするとブラウザのネイティブピッカーを使用します。

| プロップ           | 型                        |      デフォルト | 説明                                            |
| ------------------ | ------------------------- | --------------: | ----------------------------------------------- |
| `width` / `height` | `number`                  |    `200` / `36` | コントロールサイズ。                            |
| `value`            | `string`                  |               — | 制御された日付値。フォーマットは `YYYY-MM-DD`。 |
| `defaultValue`     | `string`                  |            `""` | 非制御時の初期日付値。                          |
| `placeholder`      | `string`                  | `"Select date"` | 未選択時の表示テキスト。                        |
| `disabled`         | `boolean`                 |         `false` | 日付選択を無効化。                              |
| `onChange`         | `(value: string) => void` |               — | 日付変化コールバック。                          |

### `<Radio>` と `<Checkbox>`

どちらも `options` 配列を受け取ります。Radio は単一選択、Checkbox は複数選択。文字列オプションは label と value が同じになり、`{ label, value, disabled }` オブジェクトも渡せます。

| プロップ           | 型                                                                      |     デフォルト | 説明                   |
| ------------------ | ----------------------------------------------------------------------- | -------------: | ---------------------- |
| `options`          | `Array<string \| ChoiceOption>`                                         |           必須 | オプション一覧。       |
| `value`            | Radio: `string`; Checkbox: `string[]`                                   |              — | 制御された選択値。     |
| `defaultValue`     | Radio: `string`; Checkbox: `string[]`                                   |              — | 非制御時の初期値。     |
| `direction`        | `"horizontal" \| "vertical"`                                            | `"horizontal"` | 選択肢の並び方向。     |
| `width` / `height` | `number`                                                                |       自動計算 | コントロールサイズ。   |
| `onChange`         | Radio: `(value: string) => void`; Checkbox: `(value: string[]) => void` |              — | 選択変化コールバック。 |

```tsx
<Radio options={['Small', 'Medium', 'Large']} value={size} onChange={setSize} />
<Checkbox options={['Email', 'SMS']} value={channels} onChange={setChannels} />
```

Angular では `<canvas-date-picker>`、`<canvas-radio>`、`<canvas-checkbox>` を使用。日付選択は `(valueChange)` または `(change)`、Radio/Checkbox は `(change)` で受け取ります。

### `<Slider>`

スライダー操作。[共通プロップ](#共通プロップ)に対応。

| プロップ           | 型                        |   デフォルト | 説明                           |
| ------------------ | ------------------------- | -----------: | ------------------------------ |
| `width` / `height` | `number`                  | `160` / `32` | スライダーサイズ。             |
| `min` / `max`      | `number`                  |  `0` / `100` | 最小値・最大値。               |
| `step`             | `number`                  |          `1` | ステップ幅。                   |
| `value`            | `number`                  |            — | 制御された値。                 |
| `defaultValue`     | `number`                  |        `min` | 非制御時の初期値。             |
| `disabled`         | `boolean`                 |      `false` | ドラッグ禁止。                 |
| `trackColor`       | `string`                  |  `"#d7dde5"` | トラック色。                   |
| `activeColor`      | `string`                  |  `"#3478f6"` | 選択済みトラックとボーダー色。 |
| `thumbColor`       | `string`                  |     `"#fff"` | つまみ色。                     |
| `onChange`         | `(value: number) => void` |            — | 値変化コールバック。           |

### `<Switch>`

スイッチコントロール。[共通プロップ](#共通プロップ)に対応。

| プロップ           | 型                           |  デフォルト | 説明                   |
| ------------------ | ---------------------------- | ----------: | ---------------------- |
| `width` / `height` | `number`                     | `44` / `24` | スイッチサイズ。       |
| `checked`          | `boolean`                    |           — | 制御されたオン／オフ。 |
| `defaultChecked`   | `boolean`                    |     `false` | 非制御時の初期値。     |
| `disabled`         | `boolean`                    |     `false` | 切り替え禁止。         |
| `onColor`          | `string`                     | `"#3478f6"` | オン時トラック色。     |
| `offColor`         | `string`                     | `"#c7ccd3"` | オフ時トラック色。     |
| `thumbColor`       | `string`                     |    `"#fff"` | つまみ色。             |
| `onChange`         | `(checked: boolean) => void` |           — | 状態変化コールバック。 |

### `<Button>`

Canvas で描画するボタン。[共通プロップ](#共通プロップ)に対応。

| プロップ           | 型                 |   デフォルト | 説明                                         |
| ------------------ | ------------------ | -----------: | -------------------------------------------- |
| `width` / `height` | `number`           | `120` / `40` | ボタンサイズ。                               |
| 子内容             | `string \| number` |            — | ボタンテキスト。`text` でも代用可。          |
| `text`             | `string`           |            — | ボタンテキスト。両方指定時は `text` が優先。 |
| `fontSize`         | `number`           |         `15` | 文字サイズ。                                 |
| `fontColor`        | `string`           |     `"#fff"` | テキスト色。                                 |
| `backgroundColor`  | `string`           |  `"#3478f6"` | 背景色。                                     |
| `borderColor`      | `string`           |            — | 線の色。                                     |
| `borderRadius`     | `number`           |          `6` | 角丸半径。                                   |
| `disabled`         | `boolean`          |      `false` | ボタン無効化。                               |
| `onClick`          | `() => void`       |            — | クリックコールバック。                       |

## 画像エクスポート

`CanvasHandle` が提供する `ref` 経由で画像をエクスポートします：

```tsx
const canvasRef = useRef<CanvasHandle>(null);

// PNG Data URL — img.src に直接設定可能
const dataUrl = canvasRef.current?.toDataURL({
    type: 'image/png',
    width: 840,
    height: 600,
    pixelRatio: 2,
});

// JPEG Blob — ダウンロードリンク作成やアップロードに使用
const blob = await canvasRef.current?.toBlob({
    type: 'image/jpeg',
    quality: 0.9,
    pixelRatio: 2,
});

// 内部の HTMLCanvasElement を取得
const canvasElement = canvasRef.current?.getCanvas();
```

`CanvasExportOptions` パラメータ：

| プロップ     | 型       |             デフォルト | 説明                                                                                                              |
| ------------ | -------- | ---------------------: | ----------------------------------------------------------------------------------------------------------------- |
| `width`      | `number` |   現在の Canvas 論理幅 | エクスポート画像の論理幅。                                                                                        |
| `height`     | `number` | 現在の Canvas 論理高さ | エクスポート画像の論理高さ。                                                                                      |
| `pixelRatio` | `number` |    Canvas のピクセル比 | 出力ピクセル密度。最終ビットマップサイズは `width × pixelRatio` と `height × pixelRatio` の約値。                 |
| `type`       | `string` |          `"image/png"` | 画像 MIME タイプ（`image/png`、`image/jpeg`、`image/webp` など）。ブラウザが未対応の形式は PNG にフォールバック。 |
| `quality`    | `number` |         ブラウザ既定値 | 非可逆形式の品質。範囲 `0`〜`1`。PNG では通常使用されません。                                                     |

簡易引数も従来通りサポートされます：

```tsx
canvasRef.current?.toDataURL('image/png');
const jpegBlob = await canvasRef.current?.toBlob('image/jpeg', 0.9);
```

エクスポートサイズとピクセル比は正の数値でなければなりません。シーン内で使用しているクロスオリジン画像が CORS 認可されていない場合、`toDataURL()` は理由付きのエラーを投げ、`toBlob()` は同じエラーで Promise を reject します。画像サーバーで現在サイトを許可する `Access-Control-Allow-Origin` を返すよう設定するか、該当画像を除去してからエクスポートしてください。

## ファイル構成

| ファイル              | 用途                                                                                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `react/`              | React コンポーネントと Canvas コンテナアダプター。                                                                                                                     |
| `vue/`                | Vue 3 コンポーネントと Canvas コンテナアダプター。                                                                                                                     |
| `svelte/`             | Svelte 5+ コンポーネントアダプターとテンプレートコンポーネント。                                                                                                       |
| `angular/`            | Angular standalone の Canvas コンポーネントとシーンディレクティブ。                                                                                                    |
| `components/`         | 共有コンポーネント実装。各コンポーネントは専用ディレクトリを持ち、エントリと Props／描画関数を分離し、必要に応じてインタラクションロジックを `logic.ts` に配置します。 |
| `components/index.ts` | コンポーネント統一エクスポートとサブツリーコンパイル。                                                                                                                 |
| `components/types.ts` | すべての公開 Props 型を集約。                                                                                                                                          |
| `theme.css`           | Canvas コンポーネントのライト／ダーク CSS テーマ変数。                                                                                                                 |
| `types.ts`            | コンポーネント Props 集約、シーンノード、入力ブリッジ型。                                                                                                              |
| `engine.ts`           | シーン同期、入力ブリッジ、ヒットテスト、コントロールインタラクション。                                                                                                 |
| `renderer.ts`         | シーントラバースと Canvas 描画ディスパッチ。                                                                                                                           |
| `input-bridge.ts`     | Input/Textarea の透明 HTML 入力ブリッジ。                                                                                                                              |
| `types.ts`            | シーン、Canvas、ブリッジ関連の型。                                                                                                                                     |

見た目のみを変更する場合は、まず対応する `components/<Component>/<component>.ts` の描画関数を編集してください。コンポーネント固有のインタラクションロジックは同じディレクトリの `logic.ts` に配置します。汎用的なレイアウト・イベント・エクスポート挙動を変更する場合のみ、対応アダプターや `engine.ts`、`renderer.ts` を編集してください。
