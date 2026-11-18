export function getGridItemWidth({
    width,
    columns,
    gap,
    columnSpan,
}: {
    width: number;
    columns: number;
    gap: number;
    columnSpan: number;
}) {
    const cellWidth = (width - gap * (columns - 1)) / columns;
    return cellWidth * columnSpan + gap * (columnSpan - 1);
}
