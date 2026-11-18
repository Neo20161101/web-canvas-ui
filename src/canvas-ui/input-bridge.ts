import type {
    InputEvents,
    InputLayout,
    TextControlProps,
    WebInputBridge as WebInputBridgeContract,
} from './types';

interface MountedInput {
    element: HTMLInputElement | HTMLTextAreaElement;
    events: InputEvents;
}

export class WebInputBridge implements WebInputBridgeContract {
    private readonly mounted = new Map<string, MountedInput>();
    private readonly fileInputs = new Set<HTMLInputElement>();
    private readonly originalDisplay: string;
    private overlayHidden = false;
    private readonly overlay: HTMLElement;

    constructor(overlay: HTMLElement) {
        this.overlay = overlay;
        this.originalDisplay = overlay.style.display;
    }

    mount(
        id: string,
        props: TextControlProps,
        layout: InputLayout,
        events: InputEvents,
    ): () => void {
        this.unmount(id);
        const element = document.createElement(id.startsWith('textarea:') ? 'textarea' : 'input');
        element.setAttribute('aria-label', props.placeholder || 'Canvas input');
        if (element instanceof HTMLInputElement) element.autocomplete = 'off';
        Object.assign(element.style, {
            position: 'absolute',
            left: '0',
            top: '0',
            margin: '0',
            padding: '0',
            border: '0',
            outline: '0',
            opacity: '0',
            color: 'transparent',
            caretColor: 'transparent',
            background: 'transparent',
            boxSizing: 'border-box',
            transformOrigin: '0 0',
            pointerEvents: 'auto',
        });
        element.addEventListener('input', this.handleInput);
        element.addEventListener('select', this.handleSelection);
        element.addEventListener('focus', this.handleFocus);
        element.addEventListener('blur', this.handleBlur);
        if (element instanceof HTMLTextAreaElement) {
            element.addEventListener('scroll', this.handleTextareaScroll);
        }
        this.mounted.set(id, { element, events });
        this.overlay.appendChild(element);
        this.update(id, props, layout);
        return () => this.unmount(id);
    }

    update(id: string, props: TextControlProps, layout: InputLayout): void {
        const mounted = this.mounted.get(id);
        if (!mounted) return;
        const { element } = mounted;
        const value = props.value ?? props.defaultValue ?? '';
        if (element instanceof HTMLInputElement) {
            element.type = id.startsWith('datePicker:')
                ? 'date'
                : 'type' in props
                  ? (props.type ?? 'text')
                  : 'text';
        }
        element.placeholder = props.placeholder ?? '';
        element.disabled = props.disabled ?? false;
        const maxLength = 'maxLength' in props ? props.maxLength : undefined;
        if (typeof maxLength === 'number' && Number.isInteger(maxLength) && maxLength >= 0) {
            element.maxLength = maxLength;
        } else {
            element.removeAttribute('maxLength');
        }
        if (element.value !== value) element.value = value;
        Object.assign(element.style, {
            display: layout.visible ? 'block' : 'none',
            width: `${layout.width}px`,
            height: `${layout.height}px`,
            transform: `matrix(${layout.transform.join(',')})`,
            resize: 'none',
            whiteSpace: element instanceof HTMLTextAreaElement ? 'pre-wrap' : 'normal',
        });
        if (element instanceof HTMLTextAreaElement) {
            const padding =
                'padding' in props && typeof props.padding === 'number' ? props.padding : 8;
            const fontSize = typeof props.fontSize === 'number' ? props.fontSize : 14;
            element.wrap = 'soft';
            Object.assign(element.style, {
                padding: `${padding}px`,
                fontFamily:
                    'fontFamily' in props ? (props.fontFamily ?? 'sans-serif') : 'sans-serif',
                fontSize: `${fontSize}px`,
                lineHeight: '1.35',
                overflowY: 'auto',
                overflowX: 'hidden',
            });
            mounted.events.scroll(element.scrollTop, element.scrollHeight, element.clientHeight);
        }
    }

    pickFiles(
        accept: string | undefined,
        multiple: boolean,
        onChange: (files: File[]) => void,
    ): void {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept ?? '';
        input.multiple = multiple;
        Object.assign(input.style, {
            position: 'fixed',
            width: '1px',
            height: '1px',
            opacity: '0',
            pointerEvents: 'none',
        });
        const cleanup = () => {
            input.removeEventListener('change', handleChange);
            input.removeEventListener('cancel', cleanup);
            input.remove();
            this.fileInputs.delete(input);
        };
        const handleChange = () => {
            const files = Array.from(input.files ?? []);
            cleanup();
            if (files.length) onChange(files);
        };
        input.addEventListener('change', handleChange, { once: true });
        input.addEventListener('cancel', cleanup, { once: true });
        this.fileInputs.add(input);
        this.overlay.ownerDocument.body.appendChild(input);
        input.click();
    }

    focus(id: string): void {
        this.mounted.get(id)?.element.focus();
    }

    setOverlayVisible(visible: boolean): void {
        if (visible) {
            if (!this.overlayHidden) return;
            this.overlay.style.display = this.originalDisplay;
            this.overlayHidden = false;
            return;
        }
        if (this.overlayHidden) return;

        const activeElement = this.overlay.ownerDocument.activeElement;
        if (activeElement instanceof HTMLElement && this.overlay.contains(activeElement)) {
            activeElement.blur();
        }
        this.overlay.style.display = 'none';
        this.overlayHidden = true;
    }

    private unmount(id: string): void {
        const mounted = this.mounted.get(id);
        if (!mounted) return;
        const { element } = mounted;
        element.removeEventListener('input', this.handleInput);
        element.removeEventListener('select', this.handleSelection);
        element.removeEventListener('focus', this.handleFocus);
        element.removeEventListener('blur', this.handleBlur);
        if (element instanceof HTMLTextAreaElement) {
            element.removeEventListener('scroll', this.handleTextareaScroll);
        }
        element.remove();
        this.mounted.delete(id);
    }

    destroy(): void {
        this.setOverlayVisible(true);
        for (const id of this.mounted.keys()) this.unmount(id);
        this.fileInputs.forEach((input) => input.remove());
        this.fileInputs.clear();
    }

    private find(target: EventTarget | null): MountedInput | undefined {
        for (const mounted of this.mounted.values()) {
            if (mounted.element === target) return mounted;
        }
        return undefined;
    }

    private readonly handleInput = (event: Event) => {
        const mounted = this.find(event.currentTarget);
        if (mounted) {
            mounted.events.input(
                mounted.element.value,
                mounted.element.selectionStart ?? mounted.element.value.length,
            );
        }
    };

    private readonly handleSelection = (event: Event) => {
        const mounted = this.find(event.currentTarget);
        if (mounted) {
            mounted.events.selection(
                mounted.element.selectionStart ?? mounted.element.value.length,
            );
        }
    };

    private readonly handleFocus = (event: Event) => this.find(event.currentTarget)?.events.focus();
    private readonly handleBlur = (event: Event) => this.find(event.currentTarget)?.events.blur();
    private readonly handleTextareaScroll = (event: Event) => {
        const mounted = this.find(event.currentTarget);
        if (mounted?.element instanceof HTMLTextAreaElement) {
            mounted.events.scroll(
                mounted.element.scrollTop,
                mounted.element.scrollHeight,
                mounted.element.clientHeight,
            );
        }
    };
}
