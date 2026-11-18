import type { ComponentKind } from '../types';

export const kindSymbol = Symbol.for('rnative55.web-canvas-ui.kind');

export type MarkedComponent<Props = Record<string, unknown>> = ((props: Props) => null) & {
    displayName?: string;
    [kindSymbol]?: ComponentKind;
};

export function createComponent<Props>(kind: ComponentKind): MarkedComponent<Props> {
    const component = (() => null) as MarkedComponent<Props>;
    component.displayName = kind[0].toUpperCase() + kind.slice(1);
    component[kindSymbol] = kind;
    return component;
}
