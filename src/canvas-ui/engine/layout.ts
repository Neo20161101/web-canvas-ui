import { descriptorKey } from '../scene';
import type { SceneNode } from '../scene';
import type { TextControlProps, Transform, VNode } from '../types';
import { number } from '../components/draw-utils';
import { multiplyTransform } from './transform';
import { setTreeVisibility } from './nodes';
import {
    carouselItemOffset,
    layoutGridChildren,
    setVNodeVisibility,
    translateChildren,
} from './vnodes';
import { transitionProgress } from './carousel';
import type { EngineCore, EngineState, TextControlDescription } from './state';

/**
 * The declarative-tree normalization pass. {@link prepare} walks the incoming VNode
 * tree once per update, resolving controlled/uncontrolled component state (tabs,
 * carousel, collapse, grid scroll, dialog centering, text-control overlays) into
 * engine-internal props before the scene graph is diffed.
 */

function keyForState(props: Record<string, unknown>, key: string): string {
    const value = props[key];
    if (Array.isArray(value)) return value.join(',');
    return typeof value === 'string' ? value : '';
}

function activeTabKey(
    state: EngineState,
    stateKey: string,
    props: Record<string, unknown>,
    items: VNode[],
): string {
    const controlled = props.activeKey;
    if (typeof controlled === 'string') return controlled;
    const current = state.tabSelections.get(stateKey);
    const fallback =
        typeof props.defaultActiveKey === 'string'
            ? props.defaultActiveKey
            : String(items[0]?.props.id ?? '');
    const selected = current ?? fallback;
    state.tabSelections.set(stateKey, selected);
    return selected;
}

export function activeCollapseKeys(
    state: EngineState,
    stateKey: string,
    props: Record<string, unknown>,
): Set<string> {
    if (Array.isArray(props.activeKeys)) {
        const keys = props.activeKeys.filter((key): key is string => typeof key === 'string');
        return new Set(props.accordion ? keys.slice(0, 1) : keys);
    }
    const current = state.collapseSelections.get(stateKey);
    const initialKeys = Array.isArray(props.defaultActiveKeys)
        ? props.defaultActiveKeys.filter((key): key is string => typeof key === 'string')
        : [];
    const initial = props.accordion ? initialKeys.slice(0, 1) : initialKeys;
    const active = current ?? new Set(initial);
    state.collapseSelections.set(stateKey, active);
    return active;
}

export function layoutCollapseNodes(parent: SceneNode, active: Set<string>): void {
    const headerHeight = number(parent.props.headerHeight, 40);
    const width = number(parent.props.width, 300);
    let top = 0;
    for (const item of parent.children) {
        if (item.type !== 'collapseItem') continue;
        const expanded = active.has(String(item.props.id ?? ''));
        item.setProps({
            y: top + number(item.props._userY, 0),
            _expanded: expanded,
            _collapseWidth: width,
            _collapseHeaderHeight: headerHeight,
        });
        item.children.forEach((child) => setTreeVisibility(child, expanded));
        top += headerHeight + (expanded ? number(item.props.height, 100) : 0);
    }
}

export function prepare(
    core: EngineCore,
    state: EngineState,
    vnodes: VNode[],
    parentTransform: Transform,
    parentVisible: boolean,
    parentPath: string,
    descriptions: TextControlDescription[],
): VNode[] {
    return vnodes.map((vnode, index) => {
        const path = descriptorKey(vnode, index, parentPath);
        const props = vnode.props;
        const transform = multiplyTransform(parentTransform, props);
        const visible =
            parentVisible &&
            props.visible !== false &&
            (vnode.type !== 'dialog' || props.open === true);
        const nextProps = { ...props };
        nextProps._userVisible =
            typeof props._userVisible === 'boolean' ? props._userVisible : props.visible !== false;

        if (vnode.type === 'input' || vnode.type === 'datePicker' || vnode.type === 'textarea') {
            const id = `${vnode.type}:${path}`;
            nextProps._canvasInputId = id;
            nextProps._controlledValue = props.value !== undefined;
            descriptions.push({
                id,
                props: props as unknown as TextControlProps,
                layout: {
                    width: number(props.width, 200),
                    height: number(props.height, 36),
                    transform,
                    visible,
                },
            });
        }

        let children = vnode.children;
        if (vnode.type === 'grid') {
            const stateKey = path;
            const layout = layoutGridChildren(vnode);
            const maxScroll =
                typeof props.height === 'number'
                    ? Math.max(0, layout.contentHeight - props.height)
                    : 0;
            const scrollTop = Math.max(
                0,
                Math.min(maxScroll, state.gridScrollPositions.get(stateKey) ?? 0),
            );
            state.gridScrollPositions.set(stateKey, scrollTop);
            nextProps._gridStateKey = stateKey;
            nextProps._gridWidth = layout.width;
            nextProps._gridContentHeight = layout.contentHeight;
            nextProps._scrollTop = scrollTop;
            children = layout.children.map((child) => ({
                ...child,
                props: {
                    ...child.props,
                    _gridBaseY: child.props.y,
                    y: number(child.props.y, 0) - scrollTop,
                },
            }));
        }
        if (vnode.type === 'dialog') {
            nextProps._viewportWidth = core.context.canvas.width / core.pixelRatio;
            nextProps._viewportHeight = core.context.canvas.height / core.pixelRatio;
            const dialogWidth = number(props.width, 420);
            const dialogHeight = number(props.height, 240);
            const panelX = (number(nextProps._viewportWidth, 0) - dialogWidth) / 2;
            const panelY = (number(nextProps._viewportHeight, 0) - dialogHeight) / 2;
            nextProps._dialogPanelX = panelX;
            nextProps._dialogPanelY = panelY;
            children = translateChildren(children, panelX + 24, panelY + 64);
        } else if (vnode.type === 'tabs') {
            const items = children.filter((child) => child.type === 'tabItem');
            const stateKey = `${path}:${keyForState(props, 'defaultActiveKey')}`;
            const activeKey = activeTabKey(state, stateKey, props, items);
            nextProps._activeKey = activeKey;
            nextProps._tabItems = items.map((item) => ({
                title: item.props.title,
                disabled: item.props.disabled,
                selected: item.props.id === activeKey,
            }));
            const headerHeight = number(props.headerHeight, 40);
            children = children.map((item) => ({
                ...item,
                props: {
                    ...item.props,
                    visible:
                        item.type !== 'tabItem' ||
                        (item.props.visible !== false && item.props.id === activeKey),
                    _userVisible: item.props._userVisible ?? item.props.visible !== false,
                },
                children:
                    item.type === 'tabItem'
                        ? setVNodeVisibility(
                              translateChildren(item.children, 0, headerHeight),
                              item.props.visible !== false && item.props.id === activeKey,
                          )
                        : item.children,
            }));
            nextProps._stateKey = stateKey;
        } else if (vnode.type === 'carousel') {
            const items = children.filter((child) => child.type === 'carouselItem');
            const stateKey = path;
            const controlled = props.activeIndex;
            const requested =
                typeof controlled === 'number' && Number.isInteger(controlled)
                    ? controlled
                    : (state.carouselSelections.get(stateKey) ??
                      (typeof props.defaultActiveIndex === 'number'
                          ? props.defaultActiveIndex
                          : 0));
            let selected = requested;
            let transition = state.carouselTransitions.get(stateKey);
            if (transition && controlled !== undefined && requested !== transition.to) {
                state.carouselTransitions.delete(stateKey);
                transition = undefined;
            }
            const activeIndex = items.length
                ? Math.max(0, Math.min(items.length - 1, selected))
                : 0;
            if (transition && (transition.from >= items.length || transition.to >= items.length)) {
                state.carouselTransitions.delete(stateKey);
                transition = undefined;
            }
            if (transition) selected = transition.to;
            if (props.activeIndex === undefined)
                state.carouselSelections.set(stateKey, activeIndex);
            nextProps._stateKey = stateKey;
            nextProps._activeIndex = transition ? transition.to : activeIndex;
            nextProps._itemCount = items.length;
            nextProps._transitionProgress = transition
                ? transitionProgress(transition, state.currentFrameTime)
                : 1;
            const progress = number(nextProps._transitionProgress, 1);
            const eased = progress * progress * (3 - 2 * progress);
            children = children.map((item) => ({
                ...item,
                props: {
                    ...item.props,
                    _carouselBaseX: item.props._carouselBaseX ?? number(item.props.x, 0),
                    x:
                        item.type === 'carouselItem'
                            ? number(item.props.x, 0) +
                              carouselItemOffset(
                                  items.indexOf(item),
                                  transition,
                                  eased,
                                  number(props.width, 300),
                              )
                            : item.props.x,
                    visible:
                        item.type !== 'carouselItem' ||
                        (item.props.visible !== false &&
                            (transition
                                ? items.indexOf(item) === transition.from ||
                                  items.indexOf(item) === transition.to
                                : items[activeIndex] === item)),
                    _userVisible: item.props._userVisible ?? item.props.visible !== false,
                },
                children:
                    item.type === 'carouselItem'
                        ? setVNodeVisibility(
                              item.children,
                              item.props.visible !== false &&
                                  (transition
                                      ? items.indexOf(item) === transition.from ||
                                        items.indexOf(item) === transition.to
                                      : items[activeIndex] === item),
                          )
                        : item.children,
            }));
        } else if (vnode.type === 'collapse') {
            const stateKey = `${path}:${keyForState(props, 'defaultActiveKeys')}`;
            const activeKeys = activeCollapseKeys(state, stateKey, props);
            const headerHeight = number(props.headerHeight, 40);
            const width = number(props.width, 300);
            let top = 0;
            children = children.map((item) => {
                if (item.type !== 'collapseItem') return item;
                const expanded = activeKeys.has(String(item.props.id ?? ''));
                const contentHeight = expanded ? number(item.props.height, 100) : 0;
                const result: VNode = {
                    ...item,
                    props: {
                        ...item.props,
                        x: number(item.props.x, 0),
                        y: top + number(item.props.y, 0),
                        _userY: number(item.props.y, 0),
                        visible: item.props.visible !== false,
                        _userVisible: item.props._userVisible ?? item.props.visible !== false,
                        _expanded: expanded,
                        _collapseWidth: width,
                        _collapseHeaderHeight: headerHeight,
                        backgroundColor: item.props.backgroundColor ?? props.backgroundColor,
                        textColor: item.props.textColor ?? props.textColor,
                        borderColor: item.props.borderColor ?? props.borderColor,
                    },
                    children: setVNodeVisibility(
                        translateChildren(item.children, 0, headerHeight),
                        expanded && item.props.visible !== false,
                    ),
                };
                top += headerHeight + contentHeight;
                return result;
            });
            nextProps._stateKey = stateKey;
            nextProps._activeKeys = [...activeKeys];
        }
        return {
            ...vnode,
            props: nextProps,
            children: prepare(core, state, children, transform, visible, path, descriptions),
        };
    });
}
