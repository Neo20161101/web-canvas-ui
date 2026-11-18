import { drawButton } from './components/Button';
import { drawDialog } from './components/Dialog';
import { drawCircle } from './components/Circle';
import { drawCustomDraw } from './components/CustomDraw';
import { drawCanvasView } from './components/CanvasView';
import { drawCollapseItem } from './components/Collapse';
import { drawDropdown, drawDropdownOptions } from './components/Dropdown';
import { drawImage } from './components/Image';
import { drawProgress } from './components/Progress';
import { drawInput } from './components/Input';
import { drawIcon } from './components/Icon';
import { drawDatePicker } from './components/DatePicker';
import { drawRadio } from './components/Radio';
import { drawCheckbox } from './components/Checkbox';
import { drawUpload } from './components/Upload';
import { drawCarousel, drawCarouselControls } from './components/Carousel';
import { drawRect } from './components/Rect';
import { drawSlider } from './components/Slider';
import { drawSwitch } from './components/Switch';
import { drawTabs } from './components/Tabs';
import { drawText } from './components/Text';
import { drawTextarea } from './components/Textarea';
import { SceneNode } from './scene';
import type { ComponentKind } from './types';
import type { RectProps } from './components/Rect';
import type { CircleProps } from './components/Circle';
import type { CustomDrawProps } from './components/CustomDraw';
import type { CanvasViewProps } from './components/CanvasView';
import type { TextProps } from './components/Text';
import type { InputDrawProps } from './components/Input';
import type { DatePickerDrawProps } from './components/DatePicker';
import type { RadioProps } from './components/Radio';
import type { CheckboxProps } from './components/Checkbox';
import type { UploadProps } from './components/Upload';
import type { CarouselDrawProps } from './components/Carousel';
import type { TextareaDrawProps } from './components/Textarea';
import type { DropdownDrawProps } from './components/Dropdown';
import type { SliderProps } from './components/Slider';
import type { SwitchProps } from './components/Switch';
import type { ButtonDrawProps } from './components/Button';
import type { ImageProps } from './components/Image';
import type { IconProps } from './components/Icon';
import type { ProgressProps } from './components/Progress';
import type { TabsDrawProps } from './components/Tabs';
import type { CollapseItemDrawProps } from './components/Collapse';

/** Maps every drawable component kind to the exact props type its draw function consumes. */
interface DrawPropsMap {
    rect: RectProps;
    circle: CircleProps;
    customDraw: CustomDrawProps;
    canvasView: CanvasViewProps;
    text: TextProps;
    input: InputDrawProps;
    datePicker: DatePickerDrawProps;
    radio: RadioProps;
    checkbox: CheckboxProps;
    upload: UploadProps;
    carousel: CarouselDrawProps;
    textarea: TextareaDrawProps;
    dropdown: DropdownDrawProps;
    slider: SliderProps;
    switch: SwitchProps;
    button: ButtonDrawProps;
    image: ImageProps;
    icon: IconProps;
    progress: ProgressProps;
    tabs: TabsDrawProps;
    collapseItem: CollapseItemDrawProps;
}

type DrawRegistry = {
    [K in keyof DrawPropsMap]: (context: CanvasRenderingContext2D, props: DrawPropsMap[K]) => void;
};

// Every entry is checked against DrawPropsMap, so a kind can never be paired with a draw
// function that expects a different props shape.
const drawComponent: DrawRegistry = {
    rect: drawRect,
    circle: drawCircle,
    customDraw: drawCustomDraw,
    canvasView: drawCanvasView,
    text: drawText,
    input: drawInput,
    datePicker: drawDatePicker,
    radio: drawRadio,
    checkbox: drawCheckbox,
    upload: drawUpload,
    carousel: drawCarousel,
    textarea: drawTextarea,
    dropdown: drawDropdown,
    slider: drawSlider,
    switch: drawSwitch,
    button: drawButton,
    image: drawImage,
    icon: drawIcon,
    progress: drawProgress,
    tabs: drawTabs,
    collapseItem: drawCollapseItem,
};

type LooseDraw = (context: CanvasRenderingContext2D, props: Record<string, unknown>) => void;

// Boundary hop between the scene and the draw layer: scene nodes carry props as
// `Record<string, unknown>`, while draw functions declare precise props types. `DrawRegistry`
// above already proves each kind is paired with a function accepting that kind's props, so these
// two helpers are the only place that intentionally erases that guarantee in order to dispatch by
// a runtime `node.type`. Keep casts out of individual draw functions and route everything here.
const looseDrawComponent = drawComponent as unknown as Partial<Record<ComponentKind, LooseDraw>>;

function eraseDraw<P>(draw: (context: CanvasRenderingContext2D, props: P) => void): LooseDraw {
    return draw as unknown as LooseDraw;
}

export class CanvasRenderer {
    render(context: CanvasRenderingContext2D, root: SceneNode): void {
        const canvas = context.canvas;
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();
        this.drawNode(context, root);
        this.drawDialogs(context, root);
        this.drawDropdownOverlays(context, root);
        root.traverse((node) => {
            node.dirty = false;
        });
    }

    private drawNode(context: CanvasRenderingContext2D, node: SceneNode): void {
        if (node.props.visible === false) return;
        if (node.type === 'dialog') return;
        context.save();
        context.translate(number(node.props.x, 0), number(node.props.y, 0));
        context.rotate(number(node.props.rotation, 0));
        context.scale(number(node.props.scaleX, 1), number(node.props.scaleY, 1));

        if (node.type === 'gridItem' && typeof node.props.backgroundColor === 'string') {
            drawGridItemBackground(context, node);
        }
        if (node.type !== 'root') looseDrawComponent[node.type]?.(context, node.props);
        if (node.type === 'grid' && typeof node.props.height === 'number') {
            context.save();
            context.beginPath();
            context.rect(
                0,
                0,
                number(node.props._gridWidth, number(node.props.width, 0)),
                number(node.props.height, 0),
            );
            context.clip();
            node.children.forEach((child) => this.drawNode(context, child));
            context.restore();
            drawGridScrollbar(context, node);
        } else if (node.type === 'tabs') {
            const width = number(node.props.width, 300);
            const height = number(node.props.height, 200);
            const headerHeight = number(node.props.headerHeight, 40);
            context.save();
            context.beginPath();
            context.rect(0, headerHeight, width, Math.max(0, height - headerHeight));
            context.clip();
            node.children.forEach((child) => this.drawNode(context, child));
            context.restore();
        } else if (node.type === 'carousel') {
            context.save();
            context.beginPath();
            context.rect(0, 0, number(node.props.width, 300), number(node.props.height, 180));
            context.clip();
            node.children.forEach((child) => this.drawNode(context, child));
            context.restore();
            eraseDraw(drawCarouselControls)(context, node.props);
        } else {
            node.children.forEach((child) => this.drawNode(context, child));
        }
        context.restore();
    }

    private drawDialogs(context: CanvasRenderingContext2D, node: SceneNode): void {
        if (node.props.visible === false) return;
        if (node.type === 'dialog') {
            if (!node.props.open) return;
            context.save();
            context.translate(number(node.props.x, 0), number(node.props.y, 0));
            context.rotate(number(node.props.rotation, 0));
            context.scale(number(node.props.scaleX, 1), number(node.props.scaleY, 1));
            eraseDraw(drawDialog)(context, node.props);
            const x = number(node.props._dialogPanelX, 0);
            const y = number(node.props._dialogPanelY, 0);
            const width = number(node.props.width, 420);
            const height = number(node.props.height, 240);
            context.save();
            context.beginPath();
            context.rect(x + 12, y + 56, Math.max(0, width - 24), Math.max(0, height - 112));
            context.clip();
            node.children.forEach((child) => this.drawNode(context, child));
            context.restore();
            context.restore();
            return;
        }
        node.children.forEach((child) => this.drawDialogs(context, child));
    }

    private drawDropdownOverlays(context: CanvasRenderingContext2D, node: SceneNode): void {
        if (node.props.visible === false) return;
        context.save();
        context.translate(number(node.props.x, 0), number(node.props.y, 0));
        context.rotate(number(node.props.rotation, 0));
        context.scale(number(node.props.scaleX, 1), number(node.props.scaleY, 1));

        if (node.type === 'dropdown' && node.props.open) {
            eraseDraw(drawDropdownOptions)(context, node.props);
        }

        if (
            (node.type === 'grid' && typeof node.props.height === 'number') ||
            node.type === 'carousel'
        ) {
            context.save();
            context.beginPath();
            context.rect(
                0,
                0,
                node.type === 'grid'
                    ? number(node.props._gridWidth, number(node.props.width, 0))
                    : number(node.props.width, 300),
                number(node.props.height, node.type === 'carousel' ? 180 : 0),
            );
            context.clip();
            node.children.forEach((child) => this.drawDropdownOverlays(context, child));
            context.restore();
        } else {
            node.children.forEach((child) => this.drawDropdownOverlays(context, child));
        }
        context.restore();
    }
}

function drawGridItemBackground(context: CanvasRenderingContext2D, node: SceneNode): void {
    context.fillStyle = node.props.backgroundColor as string;
    context.fillRect(
        0,
        0,
        number(node.props._gridItemWidth, 0),
        number(node.props._gridItemHeight, 0),
    );
}

function drawGridScrollbar(context: CanvasRenderingContext2D, node: SceneNode): void {
    const height = number(node.props.height, 0);
    const contentHeight = number(node.props._gridContentHeight, height);
    if (height <= 0 || contentHeight <= height) return;
    const width = number(node.props._gridWidth, number(node.props.width, 0));
    const trackWidth = 6;
    const trackX = Math.max(0, width - trackWidth);
    const thumbHeight = Math.min(height, Math.max(18, (height * height) / contentHeight));
    const maxScroll = contentHeight - height;
    const thumbY = ((height - thumbHeight) * number(node.props._scrollTop, 0)) / maxScroll;
    context.fillStyle = 'rgba(0, 0, 0, 0.08)';
    context.fillRect(trackX, 0, trackWidth, height);
    context.fillStyle = 'rgba(0, 0, 0, 0.35)';
    context.beginPath();
    context.roundRect(trackX + 1, thumbY, trackWidth - 2, thumbHeight, 3);
    context.fill();
}

function number(value: unknown, fallback: number): number {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}
