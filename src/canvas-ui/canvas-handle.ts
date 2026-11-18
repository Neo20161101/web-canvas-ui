import type { CanvasEngine } from './engine';

export interface CanvasExportOptions {
    /** Output dimensions in logical pixels; pixelRatio determines the bitmap resolution. */
    width?: number;
    height?: number;
    /** Output pixels per logical pixel. Defaults to the Canvas device pixel ratio. */
    pixelRatio?: number;
    type?: string;
    /** Image quality from 0 to 1; used by lossy formats such as JPEG and WebP. */
    quality?: number;
}

export interface CanvasHandle {
    getCanvas(): HTMLCanvasElement | null;
    requestRender(): void;
    toDataURL(optionsOrType?: CanvasExportOptions | string, quality?: number): string;
    toBlob(optionsOrType?: CanvasExportOptions | string, quality?: number): Promise<Blob>;
}

export function getDevicePixelRatio(): number {
    return Math.max(1, window.devicePixelRatio || 1);
}

export function normalizeExportOptions(
    optionsOrType: CanvasExportOptions | string = {},
    legacyQuality?: number,
): Required<Pick<CanvasExportOptions, 'type'>> & CanvasExportOptions {
    return typeof optionsOrType === 'string'
        ? { type: optionsOrType, quality: legacyQuality }
        : { ...optionsOrType, type: optionsOrType.type ?? 'image/png' };
}

export function exportCanvasDataURL(
    canvas: HTMLCanvasElement,
    type: string,
    quality?: number,
): string {
    try {
        return canvas.toDataURL(type, quality);
    } catch (error) {
        if (isSecurityError(error)) throw createCrossOriginExportError();
        throw error;
    }
}

export function exportCanvasBlob(
    canvas: HTMLCanvasElement,
    type: string,
    quality?: number,
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        try {
            canvas.toBlob(
                (blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Canvas image export failed.'));
                },
                type,
                quality,
            );
        } catch (error) {
            reject(isSecurityError(error) ? createCrossOriginExportError() : error);
        }
    });
}

export function createExportCanvas(
    source: HTMLCanvasElement,
    engine: CanvasEngine | null,
    options: CanvasExportOptions,
    defaultPixelRatio: number,
): HTMLCanvasElement {
    const pixelRatio = options.pixelRatio ?? defaultPixelRatio;
    if (!Number.isFinite(pixelRatio) || pixelRatio <= 0) {
        throw new RangeError('Export pixelRatio must be a positive finite number.');
    }
    const logicalWidth = options.width ?? source.width / defaultPixelRatio;
    const logicalHeight = options.height ?? source.height / defaultPixelRatio;
    if (
        !Number.isFinite(logicalWidth) ||
        logicalWidth <= 0 ||
        !Number.isFinite(logicalHeight) ||
        logicalHeight <= 0
    ) {
        throw new RangeError('Export width and height must be positive finite numbers.');
    }
    const output = document.createElement('canvas');
    output.width = Math.max(1, Math.round(logicalWidth * pixelRatio));
    output.height = Math.max(1, Math.round(logicalHeight * pixelRatio));
    const context = output.getContext('2d');
    if (!context) throw new Error('Canvas 2D context is not available for image export.');
    if (engine) {
        engine.renderTo(context, output.width / logicalWidth, output.height / logicalHeight);
    } else {
        context.drawImage(source, 0, 0, output.width, output.height);
    }
    return output;
}

function isSecurityError(error: unknown): boolean {
    return (
        typeof error === 'object' &&
        error !== null &&
        'name' in error &&
        error.name === 'SecurityError'
    );
}

function createCrossOriginExportError(): Error {
    return new Error(
        'Canvas 导出失败：画布包含未授权跨域读取的图片。请配置图片服务器 CORS（Access-Control-Allow-Origin），或移除该跨域图片后重试。',
    );
}
