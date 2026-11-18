import { subscribeCanvasImage } from '../image-assets';
import type { VNode } from '../types';
import type { EngineCore, EngineState } from './state';

/**
 * Subscribes the engine to the shared image cache for every `image` source in the
 * tree, tearing down subscriptions for sources that disappear. Load errors mark the
 * scene dirty and forward to each image node's `onError` callback.
 */

export function syncImages(core: EngineCore, state: EngineState, tree: VNode[]): void {
    const sources = new Set<string>();
    const visit = (nodes: VNode[]) =>
        nodes.forEach((node) => {
            if (node.type === 'image' && typeof node.props.src === 'string' && node.props.src) {
                sources.add(node.props.src);
            }
            visit(node.children);
        });
    visit(tree);
    for (const [source, dispose] of state.imageSubscriptions) {
        if (!sources.has(source)) {
            dispose();
            state.imageSubscriptions.delete(source);
        }
    }
    for (const source of sources) {
        if (state.imageSubscriptions.has(source)) continue;
        const dispose = subscribeCanvasImage(source, (error) => {
            core.scene.markDirty();
            if (error) {
                core.scene.traverse((node) => {
                    if (node.type === 'image' && node.props.src === source) {
                        (node.props.onError as ((error: Error) => void) | undefined)?.(error);
                    }
                });
            }
        });
        state.imageSubscriptions.set(source, dispose);
    }
}
