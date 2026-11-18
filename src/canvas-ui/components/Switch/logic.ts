import type { SceneNode } from '../../scene';

export function toggleSwitch(node: SceneNode): void {
    const checked = !node.props.checked;
    node.setProps({ checked });
    const onChange = node.props.onChange;
    if (typeof onChange === 'function') onChange(checked);
}
