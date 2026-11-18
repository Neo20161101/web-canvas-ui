import type { TransformProps } from '../../types';
import { createComponent } from '../shared';

export interface GridItemProps extends TransformProps {
    columnSpan?: number;
    rowSpan?: number;
    backgroundColor?: string;
    children?: unknown;
}

export const GridItem = createComponent<GridItemProps>('gridItem');
