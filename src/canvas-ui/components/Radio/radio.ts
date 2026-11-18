import { createComponent } from '../shared';
import { drawChoiceGroup, type ChoiceGroupProps } from '../ChoiceGroup';

export interface RadioProps extends ChoiceGroupProps {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
}

export const Radio = createComponent<RadioProps>('radio');

export function drawRadio(context: CanvasRenderingContext2D, props: RadioProps): void {
    drawChoiceGroup(context, props, 'radio');
}
