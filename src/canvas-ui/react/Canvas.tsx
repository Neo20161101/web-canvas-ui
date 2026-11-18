import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { compileChildren } from './components';
import { CanvasEngine } from '../engine';
import { WebInputBridge } from '../input-bridge';
import {
    createExportCanvas,
    exportCanvasBlob,
    exportCanvasDataURL,
    getDevicePixelRatio,
    normalizeExportOptions,
} from '../canvas-handle';
import type { CanvasExportOptions, CanvasHandle } from '../canvas-handle';
import type { CanvasProps } from '../types';

export type { CanvasExportOptions, CanvasHandle } from '../canvas-handle';

export const Canvas = forwardRef<CanvasHandle, CanvasProps>(function Canvas(
    { width, height, style, className, ariaLabel = 'Canvas', onFrame, onEvent, children },
    ref,
) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<CanvasEngine | null>(null);
    const pixelRatioRef = useRef(1);
    const tree = useMemo(() => compileChildren(children), [children]);
    const onFrameRef = useRef(onFrame);
    onFrameRef.current = onFrame;
    const onEventRef = useRef<CanvasProps['onEvent']>(undefined);
    onEventRef.current = onEvent;

    useImperativeHandle(
        ref,
        () => ({
            getCanvas: () => canvasRef.current,
            requestRender: () => engineRef.current?.requestRender(),
            toDataURL: (optionsOrType: CanvasExportOptions | string = {}, legacyQuality) => {
                const canvas = canvasRef.current;
                if (!canvas) throw new Error('Canvas is not mounted.');
                const options = normalizeExportOptions(optionsOrType, legacyQuality);
                return exportCanvasDataURL(
                    createExportCanvas(canvas, engineRef.current, options, pixelRatioRef.current),
                    options.type,
                    options.quality,
                );
            },
            toBlob: (optionsOrType: CanvasExportOptions | string = {}, legacyQuality) =>
                new Promise((resolve, reject) => {
                    const canvas = canvasRef.current;
                    if (!canvas) {
                        reject(new Error('Canvas is not mounted.'));
                        return;
                    }
                    const options = normalizeExportOptions(optionsOrType, legacyQuality);
                    exportCanvasBlob(
                        createExportCanvas(
                            canvas,
                            engineRef.current,
                            options,
                            pixelRatioRef.current,
                        ),
                        options.type,
                        options.quality,
                    ).then(resolve, reject);
                }),
        }),
        [],
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        const overlay = overlayRef.current;
        const container = containerRef.current;
        if (!canvas || !overlay || !container) return;

        const ratio = getDevicePixelRatio();
        pixelRatioRef.current = ratio;
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas 2D context is not available.');
        context.scale(ratio, ratio);

        const engine = new CanvasEngine(
            context,
            new WebInputBridge(overlay),
            (time) => onFrameRef.current?.(time),
            ratio,
            (event) => onEventRef.current?.(event),
        );
        engineRef.current = engine;
        engine.update(tree);
        engine.start();
        const wheel = (event: WheelEvent) => {
            engine.wheel({
                currentTarget: canvas,
                clientX: event.clientX,
                clientY: event.clientY,
                deltaY: event.deltaY,
                preventDefault: () => event.preventDefault(),
            });
        };
        container.addEventListener('wheel', wheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', wheel);
            engine.destroy();
            engineRef.current = null;
        };
    }, [width, height]);

    useEffect(() => {
        engineRef.current?.update(tree);
    }, [tree]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{ ...style, position: 'relative', width, height }}
        >
            <canvas
                ref={canvasRef}
                aria-label={ariaLabel}
                style={{ display: 'block', width: '100%', height: '100%' }}
                onPointerDown={(event) => engineRef.current?.pointerDown(event)}
                onPointerMove={(event) => engineRef.current?.pointerMove(event)}
                onPointerUp={(event) => engineRef.current?.pointerUp(event)}
                onPointerCancel={(event) => engineRef.current?.pointerUp(event, true)}
            />
            <div
                ref={overlayRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    overflow: 'hidden',
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
});
