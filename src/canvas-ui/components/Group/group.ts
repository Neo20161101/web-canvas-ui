import type { TransformProps } from '../../types';
import { createComponent } from '../shared';

export interface GroupProps extends TransformProps {
    children?: unknown;
}

export const Group = createComponent<GroupProps>('group');
