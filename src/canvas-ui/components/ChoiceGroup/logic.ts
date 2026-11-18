import type { ChoiceOption } from './choiceGroup';

export function radioSelection(current: unknown, option: ChoiceOption): string | undefined {
    return current === option.value ? undefined : option.value;
}

export function checkboxSelection(current: unknown, option: ChoiceOption): string[] {
    const selected = Array.isArray(current)
        ? current.filter((value): value is string => typeof value === 'string')
        : [];
    return selected.includes(option.value)
        ? selected.filter((value) => value !== option.value)
        : [...selected, option.value];
}
