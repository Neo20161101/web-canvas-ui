# Web Canvas UI (React, Vue 3, Svelte, Angular)

[English](./README.md) · [日本語](./README.ja.md) · [한국어](./README.ko.md) · [繁體中文](./README.zh-TW.md) · [Русский](./README.ru.md) · [简体中文](./README.zh-CN.md)

Декларативная библиотека компонентов на базе Canvas 2D с адаптерами для **React**, **Vue 3**, **Svelte 5+** и **Angular 17+**. Каждый фреймворк импортируется из собственного входа и использует нативный синтаксис компонентов/шаблонов; движок Canvas и логика отрисовки контролов — общие. Внешний вид контролов рисуется самим Canvas.

> **Про адаптеры:** React, Vue, Svelte и Angular импортируются из `/canvas-ui/react`, `/canvas-ui/vue`, `/canvas-ui/svelte` и `/canvas-ui/angular` соответственно. Выбирайте вход под ваш основной Canvas-фреймворк и не смешивайте компоненты из разных адаптеров — все они повторно используют один и тот же движок и реализацию отрисовки.

> **Общий контракт компонентов:** Каждый контрол находится в каталоге `components/<Component>/`. `index.ts` экспортирует публичный API компонента, `<component>.ts` определяет тип Props и функцию отрисовки на Canvas, а `logic.ts` (при необходимости) хранит логику взаимодействия, специфичную для этого контрола. Общие типы собраны в `components/types.ts` и реэкспортируются через `/canvas-ui/types.ts`. Адаптеры React, Vue, Svelte и Angular используют один и тот же типовой контракт.

При добавлении нового контрола создайте для него отдельный каталог и экспортируйте публичный API из индекса каталога. При добавлении Prop синхронизируйте `CanvasComponentProps` и маппинг атрибутов во всех адаптерах фреймворков.

## Глобальные цвета темы

Цвета темы сосредоточены в [`theme.scss`](src/canvas-ui/theme.scss) в переменной `$primary: #1668dc`. Изменение одной этой переменной обновляет акцентные цвета кнопок, выбранных состояний, рамок фокуса, индикаторов прогресса и т. д. Светлые оттенки получаются смешиванием primary с белым, «нажатые» — снижением светлости primary; общие оттенки также публикуются как CSS-переменные `--canvas-ui-primary*`. `theme.css` — артефакт сборки: импортируйте его как глобальный CSS и не редактируйте сгенерированный файл напрямую:

```css
@import '/canvas-ui/theme.css';
```

После изменения `theme.scss` выполните `npm run build:theme`, чтобы перегенерировать CSS. Скомпилированные CSS custom properties применимы в React, Vue, Svelte и Angular и обеспечивают тёмные темы `.dark` и `[data-theme="dark"]`. Явно переданный компоненту цвет имеет приоритет над переменными темы.

Встроены пять палитр primary: синий, зелёный, фиолетовый, оранжевый и красный. Добавьте соответствующий класс к внешнему контейнеру Canvas, чтобы сменить палитру; их можно комбинировать с тёмной темой:

```tsx
<div className="theme-green">
    <Canvas width={400} height={240}>
        <Button>Green theme</Button>
    </Canvas>
</div>
```

| Палитра              | class          | Primary   |
| -------------------- | -------------- | --------- |
| Синяя (по умолчанию) | `theme-blue`   | `#1668dc` |
| Зелёная              | `theme-green`  | `#389e0d` |
| Фиолетовая           | `theme-purple` | `#722ed1` |
| Оранжевая            | `theme-orange` | `#d46b08` |
| Красная              | `theme-red`    | `#cf1322` |

Например, одновременное добавление `dark` и `theme-purple` — или `data-theme="dark"` и `theme-purple` — включает фиолетовую тёмную тему. Во всех палитрах светлые/нажатые/тёмные акценты Sass выводит автоматически на основе соответствующего primary.

| Компонент                     | CSS custom properties                                                                                                                                                                                                                                                                                |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button / Upload               | `--canvas-ui-button-background`, `--canvas-ui-button-color`, `--canvas-ui-button-border`, `--canvas-ui-button-pressed-background`, `--canvas-ui-button-disabled-background`, `--canvas-ui-button-disabled-color`                                                                                     |
| Carousel                      | `--canvas-ui-carousel-arrow`, `--canvas-ui-carousel-dot`, `--canvas-ui-carousel-active-dot`                                                                                                                                                                                                          |
| Radio / Checkbox              | `--canvas-ui-choice-active`, `--canvas-ui-choice-border`, `--canvas-ui-choice-color`, `--canvas-ui-choice-disabled`, `--canvas-ui-choice-disabled-background`                                                                                                                                        |
| Collapse                      | `--canvas-ui-collapse-header-background`, `--canvas-ui-collapse-border`, `--canvas-ui-collapse-color`, `--canvas-ui-collapse-disabled-color`                                                                                                                                                         |
| Dialog                        | `--canvas-ui-dialog-mask`, `--canvas-ui-dialog-background`, `--canvas-ui-dialog-title-color`, `--canvas-ui-dialog-border`, `--canvas-ui-dialog-confirm-background`, `--canvas-ui-dialog-cancel-background`, `--canvas-ui-dialog-confirm-color`, `--canvas-ui-dialog-cancel-color`                    |
| Dropdown                      | `--canvas-ui-dropdown-background`, `--canvas-ui-dropdown-color`, `--canvas-ui-dropdown-placeholder-color`, `--canvas-ui-dropdown-border`, `--canvas-ui-dropdown-focus-border`, `--canvas-ui-dropdown-option-background`, `--canvas-ui-dropdown-option-border`, `--canvas-ui-dropdown-disabled-color` |
| Input / Textarea / DatePicker | `--canvas-ui-input-background`, `--canvas-ui-input-color`, `--canvas-ui-input-placeholder-color`, `--canvas-ui-input-border`, `--canvas-ui-input-focus-border`                                                                                                                                       |
| Progress                      | `--canvas-ui-progress-track`, `--canvas-ui-progress-active`, `--canvas-ui-progress-text`                                                                                                                                                                                                             |
| Rect / Circle / Text / Icon   | `--canvas-ui-rect-background`, `--canvas-ui-rect-border`, `--canvas-ui-circle-background`, `--canvas-ui-circle-border`, `--canvas-ui-text-color`, `--canvas-ui-icon-color`                                                                                                                           |
| Slider                        | `--canvas-ui-slider-track`, `--canvas-ui-slider-active`, `--canvas-ui-slider-thumb`, `--canvas-ui-slider-disabled-thumb`                                                                                                                                                                             |
| Switch                        | `--canvas-ui-switch-on`, `--canvas-ui-switch-off`, `--canvas-ui-switch-thumb`                                                                                                                                                                                                                        |
| Tabs                          | `--canvas-ui-tabs-background`, `--canvas-ui-tabs-color`, `--canvas-ui-tabs-active-color`, `--canvas-ui-tabs-indicator`, `--canvas-ui-tabs-disabled-color`                                                                                                                                            |

Чтобы настроить тему отдельного приложения, переопределите нужные переменные в своём CSS, например `.brand { --canvas-ui-button-background: #6d4aff; }`. В таблице выше перечислены все переменные темы, которые реально читают компоненты.

## Окружение и импорт

Поместите каталог `/canvas-ui/` в проект и убедитесь, что основной Canvas-проект уже настроен под выбранный фреймворк: React 19+, Vue 3, Svelte 5+ или Angular 17+. Vue использует шаблоны однофайловых компонентов — JSX-плагин и `jsxImportSource` не нужны. Для Svelte требуются компилятор Svelte и соответствующий сборочный плагин. Для Angular требуются `@angular/core` и конфигурация сборки Angular. Зависимости фреймворка предоставляет основной Canvas-проект; этот каталог не навязывает зависимости к другим фреймворкам.

| Фреймворк   | Вход                 |
| ----------- | -------------------- |
| React       | `/canvas-ui/react`   |
| Vue 3       | `/canvas-ui/vue`     |
| Svelte 5+   | `/canvas-ui/svelte`  |
| Angular 17+ | `/canvas-ui/angular` |

Компоненты должны находиться внутри Canvas-контейнера соответствующего адаптера и использовать компонентные сцены, экспортируемые из входа данного фреймворка. Не помещайте обычные DOM-элементы внутрь Canvas-сцены.

## Быстрый старт (React)

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

`x` и `y` — позиция компонента относительно родителя, в логических пикселях Canvas. `Group` можно вкладывать; координаты дочерних элементов накапливают позицию, масштаб и поворот родителя.

## Быстрый старт (Vue 3 SFC)

Vue-адаптер расположен в отдельном входе `/canvas-ui/vue`. Встраивайте компоненты Canvas UI прямо в шаблон `.vue`-файла — TSX, JSX-плагины и ручная сборка массивов узлов Canvas не нужны:

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

В шаблоне Vue связывайте реактивное состояние через `:value` и обновляйте через `@change`; компоненты Canvas синхронизируют сцену после обновления Vue.

## Быстрый старт (Svelte 5+)

Используйте компоненты, экспортируемые из Svelte-входа, в шаблонах Svelte 5. Через `bind:this` на `Canvas` доступны экспортные методы:

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

Изменения props у Svelte-контролов синхронизируются со сценой Canvas;

## Быстрый старт (Angular 17+)

Angular-вход предоставляет standalone-компонент `Canvas` и директивы сцены. Импортируйте нужные символы в standalone-компоненте, где они используются:

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

Angular объявляет узлы Canvas-сцены через селекторы директив `<canvas-...>`. Поля ввода, дропдауны и слайдеры отдают `(valueChange)`, переключатель — `(checkedChange)`, кнопки — `(click)`.

Параметры взаимодействия передаются согласно конвенциям фреймворка: React использует props `onChange`/`onClick`, Vue — `@change`/`@click`, Svelte — колбэк-пропсы `onChange`/`onClick`, Angular — выходы `(valueChange)`, `(checkedChange)` и `(click)`.

## Общие свойства

Все видимые компоненты, кроме `Canvas`, поддерживают следующие transform-свойства:

| Свойство   | Тип       | По умолчанию | Описание                                                                                      |
| ---------- | --------- | -----------: | --------------------------------------------------------------------------------------------- |
| `x`        | `number`  |          `0` | Горизонтальная позиция относительно родителя.                                                 |
| `y`        | `number`  |          `0` | Вертикальная позиция относительно родителя.                                                   |
| `rotation` | `number`  |          `0` | Поворот в радианах.                                                                           |
| `scaleX`   | `number`  |          `1` | Горизонтальное масштабирование.                                                               |
| `scaleY`   | `number`  |          `1` | Вертикальное масштабирование.                                                                 |
| `visible`  | `boolean` |       `true` | Отрисовывать ли компонент; при `false` дочерние элементы тоже скрыты и не реагируют на клики. |

### Правила размеров

- `Rect`, `Input`, `Textarea`, `Upload`, `Dropdown`, `DatePicker`, `Slider`, `Switch`, `Button` задают размер через `width` и `height`.
- `Circle` использует `radius` (по умолчанию `10`); диаметр равен удвоенному радиусу.
- `Text` использует `fontSize` для кегля и `width` — для ширины переноса строк.
- Если `width`/`height` не заданы, применяются значения из документации конкретного компонента. `Group` — контейнер без собственных размеров; `Grid` выполняет раскладку по числу столбцов и свойствам ячеек.
- `Grid` расставляет детей по порядку; задайте `columns`, `cellHeight` и опциональный `gap`. Ширину ячейки можно зафиксировать через `cellWidth` либо распределить через `width`. Дочерние компоненты по умолчанию занимают по одной ячейке; `GridItem` группирует несколько контролов и задаёт colspan/rowspan — размеры контролов внутри группы по-прежнему определяются их собственными свойствами.

## Параметры компонентов

### `<Canvas>`

Создаёт Canvas-сцену. Размеры задаются в логических пикселях, а итоговый bitmap умножается на pixel ratio.

| Свойство                                           | Тип                                                                              | Обязательное |                                                                          По умолчанию | Описание                                                                                                   |
| -------------------------------------------------- | -------------------------------------------------------------------------------- | -----------: | ------------------------------------------------------------------------------------: | ---------------------------------------------------------------------------------------------------------- |
| `width`                                            | `number`                                                                         |           да |                                                                                     — | Логическая ширина Canvas.                                                                                  |
| `height`                                           | `number`                                                                         |           да |                                                                                     — | Логическая высота Canvas.                                                                                  |
| Pixel ratio                                        | автоматически                                                                    |            — | автоматически берётся `window.devicePixelRatio`, минимум `1`; свойство не передаётся. | Соотношение разрешения отрисовки Canvas.                                                                   |
| `className` (React/Angular) / `class` (Vue/Svelte) | `string`                                                                         |          нет |                                                                                     — | CSS-класс внешнего контейнера.                                                                             |
| `style`                                            | объект или строка стиля соответствующего фреймворка                              |          нет |                                                                                     — | Стиль внешнего контейнера; `position`, `width`, `height` задаёт компонент.                                 |
| `ariaLabel`                                        | `string`                                                                         |          нет |                                                                            `"Canvas"` | Доступность-метка Canvas.                                                                                  |
| `onFrame`                                          | `(time: number) => void`                                                         |          нет |                                                                                     — | Колбэк каждого кадра; `time` — timestamp кадра браузера.                                                   |
| `onEvent`                                          | `(event: CanvasUIEvent) => void`                                                 |          нет |                                                                                     — | Единая точка событий Canvas: `pointerdown`, `pointermove`, `pointerup`, `pointercancel`, `click`, `wheel`. |
| Дети                                               | React children / Vue default slot / Svelte children / Angular content projection |          нет |                                                                                     — | Дерево компонентов Canvas UI.                                                                              |

События `onEvent` содержат логические координаты Canvas `x`/`y`, поле `target` с типом компонента и пользовательским `key` (`null`, если попали в пустое место) и локальные координаты `localX`/`localY` внутри попавшего компонента. В `wheel` дополнительно передаётся `deltaY`, в pointer-событиях — `pointerId`. Единый `click` генерируется только если нажатие и отпускание произошло на одном и том же объекте и смещение не превысило 8 логических пикселей; перетаскивание и отмена клика не порождают `click`. Существующие колбэки компонентов (`onClick`, `onChange` и т. д.) продолжают работать как обычно; `onEvent` удобно использовать для межкомпонентной бизнес-логики и сквозной аналитики.

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

Доступ к API снимков получается через React ref, Vue template ref, Svelte `bind:this` или Angular template reference — см. [Экспорт изображений](#экспорт-изображений). `CanvasHandle` также предоставляет `requestRender()` для запроса перерисовки после обновления исходного Canvas.

### `<CanvasView>`

Рисует содержимое стороннего `HTMLCanvasElement` с той же страницы в текущем Canvas. Встраивается только пиксельная картинка — DOM и обработчики событий исходного Canvas в текущий не переносятся.

| Свойство           | Тип                                       | Обязательное | По умолчанию | Описание                                                                                                                                                             |
| ------------------ | ----------------------------------------- | -----------: | -----------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`           | `HTMLCanvasElement`                       |           да |            — | Экземпляр исходного Canvas.                                                                                                                                          |
| `width` / `height` | `number`                                  |           да |            — | Логический размер в текущем Canvas.                                                                                                                                  |
| `fit`              | `'contain' \| 'cover' \| 'fill'`          |          нет |  `'contain'` | Сохранить пропорции целиком, обрезать с сохранением пропорций или растянуть.                                                                                         |
| `onPointerEvent`   | `(event: CanvasViewPointerEvent) => void` |          нет |            — | Возвращает сопоставленные `pointerdown`, `pointermove`, `pointerup`, `pointercancel`, `click`; синтетические события в исходный Canvas автоматически не рассылаются. |

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

// После обновления стороннего Canvas запросите перерисовку основного:
canvasRef.current?.requestRender();
```

События содержат `x`/`y` (локальные логические координаты CanvasView), `sourceX`/`sourceY` (пиксельные координаты исходного Canvas), размеры исходного холста, состояние кнопок, `pointerId`, `pointerType`, `pressure` и `isPrimary`. Пустые поля `contain` не создают hit-событий. Во время перетаскивания события продолжают сообщать координаты в исходном Canvas, даже если указатель вышел за границы. Используйте эти данные для вызова API взаимодействия сторонней библиотеки. Исходный Canvas не уведомляет основной Canvas об изменениях автоматически — вызывайте `requestRender()` основного после обновления источника, либо делайте это внутри animation frame. Если в исходном Canvas есть изображение без CORS-разрешения, основной Canvas будет «загрязнён» и экспорт тоже завершится ошибкой — ограничения кросс-доменного Canvas этим компонентом не обходятся.

### `<CustomDraw>`

Когда встроенных компонентов недостаточно, используйте `CustomDraw` с колбэком отрисовки Canvas 2D. Он выполняется при каждой перерисовке сцены (включая экспорт изображений); начало координат колбэка — левый верхний угол компонента, доступны общие свойства позиции, поворота и масштаба.

| Свойство           | Тип                                                                                    | Обязательное | Описание                                                                                                                                               |
| ------------------ | -------------------------------------------------------------------------------------- | -----------: | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `width` / `height` | `number`                                                                               |           да | Размер области пользовательской отрисовки; неотрицательные конечные числа.                                                                             |
| `draw`             | `(context: CanvasRenderingContext2D, size: { width: number; height: number }) => void` |           да | Выполняет синхронную отрисовку внутри области; `size` содержит ширину и высоту.                                                                        |
| `onClick`          | `(event: CustomDrawClickEvent) => void`                                                |          нет | Колбэк клика; `x`/`y` — локальные координаты, `canvasX`/`canvasY` — логические координаты Canvas, дополнительно передаются размеры и `pointerId`.      |
| `hitTest`          | `(x: number, y: number, size: CustomDrawSize) => boolean`                              |          нет | Пользовательский hit test для фигуры; если не задан, используется весь прямоугольник. Возврат `false` передаёт проверку компонентам нижележащего слоя. |

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

Каждый вызов изолирует состояние отрисовки Canvas: цвета, толщина линии, transform внутри колбэка не «протекают» в другие компоненты. Внутри колбэка только рисуйте — не обновляйте UI-состояние и не выполняйте побочные эффекты. Ошибки отрисовки пробрасываются как есть.

### `<Group>`

Группирует, позиционирует и трансформирует детей. Поддерживает [общие свойства](#общие-свойства), а также:

| Свойство | Тип                                                           | Описание                       |
| -------- | ------------------------------------------------------------- | ------------------------------ |
| Дети     | React children / Vue/Svelte slot / Angular content projection | Дочерние Canvas UI компоненты. |

```tsx
<Group x={20} y={30} scaleX={1.2}>
    <Text x={10} y={10}>
        Текст внутри группы
    </Text>
</Group>
```

### `<Grid>`

Раскладывает детей по порядку в ячейки фиксированного размера, перенося строки по указанному числу столбцов. `Grid` не рисует фон — это контейнер раскладки, принимающий transform-свойства как `Group`.

| Свойство     | Тип                           | Обязательное | По умолчанию | Описание                                                                                                                                                                 |
| ------------ | ----------------------------- | -----------: | -----------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `columns`    | `number`                      |           да |            — | Столбцов в строке; положительное целое.                                                                                                                                  |
| `width`      | `number`                      |          нет |            — | Полная ширина Grid. Обязательна без `cellWidth`; распределяется равномерно за вычетом gap'ов. Может быть опущена при `cellWidth` — ширина вычисляется из числа столбцов. |
| `height`     | `number`                      |          нет |            — | Фиксированная видимая высота. Лишнее обрезается, появляется полоса прокрутки; колесо мыши работает внутри Grid.                                                          |
| `cellWidth`  | `number`                      |          нет |            — | Фиксированная логическая ширина ячейки; имеет приоритет над автораспределением `width`. Положительное число.                                                             |
| `cellHeight` | `number`                      |           да |            — | Логическая высота ячейки; положительное число.                                                                                                                           |
| `gap`        | `number`                      |          нет |          `0` | Одинаковый интервал по строкам и столбцам; не отрицательный.                                                                                                             |
| `onScroll`   | `(scrollTop: number) => void` |          нет |            — | Колбэк изменения позиции прокрутки в логических пикселях.                                                                                                                |

Дочерние компоненты сохраняют свои `x`, `y`, к которым добавляется смещение ячейки. Без `cellWidth` ширина столбцов считается как `(width - gap * (columns - 1)) / columns`; размеры детей автоматически не растягиваются.

```tsx
<Grid columns={3} cellWidth={100} cellHeight={50} gap={8}>
    <Rect width={80} height={40} color="#f5f8fc" />
    <Rect width={80} height={40} color="#e5efff" />
    <Rect width={80} height={40} color="#d5e5ff" />
</Grid>
```

Чтобы разбить полную ширину поровну, опустите `cellWidth`:

```tsx
<Grid columns={3} width={316} cellHeight={50} gap={8}>
    <Rect width={80} height={40} color="#f5f8fc" />
    <Rect width={80} height={40} color="#e5efff" />
    <Rect width={80} height={40} color="#d5e5ff" />
</Grid>
```

Vue и Svelte используют те же свойства; Angular — `<canvas-grid [columns]="3" [width]="316" [cellHeight]="50" [gap]="8">` с импортом `Grid`.

Если задать Grid `height`, содержимое сверх видимой области можно прокручивать колесом; дети обрезаются в пределах фиксированной высоты:

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

`GridItem` — узел группировки/раскладки внутри Grid, сам он ничего не рисует. Внутри может быть несколько контролов, которые позиционируются вместе как одна ячейка; размеры детей по-прежнему задаются их собственными свойствами. Обычные контролы, положенные непосредственно в `Grid`, также работают — по умолчанию занимают по одной ячейке.

| Свойство                                     | Тип      | По умолчанию | Описание                                                             |
| -------------------------------------------- | -------- | -----------: | -------------------------------------------------------------------- |
| `columnSpan`                                 | `number` |          `1` | Число занимаемых столбцов; положительное целое, не больше `columns`. |
| `rowSpan`                                    | `number` |          `1` | Число занимаемых строк; положительное целое.                         |
| `backgroundColor`                            | `string` |            — | Фон ячейки, перекрывающий occupied span'ом область.                  |
| `x` / `y`                                    | `number` |          `0` | Смещение относительно начала ячейки.                                 |
| `rotation` / `scaleX` / `scaleY` / `visible` | —        |            — | Те же transform и видимость, что у `Group`.                          |

Grid раскладывает элементы построчно и пропускает уже занятые span'ом ячейки:

```tsx
<Grid columns={3} width={316} cellHeight={50} gap={8}>
    <GridItem columnSpan={2}>
        <Rect width={180} height={40} color="#f5f8fc" />
        <Text x={8} y={8}>
            Группа на два столбца
        </Text>
    </GridItem>
    <Rect width={80} height={40} color="#e5efff" />
</Grid>
```

Vue и Svelte используют тот же `<GridItem>`; Angular — `<canvas-grid-item [columnSpan]="2">...</canvas-grid-item>` с импортом `GridItem`.

### `<Image>`

Загружает изображение из `src` и рисует в Canvas с заданным размером. `objectFit` поддерживает `contain` (по умолчанию), `cover`, `fill`, `none`, `scale-down`; при ошибке вызывается `onError(error)`. В Angular для колбэка ошибки используйте событие `(imageError)`.

| Свойство           | Тип                                                        | Обязательное | По умолчанию | Описание                         |
| ------------------ | ---------------------------------------------------------- | -----------: | ------------ | -------------------------------- |
| `src`              | `string`                                                   |           да | —            | URL изображения.                 |
| `width` / `height` | `number`                                                   |           да | —            | Логический размер Canvas.        |
| `objectFit`        | `"contain" \| "cover" \| "fill" \| "none" \| "scale-down"` |          нет | `"contain"`  | Режим масштабирования и обрезки. |
| `onError`          | `(error: Error) => void`                                   |          нет | —            | Колбэк ошибки загрузки.          |

```tsx
<Image x={16} y={16} src="/avatar.png" width={96} height={96} objectFit="cover" />
```

Удалённые изображения рисуются корректно, но правила CORS для экспорта Canvas по-прежнему действуют: если сервер изображений не авторизовал кросс-доменное чтение, Canvas с таким изображением не удастся экспортировать в PNG.

### `<Progress>`

Рисует интерактивно-неактивный индикатор прогресса. `value` ограничивается диапазоном `min`–`max`.

| Свойство                             | Тип       |    По умолчанию | Описание                                                   |
| ------------------------------------ | --------- | --------------: | ---------------------------------------------------------- |
| `value`                              | `number`  |     обязательно | Текущее значение прогресса.                                |
| `min` / `max`                        | `number`  |     `0` / `100` | Диапазон.                                                  |
| `width` / `height`                   | `number`  |    `200` / `12` | Размер дорожки.                                            |
| `color` / `trackColor` / `textColor` | `string`  |      цвета темы | Цвет прогресса, дорожки и текста; явные props приоритетны. |
| `borderRadius`                       | `number`  | половина высоты | Радиус скругления.                                         |
| `showText`                           | `boolean` |         `false` | Рисовать ли процент справа от дорожки.                     |

### `<Carousel>` и `<CarouselItem>`

`Carousel` показывает один `CarouselItem` за раз по порядку детей, поддерживает автопрокрутку, зацикливание, стрелки и нижние точки-индикаторы. Содержимое — любые Canvas UI компоненты. Без явного `activeIndex` карусель неконтролируемая и стартует с индекса 0.

| Компонент      | Свойство                  | Тип                       | По умолчанию | Описание                                                     |
| -------------- | ------------------------- | ------------------------- | ------------ | ------------------------------------------------------------ |
| `Carousel`     | `width` / `height`        | `number`                  | обязательно  | Размер вьюпорта; выходящее обрезается.                       |
| `Carousel`     | `activeIndex`             | `number`                  | —            | Контролируемый текущий индекс; обновляйте в `onChange`.      |
| `Carousel`     | `defaultActiveIndex`      | `number`                  | `0`          | Начальный индекс для неконтролируемого режима.               |
| `Carousel`     | `autoplay`                | `boolean`                 | `true`       | Автопрокрутка; отключается, если элементов меньше двух.      |
| `Carousel`     | `interval`                | `number`                  | `3000`       | Интервал автопереключения в мс; минимум `250` мс.            |
| `Carousel`     | `transitionDuration`      | `number`                  | `450`        | Длительность горизонтального перехода в мс; `0` — мгновенно. |
| `Carousel`     | `loop`                    | `boolean`                 | `true`       | Замыкать ли последний элемент с первым.                      |
| `Carousel`     | `showArrows` / `showDots` | `boolean`                 | `true`       | Показывать ли стрелки и нижние индикаторы.                   |
| `Carousel`     | `onChange`                | `(index: number) => void` | —            | Колбэк смены индекса.                                        |
| `CarouselItem` | Дети                      | Canvas UI компоненты      | —            | Содержимое текущего слайда.                                  |

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

Angular: `<canvas-carousel>` и `<canvas-carousel-item>`; контролируемая смена индекса — `(activeIndexChange)`.

### `<Tabs>` и `<TabItem>`

`Tabs` использует `TabItem` для объявления вкладок и соответствующих Canvas-поддеревьев. По умолчанию активна первая TabItem.

| Компонент | Свойство                                                           | Тип                     | Описание                                                                                                 |
| --------- | ------------------------------------------------------------------ | ----------------------- | -------------------------------------------------------------------------------------------------------- |
| `Tabs`    | `width` / `height`                                                 | `number`                | Размер контейнера вкладок; обязательно. Контент рисуется под шапкой и обрезается по области содержимого. |
| `Tabs`    | `activeKey` / `defaultActiveKey`                                   | `string`                | Контролируемый ключ / начальный ключ.                                                                    |
| `Tabs`    | `headerHeight`                                                     | `number`                | Высота шапки, по умолчанию `40`.                                                                         |
| `Tabs`    | `backgroundColor` / `textColor` / `activeColor` / `indicatorColor` | `string`                | Цвета панели вкладок, текста, активного состояния и индикатора.                                          |
| `Tabs`    | `onChange`                                                         | `(key: string) => void` | Колбэк смены вкладки.                                                                                    |
| `TabItem` | `id` / `title`                                                     | `string`                | Уникальный идентификатор и заголовок; обязательны.                                                       |
| `TabItem` | `disabled`                                                         | `boolean`               | Запрещает клик по вкладке.                                                                               |
| `TabItem` | Дети                                                               | Canvas UI компоненты    | Canvas-контент вкладки.                                                                                  |

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

Angular: `<canvas-tabs>` и `<canvas-tab-item>`; смена активной вкладки — `(activeKeyChange)`.

### `<Collapse>` и `<CollapseItem>`

Заголовок каждого `CollapseItem` разворачивается/сворачивается по клику, дети служат содержимым панели.

| Компонент      | Свойство                                        | Тип                        | Описание                                                                 |
| -------------- | ----------------------------------------------- | -------------------------- | ------------------------------------------------------------------------ |
| `Collapse`     | `width`                                         | `number`                   | Ширина панели; обязательно.                                              |
| `Collapse`     | `activeKeys` / `defaultActiveKeys`              | `string[]`                 | Контролируемые раскрытые элементы / начальные раскрытые элементы.        |
| `Collapse`     | `accordion`                                     | `boolean`                  | По умолчанию `false`; `true` — одновременно раскрыт только один элемент. |
| `Collapse`     | `headerHeight`                                  | `number`                   | Высота заголовка, по умолчанию `40`.                                     |
| `Collapse`     | `backgroundColor` / `textColor` / `borderColor` | `string`                   | Цвета фона, текста и рамки для всех заголовков.                          |
| `Collapse`     | `onChange`                                      | `(keys: string[]) => void` | Колбэк изменения набора раскрытых элементов.                             |
| `CollapseItem` | `id` / `title`                                  | `string`                   | Уникальный id и заголовок панели; обязательны.                           |
| `CollapseItem` | `height`                                        | `number`                   | Высота контента в раскрытом виде, по умолчанию `100`.                    |
| `CollapseItem` | `disabled`                                      | `boolean`                  | Запрещает раскрытие/сворачивание.                                        |
| `CollapseItem` | `backgroundColor` / `textColor` / `borderColor` | `string`                   | Переопределяют цвета заголовка.                                          |

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

Angular: `<canvas-collapse>` и `<canvas-collapse-item>`; изменение набора раскрытых — `(activeKeysChange)`.

### `<Dialog>`

Диалог подтверждения по умолчанию центрирован поверх Canvas и рисует затемнение, заголовок, область содержимого и встроенные кнопки Cancel/OK. В область содержимого можно поместить любые Canvas UI компоненты. Пока диалог открыт, Input/Textarea внутри него недоступны для ввода — это защищает от «пробития» маски.

| Свойство                     | Тип                  |        По умолчанию | Описание                                                            |
| ---------------------------- | -------------------- | ------------------: | ------------------------------------------------------------------- |
| `open`                       | `boolean`            |         обязательно | Показывать ли диалог.                                               |
| `width` / `height`           | `number`             |       `420` / `240` | Размер диалога.                                                     |
| `title`                      | `string`             |         `"Confirm"` | Заголовок.                                                          |
| `confirmText` / `cancelText` | `string`             | `"OK"` / `"Cancel"` | Тексты встроенных кнопок.                                           |
| `closeOnBackdrop`            | `boolean`            |              `true` | Вызывать ли cancel по клику на затемнение.                          |
| `onConfirm` / `onCancel`     | `() => void`         |                   — | Колбэки подтверждения и отмены.                                     |
| Дети                         | Canvas UI компоненты |                   — | Область содержимого диалога — допустимы любые Canvas UI компоненты. |

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

Angular использует `<canvas-dialog>` с входом `open` и выходами `(confirm)` / `(cancel)`.

### `<Rect>`

Рисует прямоугольник. Поддерживает [общие свойства](#общие-свойства).

| Свойство      | Тип      |    По умолчанию | Описание                                   |
| ------------- | -------- | --------------: | ------------------------------------------ |
| `width`       | `number` |           `100` | Ширина.                                    |
| `height`      | `number` |            `40` | Высота.                                    |
| `color`       | `string` | `"transparent"` | Цвет заливки.                              |
| `radius`      | `number` |             `0` | Радиус скругления.                         |
| `stroke`      | `string` |               — | Цвет обводки; если не задан — без обводки. |
| `strokeWidth` | `number` |             `1` | Толщина обводки.                           |

### `<Circle>`

Рисует круг. Поддерживает [общие свойства](#общие-свойства).

| Свойство      | Тип      | По умолчанию | Описание                                   |
| ------------- | -------- | -----------: | ------------------------------------------ |
| `radius`      | `number` |         `10` | Радиус круга.                              |
| `color`       | `string` |  `"#e74c3c"` | Цвет заливки.                              |
| `stroke`      | `string` |            — | Цвет обводки; если не задан — без обводки. |
| `strokeWidth` | `number` |          `1` | Толщина обводки.                           |

### `<Text>`

Рисует однострочный или автоматически перенесённый текст. Поддерживает [общие свойства](#общие-свойства).

| Свойство     | Тип                             |   По умолчанию | Описание                                                                                                        |
| ------------ | ------------------------------- | -------------: | --------------------------------------------------------------------------------------------------------------- |
| `text`       | `string`                        |              — | Содержимое текста.                                                                                              |
| Дети         | `string \| number`              |              — | В каждом фреймворке можно передавать текст через нативный template-контент вместо `text`.                       |
| `fontSize`   | `number`                        |           `16` | Кегль в логических пикселях.                                                                                    |
| `width`      | `number`                        |              — | Максимальная ширина строки; при превышении включает перенос. CJK-символы тоже переносятся по измеренной ширине. |
| `fontFamily` | `string`                        | `"sans-serif"` | Семейство шрифтов.                                                                                              |
| `color`      | `string`                        |       `"#333"` | Цвет текста.                                                                                                    |
| `baseline`   | `CanvasTextBaseline`            |        `"top"` | Базовая линия Canvas-текста.                                                                                    |
| `textAlign`  | `"left" \| "center" \| "right"` |       `"left"` | Выравнивание; при выставленном `width` — относительно текстовой области.                                        |

### `<Icon>`

Оригинальные векторные иконки без зависимости от иконочных шрифтов и внешних изображений. Поддерживает [общие свойства](#общие-свойства).

| Свойство      | Тип                    | По умолчанию | Описание                                                                     |
| ------------- | ---------------------- | -----------: | ---------------------------------------------------------------------------- |
| `name`        | `IconName`             |  обязательно | Название иконки, см. список ниже.                                            |
| `size`        | `number`               |         `24` | Ширина и высота иконки.                                                      |
| `color`       | `string`               |     `"#333"` | Цвет иконки; задаётся по умолчанию через `--canvas-ui-icon-color`.           |
| `variant`     | `"outline" \| "solid"` |  `"outline"` | `outline` — контурная; `solid` — толстая линия с заливкой основного контура. |
| `strokeWidth` | `number`               |          `2` | Толщина контура; solid использует минимум `4`.                               |

Поддерживаются: `home`, `house`, `building`, `apartment`, `store`, `mapPin`, `map`, `globe`, `compass`, `navigation`, `flag`, `mountain`, `tree`, `leaf`, `flower`, `sun`, `moon`, `cloud`, `rain`, `snow`, `fire`, `water`, `wind`, `car`, `bus`, `train`, `plane`, `bicycle`, `ship`, `rocket`, `truck`, `walk`, `phone`, `message`, `mail`, `bell`, `calendar`, `clock`, `alarm`, `camera`, `image`, `video`, `music`, `microphone`, `headphones`, `play`, `pause`, `stop`, `record`, `volume`, `wifi`, `bluetooth`, `battery`, `signal`, `power`, `monitor`, `laptop`, `tablet`, `keyboard`, `mouse`, `printer`, `folder`, `file`, `document`, `download`, `upload`, `share`, `link`, `search`, `settings`, `sliders`, `menu`, `close`, `check`, `plus`, `minus`, `edit`, `trash`, `copy`, `save`, `lock`, `unlock`, `key`, `user`, `users`, `heart`, `star`, `bookmark`, `cart`, `bag`, `gift`, `creditCard`, `wallet`, `chart`, `pieChart`, `barChart`, `analytics`, `shield`, `warning`, `info`, `help`, `question`, `tag`, `puzzle`, `code`, `database`, `cloudDownload`.

```tsx
<Icon name="search" x={16} y={16} size={28} color="#1677ff" />
<Icon name="heart" x={56} y={16} variant="solid" color="#e74c3c" />
```

### `<Input>`

Однострочное поле ввода. Внешний вид контрола рисуется на Canvas, а прозрачный HTML input отвечает за клавиатуру, IME и выделение.

| Свойство           | Тип                                |   По умолчанию | Описание                                                  |
| ------------------ | ---------------------------------- | -------------: | --------------------------------------------------------- |
| `width` / `height` | `number`                           |   `200` / `36` | Размер контрола.                                          |
| `value`            | `string`                           |              — | Контролируемое значение; используйте вместе с `onChange`. |
| `defaultValue`     | `string`                           |           `""` | Начальное значение для неконтролируемого режима.          |
| `placeholder`      | `string`                           |           `""` | Текст-заполнитель.                                        |
| `type`             | `"text" \| "password" \| "number"` |       `"text"` | Тип ввода. Пароль отображается точками на Canvas.         |
| `fontSize`         | `number`                           |           `14` | Кегль.                                                    |
| `fontFamily`       | `string`                           | `"sans-serif"` | Семейство шрифтов.                                        |
| `color`            | `string`                           |       `"#333"` | Цвет вводимого текста.                                    |
| `bgColor`          | `string`                           |       `"#fff"` | Цвет фона.                                                |
| `borderColor`      | `string`                           |       `"#ccc"` | Цвет рамки.                                               |
| `focusBorderColor` | `string`                           |    `"#3498db"` | Цвет рамки в фокусе.                                      |
| `borderRadius`     | `number`                           |            `4` | Радиус скругления.                                        |
| `padding`          | `number`                           |            `8` | Внутренний отступ текста.                                 |
| `disabled`         | `boolean`                          |        `false` | Отключает ввод.                                           |
| `maxLength`        | `number`                           |              — | Максимум символов; неотрицательное целое.                 |
| `onChange`         | `(value: string) => void`          |              — | Колбэк изменения.                                         |
| `onFocus`          | `() => void`                       |              — | Колбэк получения фокуса.                                  |
| `onBlur`           | `() => void`                       |              — | Колбэк потери фокуса.                                     |

### `<Textarea>`

Многострочное поле, наследует значение, размер, стиль и колбэки `<Input>`. При переполнении внутри прокручивает и показывает полосу прокрутки; `type` не поддерживается. Дополнительно:

| Свойство | Тип      | Описание                                                                       |
| -------- | -------- | ------------------------------------------------------------------------------ |
| `rows`   | `number` | Может выражать ожидаемое число строк; фактическая высота рисуется по `height`. |

```tsx
<Textarea
    width={300}
    height={120}
    value={notes}
    placeholder="Введите многострочный текст"
    onChange={setNotes}
/>
```

### `<Upload>`

Рисует кнопку выбора файла. По клику открывается нативный браузерный file picker; на сервер компонент ничего не загружает.

| Свойство           | Тип                       |     По умолчанию | Описание                                        |
| ------------------ | ------------------------- | ---------------: | ----------------------------------------------- |
| `width` / `height` | `number`                  |     `120` / `40` | Размер кнопки.                                  |
| `text`             | `string`                  | `"Выбрать файл"` | Текст кнопки.                                   |
| `accept`           | `string`                  |                — | Фильтр типов файлов, например `"image/*,.pdf"`. |
| `multiple`         | `boolean`                 |          `false` | Разрешить выбор нескольких файлов.              |
| `disabled`         | `boolean`                 |          `false` | Отключает выбор файлов.                         |
| `onChange`         | `(files: File[]) => void` |                — | Колбэк после выбора; при отмене не вызывается.  |

```tsx
<Upload accept="image/*" multiple onChange={(files) => console.log(files)} />
```

Angular: `<canvas-upload>` и `File[]` через `(change)`.

### `<Dropdown>`

Дропдаун, нарисованный на Canvas. Поддерживает [общие свойства](#общие-свойства).

| Свойство           | Тип                               |  По умолчанию | Описание                                                 |
| ------------------ | --------------------------------- | ------------: | -------------------------------------------------------- |
| `width` / `height` | `number`                          |  `200` / `36` | Размер контрола.                                         |
| `options`          | `Array<string \| DropdownOption>` |   обязательно | Список опций; у строковых опций label и value совпадают. |
| `value`            | `string`                          |             — | Контролируемое выбранное значение.                       |
| `defaultValue`     | `string`                          |             — | Неконтролируемое начальное значение.                     |
| `placeholder`      | `string`                          | `"Select..."` | Текст, пока ничего не выбрано.                           |
| `disabled`         | `boolean`                         |       `false` | Отключает взаимодействие.                                |
| `fontSize`         | `number`                          |          `14` | Кегль.                                                   |
| `color`            | `string`                          |      `"#333"` | Цвет текста.                                             |
| `bgColor`          | `string`                          |      `"#fff"` | Фон контрола.                                            |
| `borderColor`      | `string`                          |   `"#c7ccd3"` | Цвет рамки.                                              |
| `focusBorderColor` | `string`                          |   `"#3478f6"` | Цвет рамки в развёрнутом виде.                           |
| `borderRadius`     | `number`                          |           `4` | Радиус скругления.                                       |
| `onChange`         | `(value: string) => void`         |             — | Колбэк изменения выбора.                                 |

Тип `DropdownOption`:

| Свойство   | Тип       | Описание            |
| ---------- | --------- | ------------------- |
| `label`    | `string`  | Отображаемый текст. |
| `value`    | `string`  | Значение опции.     |
| `disabled` | `boolean` | Отключена ли опция. |

```tsx
<Dropdown
    value={role}
    options={['Admin', { label: 'Только чтение', value: 'reader', disabled: false }]}
    onChange={setRole}
/>
```

### `<DatePicker>`

Поле даты, нарисованное на Canvas; клик открывает нативный браузерный пикер.

| Свойство           | Тип                       |    По умолчанию | Описание                                      |
| ------------------ | ------------------------- | --------------: | --------------------------------------------- |
| `width` / `height` | `number`                  |    `200` / `36` | Размер контрола.                              |
| `value`            | `string`                  |               — | Контролируемое значение, формат `YYYY-MM-DD`. |
| `defaultValue`     | `string`                  |            `""` | Неконтролируемое начальное значение.          |
| `placeholder`      | `string`                  | `"Select date"` | Текст, пока дата не выбрана.                  |
| `disabled`         | `boolean`                 |         `false` | Отключает выбор даты.                         |
| `onChange`         | `(value: string) => void` |               — | Колбэк изменения даты.                        |

### `<Radio>` и `<Checkbox>`

Оба принимают массив `options`; Radio выбирает одно значение, Checkbox — несколько. Строковые опции используют одно и то же значение как label и value, также допустимы объекты `{ label, value, disabled }`.

| Свойство           | Тип                                                                     |   По умолчанию | Описание                             |
| ------------------ | ----------------------------------------------------------------------- | -------------: | ------------------------------------ |
| `options`          | `Array<string \| ChoiceOption>`                                         |    обязательно | Список опций.                        |
| `value`            | Radio: `string`; Checkbox: `string[]`                                   |              — | Контролируемое выбранное значение.   |
| `defaultValue`     | Radio: `string`; Checkbox: `string[]`                                   |              — | Неконтролируемое начальное значение. |
| `direction`        | `"horizontal" \| "vertical"`                                            | `"horizontal"` | Направление раскладки опций.         |
| `width` / `height` | `number`                                                                |     авторасчёт | Размер контрола.                     |
| `onChange`         | Radio: `(value: string) => void`; Checkbox: `(value: string[]) => void` |              — | Колбэк изменения выбора.             |

```tsx
<Radio options={['Small', 'Medium', 'Large']} value={size} onChange={setSize} />
<Checkbox options={['Email', 'SMS']} value={channels} onChange={setChannels} />
```

Angular: `<canvas-date-picker>`, `<canvas-radio>`, `<canvas-checkbox>`; дата слушается через `(valueChange)` или `(change)`, Radio/Checkbox — через `(change)`.

### `<Slider>`

Перетаскиваемый слайдер. Поддерживает [общие свойства](#общие-свойства).

| Свойство           | Тип                       | По умолчанию | Описание                             |
| ------------------ | ------------------------- | -----------: | ------------------------------------ |
| `width` / `height` | `number`                  | `160` / `32` | Размер слайдера.                     |
| `min` / `max`      | `number`                  |  `0` / `100` | Минимум и максимум.                  |
| `step`             | `number`                  |          `1` | Шаг изменения.                       |
| `value`            | `number`                  |            — | Контролируемое значение.             |
| `defaultValue`     | `number`                  |        `min` | Неконтролируемое начальное значение. |
| `disabled`         | `boolean`                 |      `false` | Отключает перетаскивание.            |
| `trackColor`       | `string`                  |  `"#d7dde5"` | Цвет дорожки.                        |
| `activeColor`      | `string`                  |  `"#3478f6"` | Цвет заполненной части и обводки.    |
| `thumbColor`       | `string`                  |     `"#fff"` | Цвет ползунка.                       |
| `onChange`         | `(value: number) => void` |            — | Колбэк изменения значения.           |

### `<Switch>`

Переключатель. Поддерживает [общие свойства](#общие-свойства).

| Свойство           | Тип                          | По умолчанию | Описание                              |
| ------------------ | ---------------------------- | -----------: | ------------------------------------- |
| `width` / `height` | `number`                     |  `44` / `24` | Размер переключателя.                 |
| `checked`          | `boolean`                    |            — | Контролируемое состояние.             |
| `defaultChecked`   | `boolean`                    |      `false` | Неконтролируемое начальное состояние. |
| `disabled`         | `boolean`                    |      `false` | Запрещает переключение.               |
| `onColor`          | `string`                     |  `"#3478f6"` | Цвет дорожки во включённом состоянии. |
| `offColor`         | `string`                     |  `"#c7ccd3"` | Цвет дорожки в выключенном состоянии. |
| `thumbColor`       | `string`                     |     `"#fff"` | Цвет ползунка.                        |
| `onChange`         | `(checked: boolean) => void` |            — | Колбэк изменения состояния.           |

### `<Button>`

Кнопка на Canvas. Поддерживает [общие свойства](#общие-свойства).

| Свойство           | Тип                | По умолчанию | Описание                                      |
| ------------------ | ------------------ | -----------: | --------------------------------------------- |
| `width` / `height` | `number`           | `120` / `40` | Размер кнопки.                                |
| Дети               | `string \| number` |            — | Текст кнопки; можно заменить на `text`.       |
| `text`             | `string`           |            — | Текст кнопки; имеет приоритет над `children`. |
| `fontSize`         | `number`           |         `15` | Кегль.                                        |
| `fontColor`        | `string`           |     `"#fff"` | Цвет текста.                                  |
| `backgroundColor`  | `string`           |  `"#3478f6"` | Цвет фона.                                    |
| `borderColor`      | `string`           |            — | Цвет обводки.                                 |
| `borderRadius`     | `number`           |          `6` | Радиус скругления.                            |
| `disabled`         | `boolean`          |      `false` | Отключает кнопку.                             |
| `onClick`          | `() => void`       |            — | Колбэк клика.                                 |

## Экспорт изображений

Экспортируйте изображение через `ref` с `CanvasHandle`:

```tsx
const canvasRef = useRef<CanvasHandle>(null);

// PNG Data URL — можно сразу присвоить img.src
const dataUrl = canvasRef.current?.toDataURL({
    type: 'image/png',
    width: 840,
    height: 600,
    pixelRatio: 2,
});

// JPEG Blob — для ссылки-скачивания или загрузки
const blob = await canvasRef.current?.toBlob({
    type: 'image/jpeg',
    quality: 0.9,
    pixelRatio: 2,
});

// Получить базовый HTMLCanvasElement
const canvasElement = canvasRef.current?.getCanvas();
```

Параметры `CanvasExportOptions`:

| Свойство     | Тип      |                     По умолчанию | Описание                                                                                                 |
| ------------ | -------- | -------------------------------: | -------------------------------------------------------------------------------------------------------- |
| `width`      | `number` | Текущая логическая ширина Canvas | Логическая ширина экспортируемого изображения.                                                           |
| `height`     | `number` | Текущая логическая высота Canvas | Логическая высота экспортируемого изображения.                                                           |
| `pixelRatio` | `number` |               Pixel ratio Canvas | Плотность пикселей вывода; итоговый bitmap примерно `width × pixelRatio` на `height × pixelRatio`.       |
| `type`       | `string` |                    `"image/png"` | MIME-тип (`image/png`, `image/jpeg`, `image/webp`). При неподдерживаемом формате браузер возвращает PNG. |
| `quality`    | `number` |   значение браузера по умолчанию | Качество для lossy-форматов, 0–1. PNG обычно его не использует.                                          |

Короткая форма вызова тоже поддерживается:

```tsx
canvasRef.current?.toDataURL('image/png');
const jpegBlob = await canvasRef.current?.toBlob('image/jpeg', 0.9);
```

Размер и pixel ratio экспорта должны быть положительными. Если сцена содержит кросс-доменное изображение без CORS-разрешения, `toDataURL()` выбросит `Error` с объяснением причины, `toBlob()` отклонит Promise с той же ошибкой. Настройте сервер изображений, чтобы он возвращал `Access-Control-Allow-Origin` для текущего сайта, или уберите такое изображение перед экспортом.

## Структура файлов

| Файл                  | Назначение                                                                                                                                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `react/`              | React-компоненты и адаптер Canvas-контейнера.                                                                                             |
| `vue/`                | Vue 3 компоненты и адаптер Canvas-контейнера.                                                                                             |
| `svelte/`             | Svelte 5+ адаптер и template-компоненты.                                                                                                  |
| `angular/`            | Angular standalone `Canvas` и директивы сцены.                                                                                            |
| `components/`         | Реализация общих компонентов; каждый — отдельный каталог с индексом, файлом Props/отрисовки и, при необходимости, логикой взаимодействия. |
| `components/index.ts` | Единый экспорт компонентов и компиляция поддерева.                                                                                        |
| `components/types.ts` | Свод всех публичных Props-типов.                                                                                                          |
| `theme.css`           | CSS-переменные светлой/тёмной темы Canvas-компонентов.                                                                                    |
| `types.ts`            | Свод Props компонентов, типы узлов сцены и input bridge.                                                                                  |
| `engine.ts`           | Синхронизация сцены, input bridge, hit testing, взаимодействие с контролами.                                                              |
| `renderer.ts`         | Обход сцены и диспетчер отрисовки Canvas.                                                                                                 |
| `input-bridge.ts`     | Прозрачный HTML-мост ввода для Input/Textarea.                                                                                            |
| `types.ts`            | Типы сцены, Canvas и мостов.                                                                                                              |

Для правки внешнего вида в первую очередь редактируйте функцию отрисовки в `components/<Component>/<component>.ts`; логику взаимодействия конкретного контрола держите в `logic.ts` рядом. Меняйте адаптеры, `engine.ts` и `renderer.ts` только если правите общую раскладку, события или поведение экспорта.
