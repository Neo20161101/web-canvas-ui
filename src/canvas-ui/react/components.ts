import React from 'react';
import { kindSymbol, type MarkedComponent } from '../components/shared.ts';
import type { VNode } from '../types.ts';

export type * from '../components/types.ts';

export { Group } from '../components/Group';
export { Grid } from '../components/Grid';
export { GridItem } from '../components/GridItem';
export { Rect } from '../components/Rect';
export { Circle } from '../components/Circle';
export { Text } from '../components/Text';
export { Input } from '../components/Input';
export { Textarea } from '../components/Textarea';
export { Dropdown } from '../components/Dropdown';
export { Slider } from '../components/Slider';
export { Switch } from '../components/Switch';
export { DatePicker } from '../components/DatePicker';
export { Radio } from '../components/Radio';
export { Checkbox } from '../components/Checkbox';
export { Upload } from '../components/Upload';
export { Carousel, CarouselItem } from '../components/Carousel';
export type { ChoiceOption } from '../components/ChoiceGroup';
export { Button } from '../components/Button';
export { Image } from '../components/Image';
export { Icon } from '../components/Icon';
export { Dialog } from '../components/Dialog';
export { Progress } from '../components/Progress';
export { Tabs, TabItem } from '../components/Tabs';
export { Collapse, CollapseItem } from '../components/Collapse';
export { CustomDraw } from '../components/CustomDraw';
export { CanvasView } from '../components/CanvasView';

function compileChild(child: unknown, path: string): VNode[] {
    if (child === null || child === undefined || typeof child === 'boolean') return [];
    if (Array.isArray(child)) {
        return child.flatMap((item, index) => compileChild(item, `${path}.${index}`));
    }
    if (typeof child === 'string' || typeof child === 'number') return [];
    if (!React.isValidElement(child)) {
        throw new Error(`Unsupported child inside <Canvas> at ${path}. Use Canvas UI components.`);
    }
    if (child.type === React.Fragment) {
        return compileChild((child.props as { children?: React.ReactNode }).children, path);
    }

    const kind = (child.type as MarkedComponent)[kindSymbol];
    if (!kind) {
        throw new Error(
            `Unsupported component inside <Canvas> at ${path}. Use Canvas UI components.`,
        );
    }

    const props = { ...(child.props as Record<string, unknown>) };
    const children = props.children as React.ReactNode;
    delete props.children;
    const key = child.key ?? (typeof props.key === 'string' ? props.key : null);
    delete props.key;

    if (kind === 'text') {
        if (props.text === undefined) {
            props.text =
                typeof children === 'string' || typeof children === 'number'
                    ? String(children)
                    : '';
        }
        return [{ type: kind, key, props, children: [] }];
    }
    if (kind === 'button' && props.text === undefined) {
        props.text =
            typeof children === 'string' || typeof children === 'number' ? String(children) : '';
    }

    return [
        {
            type: kind,
            key,
            props,
            children:
                kind === 'group' ||
                kind === 'grid' ||
                kind === 'gridItem' ||
                kind === 'dialog' ||
                kind === 'tabs' ||
                kind === 'tabItem' ||
                kind === 'collapse' ||
                kind === 'collapseItem' ||
                kind === 'carousel' ||
                kind === 'carouselItem'
                    ? compileChild(children, path)
                    : [],
        },
    ];
}

export function compileChildren(children: unknown): VNode[] {
    return compileChild(children, 'canvas');
}
