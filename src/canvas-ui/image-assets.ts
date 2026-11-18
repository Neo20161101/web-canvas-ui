interface ImageAsset {
    image: HTMLImageElement;
    error: Error | null;
    listeners: Set<(error: Error | null) => void>;
}

const assets = new Map<string, ImageAsset>();

function loadAsset(src: string): ImageAsset {
    const existing = assets.get(src);
    if (existing) return existing;
    const image = new Image();
    const asset: ImageAsset = { image, error: null, listeners: new Set() };
    assets.set(src, asset);
    image.onload = () => asset.listeners.forEach((listener) => listener(null));
    image.onerror = () => {
        asset.error = new Error(`Canvas image failed to load: ${src}`);
        asset.listeners.forEach((listener) => listener(asset.error));
    };
    image.src = src;
    return asset;
}

export function getCanvasImage(src: string): HTMLImageElement | null {
    const asset = loadAsset(src);
    return asset.image.complete && asset.image.naturalWidth > 0 ? asset.image : null;
}

export function subscribeCanvasImage(
    src: string,
    listener: (error: Error | null) => void,
): () => void {
    const asset = loadAsset(src);
    asset.listeners.add(listener);
    if (asset.image.complete) listener(asset.error);
    return () => asset.listeners.delete(listener);
}
