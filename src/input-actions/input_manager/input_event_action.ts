//!native

import { InputKeyCode } from "../input_key_code";

/**
 * its recommended to keep keycode to none if used separately from the context action service
 */
export default class InputEventAction {
	readonly keycode: InputKeyCode;

	private action_ = "";
	private pressed_ = false;
	private position_: Vector3 = Vector3.zero;
	private delta_: Vector3 = Vector3.zero;
	constructor(keycode: InputKeyCode = Enum.UserInputType.None) {
		this.keycode = keycode;
	}

	SetAction(action: string) {
		this.action_ = action;
	}

	GetAction() {
		return this.action_;
	}

	SetPressed(pressed: boolean) {
		this.pressed_ = pressed;
	}

	IsPressed() {
		return this.pressed_;
	}

	SetPosition(position: Vector3) {
		this.position_ = position;
	}

	GetPosition() {
		return this.position_;
	}

	SetDelta(delta: Vector3) {
		this.delta_ = delta;
	}

	GetDelta() {
		return this.delta_;
	}
}
