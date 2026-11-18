import type { DropdownOption } from './dropdown';
import type { SceneNode } from '../../scene';

export function normalizeDropdownOptions(value: unknown): DropdownOption[] {
    if (!Array.isArray(value)) return [];
    return value.flatMap((option): DropdownOption[] => {
        if (typeof option === 'string') return [{ label: option, value: option }];
        if (!option || typeof option !== 'object') return [];
        const candidate = option as Partial<DropdownOption>;
        if (typeof candidate.label !== 'string' || typeof candidate.value !== 'string') return [];
        return [
            {
                label: candidate.label,
                value: candidate.value,
                disabled: candidate.disabled === true,
            },
        ];
    });
}

export function dropdownOptionAt(value: unknown, index: number): DropdownOption | undefined {
    return normalizeDropdownOptions(value)[index];
}

export function selectDropdownOption(node: SceneNode, option: DropdownOption): void {
    node.setProps({ value: option.value, open: false });
    const onChange = node.props.onChange;
    if (typeof onChange === 'function') onChange(option.value);
}
