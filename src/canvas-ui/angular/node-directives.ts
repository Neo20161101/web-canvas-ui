import {
    Directive,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input as AngularInput,
    Output,
} from '@angular/core';
import type {
    CanvasNodePropKey,
    CanvasNodePropValue,
    ComponentKind,
    CustomDrawClickEvent,
} from '../types';

const NODE_REF = Symbol('canvas-ui-angular-node');

type NodeElement = HTMLElement & { [NODE_REF]?: CanvasNodeDirective };

const PROP_KEYS = [
    'x',
    'y',
    'rotation',
    'scaleX',
    'scaleY',
    'visible',
    'size',
    'width',
    'height',
    'color',
    'radius',
    'stroke',
    'strokeWidth',
    'text',
    'fontSize',
    'fontFamily',
    'baseline',
    'textAlign',
    'maxLines',
    'value',
    'defaultValue',
    'placeholder',
    'bgColor',
    'borderColor',
    'focusBorderColor',
    'borderRadius',
    'padding',
    'disabled',
    'maxLength',
    'type',
    'rows',
    'options',
    'min',
    'max',
    'step',
    'defaultChecked',
    'checked',
    'onColor',
    'offColor',
    'thumbColor',
    'trackColor',
    'activeColor',
    'backgroundColor',
    'textColor',
    'fontColor',
    'onChange',
    'onClick',
    'onFocus',
    'onBlur',
    'columns',
    'cellWidth',
    'cellHeight',
    'gap',
    'columnSpan',
    'rowSpan',
    'src',
    'objectFit',
    'onError',
    'open',
    'title',
    'confirmText',
    'cancelText',
    'closeOnBackdrop',
    'onConfirm',
    'onCancel',
    'showText',
    'activeKey',
    'defaultActiveKey',
    'headerHeight',
    'indicatorColor',
    'id',
    'activeKeys',
    'defaultActiveKeys',
    'accordion',
    'direction',
    'optionHeight',
    'disabledColor',
    'onScroll',
    'accept',
    'multiple',
    'icon',
    'iconSize',
    'activeIndex',
    'defaultActiveIndex',
    'autoplay',
    'interval',
    'transitionDuration',
    'loop',
    'showArrows',
    'showDots',
    'arrowColor',
    'dotColor',
    'activeDotColor',
    'draw',
    'hitTest',
    'name',
    'variant',
    'source',
    'fit',
    'onPointerEvent',
] as const satisfies readonly CanvasNodePropKey[];

// type AssertNever<T extends never> = T;
// export type AngularCanvasPropsAreComplete = AssertNever<
//     Exclude<CanvasNodePropKey, (typeof PROP_KEYS)[number] | 'children'>
// >;

@Directive()
export abstract class CanvasNodeDirective {
    @HostBinding('attr.data-canvas-ui-node') readonly marker = '';

    @AngularInput() x?: CanvasNodePropValue<'x'>;
    @AngularInput() y?: CanvasNodePropValue<'y'>;
    @AngularInput() rotation?: CanvasNodePropValue<'rotation'>;
    @AngularInput() scaleX?: CanvasNodePropValue<'scaleX'>;
    @AngularInput() scaleY?: CanvasNodePropValue<'scaleY'>;
    @AngularInput() visible?: CanvasNodePropValue<'visible'>;
    @AngularInput() key?: string | number;

    @AngularInput() size?: CanvasNodePropValue<'size'>;
    @AngularInput() width?: CanvasNodePropValue<'width'>;
    @AngularInput() height?: CanvasNodePropValue<'height'>;
    @AngularInput() color?: CanvasNodePropValue<'color'>;
    @AngularInput() radius?: CanvasNodePropValue<'radius'>;
    @AngularInput() stroke?: CanvasNodePropValue<'stroke'>;
    @AngularInput() strokeWidth?: CanvasNodePropValue<'strokeWidth'>;
    @AngularInput() text?: CanvasNodePropValue<'text'>;
    @AngularInput() fontSize?: CanvasNodePropValue<'fontSize'>;
    @AngularInput() fontFamily?: CanvasNodePropValue<'fontFamily'>;
    @AngularInput() baseline?: CanvasNodePropValue<'baseline'>;
    @AngularInput() textAlign?: CanvasNodePropValue<'textAlign'>;
    @AngularInput() maxLines?: CanvasNodePropValue<'maxLines'>;

    @AngularInput() value?: CanvasNodePropValue<'value'>;
    @AngularInput() defaultValue?: CanvasNodePropValue<'defaultValue'>;
    @AngularInput() placeholder?: CanvasNodePropValue<'placeholder'>;
    @AngularInput() bgColor?: CanvasNodePropValue<'bgColor'>;
    @AngularInput() borderColor?: CanvasNodePropValue<'borderColor'>;
    @AngularInput() focusBorderColor?: CanvasNodePropValue<'focusBorderColor'>;
    @AngularInput() borderRadius?: CanvasNodePropValue<'borderRadius'>;
    @AngularInput() padding?: CanvasNodePropValue<'padding'>;
    @AngularInput() disabled?: CanvasNodePropValue<'disabled'>;
    @AngularInput() maxLength?: CanvasNodePropValue<'maxLength'>;
    @AngularInput() type?: CanvasNodePropValue<'type'>;
    @AngularInput() rows?: CanvasNodePropValue<'rows'>;
    @AngularInput() options?: CanvasNodePropValue<'options'>;
    @AngularInput() min?: CanvasNodePropValue<'min'>;
    @AngularInput() max?: CanvasNodePropValue<'max'>;
    @AngularInput() step?: CanvasNodePropValue<'step'>;
    @AngularInput() defaultChecked?: CanvasNodePropValue<'defaultChecked'>;
    @AngularInput() checked?: CanvasNodePropValue<'checked'>;
    @AngularInput() onColor?: CanvasNodePropValue<'onColor'>;
    @AngularInput() offColor?: CanvasNodePropValue<'offColor'>;
    @AngularInput() thumbColor?: CanvasNodePropValue<'thumbColor'>;
    @AngularInput() trackColor?: CanvasNodePropValue<'trackColor'>;
    @AngularInput() activeColor?: CanvasNodePropValue<'activeColor'>;
    @AngularInput() backgroundColor?: CanvasNodePropValue<'backgroundColor'>;
    @AngularInput() textColor?: CanvasNodePropValue<'textColor'>;
    @AngularInput() fontColor?: CanvasNodePropValue<'fontColor'>;
    @AngularInput() columns?: CanvasNodePropValue<'columns'>;
    @AngularInput() cellWidth?: CanvasNodePropValue<'cellWidth'>;
    @AngularInput() cellHeight?: CanvasNodePropValue<'cellHeight'>;
    @AngularInput() gap?: CanvasNodePropValue<'gap'>;
    @AngularInput() columnSpan?: CanvasNodePropValue<'columnSpan'>;
    @AngularInput() rowSpan?: CanvasNodePropValue<'rowSpan'>;
    @AngularInput() src?: CanvasNodePropValue<'src'>;
    @AngularInput() objectFit?: CanvasNodePropValue<'objectFit'>;
    @AngularInput() onError?: CanvasNodePropValue<'onError'>;
    @AngularInput() open?: CanvasNodePropValue<'open'>;
    @AngularInput() title?: CanvasNodePropValue<'title'>;
    @AngularInput() confirmText?: CanvasNodePropValue<'confirmText'>;
    @AngularInput() cancelText?: CanvasNodePropValue<'cancelText'>;
    @AngularInput() closeOnBackdrop?: CanvasNodePropValue<'closeOnBackdrop'>;
    @AngularInput() onConfirm?: CanvasNodePropValue<'onConfirm'>;
    @AngularInput() onCancel?: CanvasNodePropValue<'onCancel'>;
    @AngularInput() showText?: CanvasNodePropValue<'showText'>;
    @AngularInput() activeKey?: CanvasNodePropValue<'activeKey'>;
    @AngularInput() defaultActiveKey?: CanvasNodePropValue<'defaultActiveKey'>;
    @AngularInput() headerHeight?: CanvasNodePropValue<'headerHeight'>;
    @AngularInput() indicatorColor?: CanvasNodePropValue<'indicatorColor'>;
    @AngularInput() id?: CanvasNodePropValue<'id'>;
    @AngularInput() activeKeys?: CanvasNodePropValue<'activeKeys'>;
    @AngularInput() defaultActiveKeys?: CanvasNodePropValue<'defaultActiveKeys'>;
    @AngularInput() accordion?: CanvasNodePropValue<'accordion'>;
    @AngularInput() direction?: CanvasNodePropValue<'direction'>;
    @AngularInput() optionHeight?: CanvasNodePropValue<'optionHeight'>;
    @AngularInput() disabledColor?: CanvasNodePropValue<'disabledColor'>;
    @AngularInput() onScroll?: CanvasNodePropValue<'onScroll'>;
    @AngularInput() accept?: CanvasNodePropValue<'accept'>;
    @AngularInput() multiple?: CanvasNodePropValue<'multiple'>;
    @AngularInput() icon?: CanvasNodePropValue<'icon'>;
    @AngularInput() iconSize?: CanvasNodePropValue<'iconSize'>;
    @AngularInput() activeIndex?: CanvasNodePropValue<'activeIndex'>;
    @AngularInput() defaultActiveIndex?: CanvasNodePropValue<'defaultActiveIndex'>;
    @AngularInput() autoplay?: CanvasNodePropValue<'autoplay'>;
    @AngularInput() interval?: CanvasNodePropValue<'interval'>;
    @AngularInput() transitionDuration?: CanvasNodePropValue<'transitionDuration'>;
    @AngularInput() loop?: CanvasNodePropValue<'loop'>;
    @AngularInput() showArrows?: CanvasNodePropValue<'showArrows'>;
    @AngularInput() showDots?: CanvasNodePropValue<'showDots'>;
    @AngularInput() arrowColor?: CanvasNodePropValue<'arrowColor'>;
    @AngularInput() dotColor?: CanvasNodePropValue<'dotColor'>;
    @AngularInput() activeDotColor?: CanvasNodePropValue<'activeDotColor'>;
    @AngularInput() draw?: CanvasNodePropValue<'draw'>;
    @AngularInput() hitTest?: CanvasNodePropValue<'hitTest'>;
    @AngularInput() source?: CanvasNodePropValue<'source'>;
    @AngularInput() fit?: CanvasNodePropValue<'fit'>;
    @AngularInput() name?: CanvasNodePropValue<'name'>;
    @AngularInput() variant?: CanvasNodePropValue<'variant'>;
    @AngularInput() onPointerEvent?: CanvasNodePropValue<'onPointerEvent'>;

    @AngularInput() onChange?: CanvasNodePropValue<'onChange'>;
    @AngularInput() onClick?: CanvasNodePropValue<'onClick'>;
    @AngularInput() onFocus?: () => void;
    @AngularInput() onBlur?: () => void;

    @Output() readonly change = new EventEmitter<string | number | boolean | string[] | File[]>();
    @Output() readonly valueChange = new EventEmitter<string | number>();
    @Output() readonly checkedChange = new EventEmitter<boolean>();
    @Output() readonly activeKeyChange = new EventEmitter<string>();
    @Output() readonly activeIndexChange = new EventEmitter<number>();
    @Output() readonly activeKeysChange = new EventEmitter<string[]>();
    @Output() readonly confirm = new EventEmitter<void>();
    @Output() readonly cancel = new EventEmitter<void>();
    @Output() readonly imageError = new EventEmitter<Error>();
    @Output() readonly click = new EventEmitter<void | CustomDrawClickEvent>();
    @Output() readonly focus = new EventEmitter<void>();
    @Output() readonly blur = new EventEmitter<void>();

    protected constructor(elementRef: ElementRef<HTMLElement>) {
        (elementRef.nativeElement as NodeElement)[NODE_REF] = this;
    }

    abstract readonly kind: ComponentKind;

    getProps(): Record<string, unknown> {
        const props: Record<string, unknown> = {};
        const values = this as unknown as Record<string, unknown>;
        for (const key of PROP_KEYS) {
            if (values[key] !== undefined) props[key] = values[key];
        }
        if (this.key !== undefined) props.key = String(this.key);
        props.onChange = this.dispatchChange;
        props.onClick = this.dispatchClick;
        props.onFocus = this.dispatchFocus;
        props.onBlur = this.dispatchBlur;
        props.onConfirm = this.dispatchConfirm;
        props.onCancel = this.dispatchCancel;
        props.onError = this.dispatchImageError;
        return props;
    }

    readonly dispatchChange = (value: string | number | boolean | string[] | File[]): void => {
        const callback = this.onChange;
        if (typeof callback === 'function') {
            (callback as (value: string | number | boolean | string[] | File[]) => void)(value);
        }
        this.change.emit(value);
        if (this.kind === 'switch') this.checkedChange.emit(Boolean(value));
        else if (this.kind === 'tabs' && typeof value === 'string')
            this.activeKeyChange.emit(value);
        else if (this.kind === 'carousel' && typeof value === 'number')
            this.activeIndexChange.emit(value);
        else if (this.kind === 'collapse' && Array.isArray(value))
            this.activeKeysChange.emit(value as string[]);
        else if (
            this.kind === 'input' ||
            this.kind === 'textarea' ||
            this.kind === 'datePicker' ||
            this.kind === 'dropdown' ||
            this.kind === 'slider'
        ) {
            this.valueChange.emit(value as string | number);
        }
    };

    readonly dispatchClick = (event?: CustomDrawClickEvent): void => {
        if (typeof this.onClick === 'function') {
            if (this.kind === 'customDraw') {
                if (!event) throw new Error('CustomDraw click event data is required.');
                (this.onClick as (clickEvent: CustomDrawClickEvent) => void)(event);
            } else {
                (this.onClick as () => void)();
            }
        }
        this.click.emit(event);
    };

    readonly dispatchFocus = (): void => {
        this.onFocus?.();
        this.focus.emit();
    };

    readonly dispatchBlur = (): void => {
        this.onBlur?.();
        this.blur.emit();
    };

    readonly dispatchConfirm = (): void => {
        this.onConfirm?.();
        this.confirm.emit();
    };

    readonly dispatchCancel = (): void => {
        this.onCancel?.();
        this.cancel.emit();
    };

    readonly dispatchImageError = (error: Error): void => {
        this.onError?.(error);
        this.imageError.emit(error);
    };
}

@Directive({ selector: 'canvas-group', standalone: true })
export class Group extends CanvasNodeDirective {
    readonly kind = 'group';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-grid', standalone: true })
export class Grid extends CanvasNodeDirective {
    readonly kind = 'grid';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-grid-item', standalone: true })
export class GridItem extends CanvasNodeDirective {
    readonly kind = 'gridItem';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-image', standalone: true })
export class Image extends CanvasNodeDirective {
    readonly kind = 'image';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-dialog', standalone: true })
export class Dialog extends CanvasNodeDirective {
    readonly kind = 'dialog';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-progress', standalone: true })
export class Progress extends CanvasNodeDirective {
    readonly kind = 'progress';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-tabs', standalone: true })
export class Tabs extends CanvasNodeDirective {
    readonly kind = 'tabs';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-tab-item', standalone: true })
export class TabItem extends CanvasNodeDirective {
    readonly kind = 'tabItem';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-collapse', standalone: true })
export class Collapse extends CanvasNodeDirective {
    readonly kind = 'collapse';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-collapse-item', standalone: true })
export class CollapseItem extends CanvasNodeDirective {
    readonly kind = 'collapseItem';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-custom-draw', standalone: true })
export class CustomDraw extends CanvasNodeDirective {
    readonly kind = 'customDraw';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-view', standalone: true })
export class CanvasView extends CanvasNodeDirective {
    readonly kind = 'canvasView';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-icon', standalone: true })
export class Icon extends CanvasNodeDirective {
    readonly kind = 'icon';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-rect', standalone: true })
export class Rect extends CanvasNodeDirective {
    readonly kind = 'rect';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-circle', standalone: true })
export class Circle extends CanvasNodeDirective {
    readonly kind = 'circle';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-text', standalone: true })
export class Text extends CanvasNodeDirective {
    readonly kind = 'text';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-input', standalone: true })
export class Input extends CanvasNodeDirective {
    readonly kind = 'input';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-date-picker', standalone: true })
export class DatePicker extends CanvasNodeDirective {
    readonly kind = 'datePicker';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-radio', standalone: true })
export class Radio extends CanvasNodeDirective {
    readonly kind = 'radio';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-checkbox', standalone: true })
export class Checkbox extends CanvasNodeDirective {
    readonly kind = 'checkbox';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-upload', standalone: true })
export class Upload extends CanvasNodeDirective {
    readonly kind = 'upload';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-carousel', standalone: true })
export class Carousel extends CanvasNodeDirective {
    readonly kind = 'carousel';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-carousel-item', standalone: true })
export class CarouselItem extends CanvasNodeDirective {
    readonly kind = 'carouselItem';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-textarea', standalone: true })
export class Textarea extends CanvasNodeDirective {
    readonly kind = 'textarea';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-dropdown', standalone: true })
export class Dropdown extends CanvasNodeDirective {
    readonly kind = 'dropdown';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-slider', standalone: true })
export class Slider extends CanvasNodeDirective {
    readonly kind = 'slider';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-switch', standalone: true })
export class Switch extends CanvasNodeDirective {
    readonly kind = 'switch';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

@Directive({ selector: 'canvas-button', standalone: true })
export class Button extends CanvasNodeDirective {
    readonly kind = 'button';
    constructor(elementRef: ElementRef<HTMLElement>) {
        super(elementRef);
    }
}

export function readCanvasNode(element: HTMLElement): CanvasNodeDirective | undefined {
    return (element as NodeElement)[NODE_REF];
}
