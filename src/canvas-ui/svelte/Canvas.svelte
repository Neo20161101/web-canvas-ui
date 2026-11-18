<script lang="ts">
    import { setContext, type Snippet } from 'svelte';
    import { createExportCanvas, getDevicePixelRatio, normalizeExportOptions } from '../canvas-handle';
    import type { CanvasExportOptions } from '../canvas-handle';
    import { CanvasEngine } from '../engine';
    import { WebInputBridge } from '../input-bridge';
    import type { CanvasPointerEvent, CanvasUIEvent } from '../types';
    import { buildTree, canvasScopeKey, createRootScope } from './registry';

    interface Props {
        width: number;
        height: number;
        class?: string;
        className?: string;
        style?: string | Record<string, string | number | undefined>;
        ariaLabel?: string;
        onFrame?: (time: number) => void;
        onEvent?: (event: CanvasUIEvent) => void;
        children?: Snippet;
    }

    let {
        width,
        height,
        class: classNameProp,
        className,
        style,
        ariaLabel = 'Canvas',
        onFrame,
        onEvent,
        children,
    }: Props = $props();

    let canvasElement: HTMLCanvasElement;
    let containerElement: HTMLDivElement;
    let overlayElement: HTMLDivElement;
    let engine: CanvasEngine | null = null;
    let actualPixelRatio = 1;
    const scope = createRootScope(() => engine?.update(buildTree(scope)));
    setContext(canvasScopeKey, scope);

    const canvasStyle = $derived([
        typeof style === 'string' ? style : objectStyle(style),
        `position:relative;width:${width}px;height:${height}px`,
    ].filter(Boolean).join(';'));

    function objectStyle(value: Props['style']): string {
        if (!value || typeof value !== 'object') return '';
        const unitless = new Set([
            'animationIterationCount', 'borderImageOutset', 'borderImageSlice', 'borderImageWidth',
            'boxFlex', 'columnCount', 'flex', 'flexGrow', 'flexShrink', 'fontWeight', 'gridArea',
            'gridColumn', 'gridColumnEnd', 'gridColumnStart', 'gridRow', 'gridRowEnd', 'gridRowStart',
            'lineHeight', 'opacity', 'order', 'orphans', 'scale', 'tabSize', 'widows', 'zIndex', 'zoom',
        ]);
        return Object.entries(value)
            .filter((entry): entry is [string, string | number] => entry[1] !== undefined)
            .map(([name, item]) => {
                const cssName = name.startsWith('--')
                    ? name
                    : name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
                const cssValue = typeof item === 'number' && item !== 0 && !unitless.has(name)
                    ? `${item}px`
                    : item;
                return `${cssName}:${cssValue}`;
            })
            .join(';');
    }

    function normalizePointer(event: PointerEvent): CanvasPointerEvent {
        return {
            currentTarget: canvasElement,
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
    }

    function normalizeWheel(event: WheelEvent) {
        return {
            currentTarget: canvasElement,
            clientX: event.clientX,
            clientY: event.clientY,
            deltaY: event.deltaY,
            preventDefault: () => event.preventDefault(),
        };
    }

    function initialize(): void {
        engine?.destroy();
        actualPixelRatio = getDevicePixelRatio();
        canvasElement.width = Math.round(width * actualPixelRatio);
        canvasElement.height = Math.round(height * actualPixelRatio);
        const context = canvasElement.getContext('2d');
        if (!context) throw new Error('Canvas 2D context is not available.');
        context.scale(actualPixelRatio, actualPixelRatio);
        engine = new CanvasEngine(
            context,
            new WebInputBridge(overlayElement),
            time => onFrame?.(time),
            actualPixelRatio,
            event => onEvent?.(event),
        );
        engine.update(buildTree(scope));
        engine.start();
    }

    export function getCanvas(): HTMLCanvasElement | null {
        return canvasElement ?? null;
    }

    export function requestRender(): void {
        engine?.requestRender();
    }

    export function toDataURL(optionsOrType: CanvasExportOptions | string = {}, quality?: number): string {
        if (!canvasElement) throw new Error('Canvas is not mounted.');
        const options = normalizeExportOptions(optionsOrType, quality);
        return createExportCanvas(canvasElement, engine, options, actualPixelRatio)
            .toDataURL(options.type, options.quality);
    }

    export function toBlob(
        optionsOrType: CanvasExportOptions | string = {},
        quality?: number,
    ): Promise<Blob> {
        return new Promise((resolve, reject) => {
            if (!canvasElement) {
                reject(new Error('Canvas is not mounted.'));
                return;
            }
            const options = normalizeExportOptions(optionsOrType, quality);
            createExportCanvas(canvasElement, engine, options, actualPixelRatio).toBlob(blob => {
                if (blob) resolve(blob);
                else reject(new Error('Canvas image export failed.'));
            }, options.type, options.quality);
        });
    }

    $effect(() => {
        width;
        height;
        if (!canvasElement || !overlayElement) return;
        initialize();
        return () => {
            engine?.destroy();
            engine = null;
        };
    });

    $effect(() => {
        if (!containerElement) return;
        const wheel = (event: WheelEvent) => engine?.wheel(normalizeWheel(event));
        containerElement.addEventListener('wheel', wheel, { passive: false });
        return () => containerElement.removeEventListener('wheel', wheel);
    });
</script>

<div
    bind:this={containerElement}
    class={classNameProp ?? className}
    style={canvasStyle}
>
    <canvas
        bind:this={canvasElement}
        aria-label={ariaLabel}
        style="display:block;width:100%;height:100%"
        onpointerdown={event => engine?.pointerDown(normalizePointer(event))}
        onpointermove={event => engine?.pointerMove(normalizePointer(event))}
        onpointerup={event => engine?.pointerUp(normalizePointer(event))}
        onpointercancel={event => engine?.pointerUp(normalizePointer(event), true)}
    ></canvas>
    <div
        bind:this={overlayElement}
        style="position:absolute;inset:0;overflow:hidden;pointer-events:none"
    ></div>
    {@render children?.()}
</div>
