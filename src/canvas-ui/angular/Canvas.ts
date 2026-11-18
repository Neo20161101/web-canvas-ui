import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import type {
    AfterContentChecked,
    AfterViewInit,
    OnChanges,
    OnDestroy,
    SimpleChanges,
} from '@angular/core';
import { CanvasEngine } from '../engine';
import {
    createExportCanvas,
    exportCanvasBlob,
    exportCanvasDataURL,
    getDevicePixelRatio,
    normalizeExportOptions,
} from '../canvas-handle';
import type { CanvasExportOptions, CanvasHandle } from '../canvas-handle';
import { WebInputBridge } from '../input-bridge';
import type { CanvasPointerEvent, CanvasUIEvent, VNode } from '../types';
import { readCanvasNode } from './node-directives';

@Component({
    selector: 'canvas-ui',
    standalone: true,
    exportAs: 'canvasUi',
    styles: [':host { display: block; }'],
    template: `
        <div
            [class]="className ?? ''"
            [style.position]="'relative'"
            [style.width.px]="width"
            [style.height.px]="height"
            (wheel)="wheel($event)"
        >
            <canvas
                #canvas
                [attr.aria-label]="ariaLabel"
                [style.display]="'block'"
                [style.width]="'100%'"
                [style.height]="'100%'"
                (pointerdown)="pointerDown($event)"
                (pointermove)="pointerMove($event)"
                (pointerup)="pointerUp($event)"
                (pointercancel)="pointerCancel($event)"
            ></canvas>
            <div
                #overlay
                [style.position]="'absolute'"
                [style.inset]="'0'"
                [style.overflow]="'hidden'"
                [style.pointerEvents]="'none'"
            ></div>
            <div #source [style.display]="'none'"><ng-content></ng-content></div>
        </div>
    `,
})
export class Canvas
    implements CanvasHandle, AfterContentChecked, AfterViewInit, OnChanges, OnDestroy
{
    @Input({ required: true }) width!: number;
    @Input({ required: true }) height!: number;
    @Input() className?: string;
    @Input() style?: Record<string, string | number | null | undefined>;
    @Input() ariaLabel = 'Canvas';
    @Input() onFrame?: (time: number) => void;
    @Input() onEvent?: (event: CanvasUIEvent) => void;

    @ViewChild('canvas') private canvasRef?: ElementRef<HTMLCanvasElement>;
    @ViewChild('overlay') private overlayRef?: ElementRef<HTMLDivElement>;
    @ViewChild('source') private sourceRef?: ElementRef<HTMLDivElement>;

    private engine: CanvasEngine | null = null;
    private ratio = 1;
    private initialized = false;
    private appliedStyleKeys = new Set<string>();

    ngAfterViewInit(): void {
        this.initialized = true;
        this.applyContainerStyle();
        this.initializeEngine();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['style'] && this.initialized) this.applyContainerStyle();
        if (this.initialized && (changes['width'] || changes['height'])) {
            this.initializeEngine();
        }
    }

    ngAfterContentChecked(): void {
        this.engine?.update(this.compileChildren());
    }

    ngOnDestroy(): void {
        this.initialized = false;
        this.disposeEngine();
    }

    getCanvas(): HTMLCanvasElement | null {
        return this.canvasRef?.nativeElement ?? null;
    }

    requestRender(): void {
        this.engine?.requestRender();
    }

    toDataURL(optionsOrType: CanvasExportOptions | string = {}, quality?: number): string {
        const canvas = this.getCanvas();
        if (!canvas) throw new Error('Canvas is not mounted.');
        const options = normalizeExportOptions(optionsOrType, quality);
        return exportCanvasDataURL(
            createExportCanvas(canvas, this.engine, options, this.ratio),
            options.type,
            options.quality,
        );
    }

    toBlob(optionsOrType: CanvasExportOptions | string = {}, quality?: number): Promise<Blob> {
        return new Promise((resolve, reject) => {
            const canvas = this.getCanvas();
            if (!canvas) {
                reject(new Error('Canvas is not mounted.'));
                return;
            }
            const options = normalizeExportOptions(optionsOrType, quality);
            exportCanvasBlob(
                createExportCanvas(canvas, this.engine, options, this.ratio),
                options.type,
                options.quality,
            ).then(resolve, reject);
        });
    }

    pointerDown(event: PointerEvent): void {
        const normalized = this.normalizePointerEvent(event);
        if (normalized) this.engine?.pointerDown(normalized);
    }

    pointerMove(event: PointerEvent): void {
        const normalized = this.normalizePointerEvent(event);
        if (normalized) this.engine?.pointerMove(normalized);
    }

    pointerUp(event: PointerEvent): void {
        const normalized = this.normalizePointerEvent(event);
        if (normalized) this.engine?.pointerUp(normalized);
    }

    pointerCancel(event: PointerEvent): void {
        const normalized = this.normalizePointerEvent(event);
        if (normalized) this.engine?.pointerUp(normalized, true);
    }

    wheel(event: WheelEvent): void {
        const canvas = this.canvasRef?.nativeElement;
        if (!canvas) return;
        this.engine?.wheel({
            currentTarget: canvas,
            clientX: event.clientX,
            clientY: event.clientY,
            deltaY: event.deltaY,
            preventDefault: () => event.preventDefault(),
        });
    }

    private initializeEngine(): void {
        const canvas = this.canvasRef?.nativeElement;
        const overlay = this.overlayRef?.nativeElement;
        if (!canvas || !overlay) return;

        this.disposeEngine();
        this.ratio = getDevicePixelRatio();
        canvas.width = Math.round(this.width * this.ratio);
        canvas.height = Math.round(this.height * this.ratio);
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas 2D context is not available.');
        context.scale(this.ratio, this.ratio);
        this.engine = new CanvasEngine(
            context,
            new WebInputBridge(overlay),
            (time) => this.onFrame?.(time),
            this.ratio,
            (event) => this.onEvent?.(event),
        );
        this.engine.update(this.compileChildren());
        this.engine.start();
    }

    private disposeEngine(): void {
        this.engine?.destroy();
        this.engine = null;
    }

    private compileChildren(): VNode[] {
        const source = this.sourceRef?.nativeElement;
        if (!source) return [];
        return this.compileFrom(source);
    }

    private compileFrom(parent: ParentNode): VNode[] {
        const result: VNode[] = [];
        for (const child of Array.from(parent.childNodes)) {
            if (child.nodeType !== Node.ELEMENT_NODE) continue;
            const element = child as HTMLElement;
            const directive = readCanvasNode(element);
            if (!directive) {
                result.push(...this.compileFrom(element));
                continue;
            }

            const props = directive.getProps();
            const keyValue = props['key'];
            delete props['key'];
            if (
                (directive.kind === 'text' || directive.kind === 'button') &&
                props['text'] === undefined
            ) {
                const content = element.textContent?.trim();
                if (content) props['text'] = content;
            }
            result.push({
                type: directive.kind,
                key: keyValue === undefined ? null : String(keyValue),
                props,
                children:
                    directive.kind === 'group' ||
                    directive.kind === 'grid' ||
                    directive.kind === 'gridItem' ||
                    directive.kind === 'dialog' ||
                    directive.kind === 'tabs' ||
                    directive.kind === 'tabItem' ||
                    directive.kind === 'collapse' ||
                    directive.kind === 'collapseItem' ||
                    directive.kind === 'carousel' ||
                    directive.kind === 'carouselItem'
                        ? this.compileFrom(element)
                        : [],
            });
        }
        return result;
    }

    private normalizePointerEvent(event: PointerEvent): CanvasPointerEvent | null {
        const currentTarget = this.canvasRef?.nativeElement;
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
    }

    private applyContainerStyle(): void {
        const container = this.canvasRef?.nativeElement.parentElement;
        if (!container) return;
        for (const key of this.appliedStyleKeys) {
            if (!(key in (this.style ?? {}))) {
                (container.style as unknown as Record<string, string>)[key] = '';
            }
        }
        this.appliedStyleKeys.clear();
        for (const [key, value] of Object.entries(this.style ?? {})) {
            if (value === null || value === undefined) continue;
            (container.style as unknown as Record<string, string>)[key] = String(value);
            this.appliedStyleKeys.add(key);
        }
        container.style.position = 'relative';
        container.style.width = `${this.width}px`;
        container.style.height = `${this.height}px`;
    }
}
