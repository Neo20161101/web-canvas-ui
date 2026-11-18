import type {
    ButtonProps,
    CarouselItemProps,
    CarouselProps,
    CheckboxProps,
    CircleProps,
    CollapseItemProps,
    CollapseProps,
    CustomDrawProps,
    CanvasViewProps,
    DatePickerProps,
    DialogProps,
    DropdownProps,
    GridItemProps,
    GridProps,
    GroupProps,
    IconProps,
    ImageProps,
    InputProps,
    ProgressProps,
    RadioProps,
    RectProps,
    SliderProps,
    SwitchProps,
    TabItemProps,
    TabsProps,
    TextProps,
    TextareaProps,
    UploadProps,
} from './components/types';

export type ComponentKind =
    | 'group'
    | 'grid'
    | 'gridItem'
    | 'rect'
    | 'circle'
    | 'text'
    | 'input'
    | 'datePicker'
    | 'radio'
    | 'checkbox'
    | 'upload'
    | 'carousel'
    | 'carouselItem'
    | 'textarea'
    | 'dropdown'
    | 'slider'
    | 'switch'
    | 'button'
    | 'image'
    | 'icon'
    | 'dialog'
    | 'progress'
    | 'tabs'
    | 'tabItem'
    | 'collapse'
    | 'collapseItem'
    | 'customDraw'
    | 'canvasView';

export type Transform = readonly [number, number, number, number, number, number];

export interface TransformProps {
    x?: number;
    y?: number;
    rotation?: number;
    scaleX?: number;
    scaleY?: number;
    visible?: boolean;
}

export interface CanvasWheelEvent {
    currentTarget: HTMLCanvasElement;
    clientX: number;
    clientY: number;
    deltaY: number;
    preventDefault(): void;
}

export type {
    ButtonProps,
    CarouselItemProps,
    CarouselProps,
    CheckboxProps,
    ChoiceOption,
    CircleProps,
    CollapseItemProps,
    CollapseProps,
    ComponentSize,
    CustomDrawProps,
    CustomDrawSize,
    CustomDrawClickEvent,
    CustomDrawHitTest,
    CanvasViewFit,
    CanvasViewPointerEvent,
    CanvasViewPointerEventHandler,
    CanvasViewProps,
    DatePickerProps,
    DialogProps,
    DropdownOption,
    DropdownProps,
    GridItemProps,
    GridProps,
    GroupProps,
    IconName,
    IconProps,
    IconVariant,
    ImageProps,
    InputProps,
    ProgressProps,
    RadioProps,
    RectProps,
    SliderProps,
    SwitchProps,
    TabItemProps,
    TabsProps,
    TextProps,
    TextareaProps,
    UploadProps,
} from './components/types';

export interface CanvasComponentProps {
    group: Omit<GroupProps, 'children'>;
    grid: Omit<GridProps, 'children'>;
    gridItem: Omit<GridItemProps, 'children'>;
    rect: RectProps;
    circle: CircleProps;
    text: Omit<TextProps, 'children'>;
    input: InputProps;
    datePicker: DatePickerProps;
    radio: RadioProps;
    checkbox: CheckboxProps;
    upload: UploadProps;
    carousel: Omit<CarouselProps, 'children'>;
    carouselItem: CarouselItemProps;
    textarea: TextareaProps;
    dropdown: DropdownProps;
    slider: SliderProps;
    switch: SwitchProps;
    button: Omit<ButtonProps, 'children'>;
    image: ImageProps;
    icon: IconProps;
    dialog: Omit<DialogProps, 'children'>;
    progress: ProgressProps;
    tabs: Omit<TabsProps, 'children'>;
    tabItem: Omit<TabItemProps, 'children'>;
    collapse: Omit<CollapseProps, 'children'>;
    collapseItem: Omit<CollapseItemProps, 'children'>;
    customDraw: CustomDrawProps;
    canvasView: CanvasViewProps;
}

type KeysOfUnion<T> = T extends T ? keyof T : never;

export type CanvasNodeProps = CanvasComponentProps[ComponentKind];
export type CanvasNodePropKey = KeysOfUnion<CanvasNodeProps>;
export type CanvasNodePropValue<Key extends CanvasNodePropKey> = CanvasNodeProps extends infer Props
    ? Props extends object
        ? Key extends keyof Props
            ? Props[Key]
            : never
        : never
    : never;

export interface VNode {
    type: ComponentKind;
    key: string | null;
    props: Record<string, unknown>;
    children: VNode[];
}

export interface InputLayout {
    width: number;
    height: number;
    transform: Transform;
    visible: boolean;
}

export type TextControlProps = InputProps | DatePickerProps | TextareaProps;

export interface InputEvents {
    input: (value: string, cursor: number) => void;
    selection: (cursor: number) => void;
    focus: () => void;
    blur: () => void;
    scroll: (scrollTop: number, scrollHeight: number, clientHeight: number) => void;
}

export interface WebInputBridge {
    mount(
        id: string,
        props: TextControlProps,
        layout: InputLayout,
        events: InputEvents,
    ): () => void;
    update(id: string, props: TextControlProps, layout: InputLayout): void;
    pickFiles(
        accept: string | undefined,
        multiple: boolean,
        onChange: (files: File[]) => void,
    ): void;
    setOverlayVisible(visible: boolean): void;
    destroy(): void;
}

export interface CanvasProps {
    width: number;
    height: number;
    style?: object;
    className?: string;
    ariaLabel?: string;
    onFrame?: (time: number) => void;
    onEvent?: (event: CanvasUIEvent) => void;
    children?: unknown;
}

export interface CanvasUIEventTarget {
    readonly type: ComponentKind;
    readonly key: string | null;
}

interface CanvasUIEventPosition {
    readonly target: CanvasUIEventTarget | null;
    readonly x: number;
    readonly y: number;
    readonly localX?: number;
    readonly localY?: number;
}

export type CanvasUIPointerEvent = CanvasUIEventPosition & {
    readonly type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel' | 'click';
    readonly pointerId: number;
};

export type CanvasUIWheelEvent = CanvasUIEventPosition & {
    readonly type: 'wheel';
    readonly deltaY: number;
};

export type CanvasUIEvent = CanvasUIPointerEvent | CanvasUIWheelEvent;

export interface CanvasPointerEvent {
    currentTarget: HTMLCanvasElement;
    clientX: number;
    clientY: number;
    pointerId: number;
    pointerType?: string;
    pressure?: number;
    isPrimary?: boolean;
    button?: number;
    buttons?: number;
    preventDefault(): void;
}

export const IDENTITY_TRANSFORM: Transform = [1, 0, 0, 1, 0, 0];
