import type { TransformProps } from '../../types';
import { number, string, themeColor } from '../draw-utils';
import { createComponent } from '../shared';
import type { ComponentSize } from '../size';

export interface TabsProps extends TransformProps {
    width: number;
    height: number;
    activeKey?: string;
    defaultActiveKey?: string;
    headerHeight?: number;
    backgroundColor?: string;
    textColor?: string;
    activeColor?: string;
    indicatorColor?: string;
    children?: unknown;
    onChange?: (key: string) => void;
}

export interface TabItemProps extends TransformProps {
    id: string;
    title: string;
    disabled?: boolean;
    size?: ComponentSize;
    children?: unknown;
}

export const Tabs = createComponent<TabsProps>('tabs');
export const TabItem = createComponent<TabItemProps>('tabItem');

/** A tab header entry injected by the engine for the draw layer. */
export interface TabItemView {
    title: string;
    disabled?: boolean;
    selected?: boolean;
}

/** Public props plus the engine-injected header model consumed by the draw layer. */
export type TabsDrawProps = TabsProps & { _tabItems?: TabItemView[] };

export function drawTabs(context: CanvasRenderingContext2D, props: TabsDrawProps): void {
    const width = number(props.width, 300);
    const headerHeight = number(props.headerHeight, 40);
    const items = props._tabItems ?? [];
    if (!items.length) return;
    const itemWidth = width / items.length;
    context.fillStyle = string(
        props.backgroundColor,
        themeColor(context, '--canvas-ui-tabs-background', '#fff'),
    );
    context.fillRect(0, 0, width, headerHeight);
    context.font = '14px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    items.forEach((item, index) => {
        context.fillStyle = item.disabled
            ? themeColor(context, '--canvas-ui-tabs-disabled-color', '#bfbfbf')
            : item.selected
              ? string(
                    props.activeColor,
                    themeColor(context, '--canvas-ui-tabs-active-color', '#1677ff'),
                )
              : string(props.textColor, themeColor(context, '--canvas-ui-tabs-color', '#595959'));
        context.fillText(item.title, itemWidth * (index + 0.5), headerHeight / 2);
        if (item.selected) {
            context.fillStyle = string(
                props.indicatorColor,
                themeColor(context, '--canvas-ui-tabs-indicator', '#1677ff'),
            );
            context.fillRect(itemWidth * index, headerHeight - 2, itemWidth, 2);
        }
    });
    context.textAlign = 'left';
}
