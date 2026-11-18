import type { SceneNode } from '../../scene';

export function setButtonPressed(button: SceneNode, pressed: boolean): void {
    button.setProps({ pressed });
}

export function activateButton(button: SceneNode): void {
    if (button.props.disabled === true) return;
    const onClick = button.props.onClick;
    if (typeof onClick === 'function') onClick();
}
