import type { TransformProps } from '../../types';
import { createComponent } from '../shared';

export interface GridProps extends TransformProps {
    columns: number;
    width?: number;
    height?: number;
    cellWidth?: number;
    cellHeight: number;
    gap?: number;
    children?: unknown;
    onScroll?: (scrollTop: number) => void;
}

export const Grid = createComponent<GridProps>('grid');
