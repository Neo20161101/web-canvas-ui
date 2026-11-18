import {
    defineComponent,
    h,
    onBeforeUnmount,
    onMounted,
    onUpdated,
    ref,
    watch,
    type PropType,
    type VNode as VueVNode,
} from 'vue';
import {
    createExportCanvas,
    exportCanvasBlob,
    exportCanvasDataURL,
    getDevicePixelRatio,
    normalizeExportOptions,
} from '../canvas-handle';
import type { CanvasExportOptions, CanvasHandle } from '../canvas-handle';
import { CanvasEngine } from '../engine';
import { WebInputBridge } from '../input-bridge';
import { compileVueChildren } from './compile';
import type { CanvasUIEvent } from '../types';

export interface VueCanvasProps {
    width: number;
    height: number;
    class?: string;
    style?: object | string;
    ariaLabel?: string;
    onFrame?: (time: number) => void;
    onEvent?: (event: CanvasUIEvent) => void;
}

export const Canvas = defineComponent({
    name: 'VueCanvas',
    props: {
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        class: { type: String, default: undefined },
        style: { type: [Object, String] as PropType<object | string>, default: undefined },
        ariaLabel: { type: String, default: 'Canvas' },
        onFrame: { type: Function as PropType<(time: number) => void>, default: undefined },
        onEvent: { type: Function as PropType<(event: CanvasUIEvent) => void>, default: undefined },
    },
    setup(props, { slots, expose }) {
        const canvasRef = ref<HTMLCanvasElement | null>(null);
        const overlayRef = ref<HTMLDivElement | null>(null);
        let engine: CanvasEngine | null = null;
        let pixelRatio = 1;
        let mounted = false;
        let wheelTarget: HTMLElement | null = null;

        const renderTree = () => compileVueChildren(slots.default?.() ?? []);
        const disposeEngine = () => {
            engine?.destroy();
            engine = null;
        };
        const initializeEngine = () => {
            const canvas = canvasRef.value;
            const overlay = overlayRef.value;
            if (!canvas || !overlay) return;

            disposeEngine();
            pixelRatio = getDevicePixelRatio();
            canvas.width = Math.round(props.width * pixelRatio);
            canvas.height = Math.round(props.height * pixelRatio);
            const context = canvas.getContext('2d');
            if (!context) throw new Error('Canvas 2D context is not available.');
            context.scale(pixelRatio, pixelRatio);
            engine = new CanvasEngine(
                context,
                new WebInputBridge(overlay),
                (time) => props.onFrame?.(time),
                pixelRatio,
                (event) => props.onEvent?.(event),
            );
            engine.update(renderTree());
            engine.start();
        };
        const pointerEvent = (event: PointerEvent) => {
            const currentTarget = canvasRef.value;
            if (!currentTarget) return null;
            return {
                currentTarget,
                clientX: event.clientX,
                clientY: event.clientY,
                pointerId: event.pointerId,
                pointerType: event.pointerType,
                pressure: event.pressure,
                isPrimary: event.isPrimary,
                button: event.button,
                buttons: event.buttons,
                preventDefault: () => event.preventDefault(),
            };
        };
        const pointerDown = (event: PointerEvent) => {
            const normalized = pointerEvent(event);
            if (normalized) engine?.pointerDown(normalized);
        };
        const pointerMove = (event: PointerEvent) => {
            const normalized = pointerEvent(event);
            if (normalized) engine?.pointerMove(normalized);
        };
        const pointerUp = (event: PointerEvent) => {
            const normalized = pointerEvent(event);
            if (normalized) engine?.pointerUp(normalized);
        };
        const pointerCancel = (event: PointerEvent) => {
            const normalized = pointerEvent(event);
            if (normalized) engine?.pointerUp(normalized, true);
        };
        const wheel = (event: WheelEvent) => {
            const currentTarget = canvasRef.value;
            if (!currentTarget) return;
            engine?.wheel({
                currentTarget,
                clientX: event.clientX,
                clientY: event.clientY,
                deltaY: event.deltaY,
                preventDefault: () => event.preventDefault(),
            });
        };

        const handle: CanvasHandle = {
            getCanvas: () => canvasRef.value,
            requestRender: () => engine?.requestRender(),
            toDataURL: (optionsOrType: CanvasExportOptions | string = {}, quality) => {
                const canvas = canvasRef.value;
                if (!canvas) throw new Error('Canvas is not mounted.');
                const options = normalizeExportOptions(optionsOrType, quality);
                return exportCanvasDataURL(
                    createExportCanvas(canvas, engine, options, pixelRatio),
                    options.type,
                    options.quality,
                );
            },
            toBlob: (optionsOrType: CanvasExportOptions | string = {}, quality) =>
                new Promise((resolve, reject) => {
                    const canvas = canvasRef.value;
                    if (!canvas) {
                        reject(new Error('Canvas is not mounted.'));
                        return;
                    }
                    const options = normalizeExportOptions(optionsOrType, quality);
                    exportCanvasBlob(
                        createExportCanvas(canvas, engine, options, pixelRatio),
                        options.type,
                        options.quality,
                    ).then(resolve, reject);
                }),
        };
        expose(handle);

        onMounted(() => {
            mounted = true;
            initializeEngine();
            const canvas = canvasRef.value;
            wheelTarget = canvas?.parentElement ?? null;
            canvas?.addEventListener('pointerdown', pointerDown);
            canvas?.addEventListener('pointermove', pointerMove);
            canvas?.addEventListener('pointerup', pointerUp);
            canvas?.addEventListener('pointercancel', pointerCancel);
            wheelTarget?.addEventListener('wheel', wheel, { passive: false });
        });
        onUpdated(() => engine?.update(renderTree()));
        watch(
            () => [props.width, props.height] as const,
            () => {
                if (mounted) initializeEngine();
            },
            { flush: 'post' },
        );
        onBeforeUnmount(() => {
            const canvas = canvasRef.value;
            canvas?.removeEventListener('pointerdown', pointerDown);
            canvas?.removeEventListener('pointermove', pointerMove);
            canvas?.removeEventListener('pointerup', pointerUp);
            canvas?.removeEventListener('pointercancel', pointerCancel);
            wheelTarget?.removeEventListener('wheel', wheel);
            wheelTarget = null;
            mounted = false;
            disposeEngine();
        });

        return (): VueVNode =>
            h(
                'div',
                {
                    class: props.class,
                    style: {
                        ...(typeof props.style === 'object' && props.style ? props.style : {}),
                        position: 'relative',
                        width: `${props.width}px`,
                        height: `${props.height}px`,
                    },
                },
                [
                    h('canvas', {
                        ref: canvasRef,
                        'aria-label': props.ariaLabel,
                        style: { display: 'block', width: '100%', height: '100%' },
                    }),
                    h('div', {
                        ref: overlayRef,
                        style: {
                            position: 'absolute',
                            inset: '0',
                            overflow: 'hidden',
                            pointerEvents: 'none',
                        },
                    }),
                ],
            );
    },
});
