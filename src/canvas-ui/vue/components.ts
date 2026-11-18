import { defineComponent, type DefineComponent } from 'vue';
import type {
    ButtonProps,
    CircleProps,
    ComponentKind,
    DropdownProps,
    DatePickerProps,
    RadioProps,
    CheckboxProps,
    UploadProps,
    CarouselProps,
    CarouselItemProps,
    GroupProps,
    GridProps,
    GridItemProps,
    IconProps,
    InputProps,
    RectProps,
    SliderProps,
    SwitchProps,
    TextProps,
    TextareaProps,
    ImageProps,
    DialogProps,
    ProgressProps,
    TabsProps,
    TabItemProps,
    CollapseProps,
    CollapseItemProps,
    CustomDrawProps,
    CanvasViewProps,
} from '../types';

export const vueKindSymbol = Symbol.for('rnative55.web-canvas-ui.vue-kind');

type VueUiComponent<Props> =
    // The `{}` slots are Vue `DefineComponent` generic placeholders; the real prop shape
    // comes from the trailing `Readonly<Props>` argument.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    DefineComponent<{}, {}, {}, {}, {}, {}, {}, {}, string, {}, Readonly<Props>> & {
        new (): { $props: Props };
        [vueKindSymbol]?: ComponentKind;
    };

function createComponent<Props>(kind: ComponentKind): VueUiComponent<Props> {
    const component = defineComponent({
        name: `Canvas${kind[0].toUpperCase()}${kind.slice(1)}`,
        inheritAttrs: false,
        setup() {
            return () => null;
        },
    });
    Object.defineProperty(component, vueKindSymbol, { value: kind });
    return component as unknown as VueUiComponent<Props>;
}

export const Group = createComponent<Omit<GroupProps, 'children'>>('group');
export const Grid = createComponent<Omit<GridProps, 'children'>>('grid');
export const GridItem = createComponent<Omit<GridItemProps, 'children'>>('gridItem');
export const Rect = createComponent<RectProps>('rect');
export const Circle = createComponent<CircleProps>('circle');
export const Icon = createComponent<IconProps>('icon');
export const Text = createComponent<TextProps>('text');
export const Input = createComponent<InputProps>('input');
export const DatePicker = createComponent<DatePickerProps>('datePicker');
export const Radio = createComponent<RadioProps>('radio');
export const Checkbox = createComponent<CheckboxProps>('checkbox');
export const Upload = createComponent<UploadProps>('upload');
export const Carousel = createComponent<Omit<CarouselProps, 'children'>>('carousel');
export const CarouselItem = createComponent<CarouselItemProps>('carouselItem');
export const Textarea = createComponent<TextareaProps>('textarea');
export const Dropdown = createComponent<DropdownProps>('dropdown');
export const Slider = createComponent<SliderProps>('slider');
export const Switch = createComponent<SwitchProps>('switch');
export const Button = createComponent<ButtonProps>('button');
export const Image = createComponent<ImageProps>('image');
export const Dialog = createComponent<DialogProps>('dialog');
export const Progress = createComponent<ProgressProps>('progress');
export const Tabs = createComponent<TabsProps>('tabs');
export const TabItem = createComponent<TabItemProps>('tabItem');
export const Collapse = createComponent<CollapseProps>('collapse');
export const CollapseItem = createComponent<CollapseItemProps>('collapseItem');
export const CustomDraw = createComponent<CustomDrawProps>('customDraw');
export const CanvasView = createComponent<CanvasViewProps>('canvasView');
