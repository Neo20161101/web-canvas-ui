export function toggleCollapseKeys(
    current: readonly string[],
    key: string,
    accordion: boolean,
): string[] {
    const active = new Set(current);
    if (active.has(key)) {
        active.delete(key);
    } else {
        if (accordion) active.clear();
        active.add(key);
    }
    return [...active];
}
