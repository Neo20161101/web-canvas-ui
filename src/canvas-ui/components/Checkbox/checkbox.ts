import { createComponent } from '../shared';
import { drawChoiceGroup, type ChoiceGroupProps } from '../ChoiceGroup';

export interface CheckboxProps extends ChoiceGroupProps {
    value?: string[];
    defaultValue?: string[];
    onChange?: (value: string[]) => void;
}

export const Checkbox = createComponent<CheckboxProps>('checkbox');

export function drawCheckbox(context: CanvasRenderingContext2D, props: CheckboxProps): void {
    drawChoiceGroup(context, props, 'checkbox');
}
