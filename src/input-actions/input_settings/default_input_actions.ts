import { ECustomKey } from "../input_key_code";
import { InputSettings } from "./input_settings";

export const enum EDefaultInputAction {
	ui_next_page = "ui_next_page",
	ui_previous_page = "ui_previous_page",
	ui_go_up = "ui_go_up",
	ui_go_down = "ui_go_down",
	ui_go_right = "ui_go_right",
	ui_go_left = "ui_go_left",

	ui_accept = "ui_accept",
	ui_cancel = "ui_cancel",

	ui_scroll_up = "ui_scroll_up",
	ui_scroll_down = "ui_scroll_down",

	mouse_debug_mode = "mouse_debug_mode",
}

export const default_input_maps: { [name: string]: InputSettings.IInputMap } = {
	[EDefaultInputAction.mouse_debug_mode]: {
		gamepad: undefined,
		keyboard_and_mouse: Enum.KeyCode.P,
	},

	[EDefaultInputAction.ui_cancel]: {
		gamepad: Enum.KeyCode.ButtonB,
		keyboard_and_mouse: Enum.KeyCode.B,
	},

	[EDefaultInputAction.ui_next_page]: {
		gamepad: Enum.KeyCode.ButtonR1,
		keyboard_and_mouse: Enum.KeyCode.E,
	},

	[EDefaultInputAction.ui_previous_page]: {
		gamepad: Enum.KeyCode.ButtonL1,
		keyboard_and_mouse: Enum.KeyCode.Q,
	},

	[EDefaultInputAction.ui_go_up]: {
		gamepad: Enum.KeyCode.DPadUp,
		keyboard_and_mouse: Enum.KeyCode.Up,
	},

	[EDefaultInputAction.ui_go_down]: {
		gamepad: Enum.KeyCode.DPadDown,
		keyboard_and_mouse: Enum.KeyCode.Down,
	},

	[EDefaultInputAction.ui_go_right]: {
		gamepad: Enum.KeyCode.DPadRight,
		keyboard_and_mouse: Enum.KeyCode.Right,
	},

	[EDefaultInputAction.ui_go_left]: {
		gamepad: Enum.KeyCode.DPadLeft,
		keyboard_and_mouse: Enum.KeyCode.Left,
	},

	[EDefaultInputAction.ui_accept]: {
		gamepad: Enum.KeyCode.ButtonA,
		keyboard_and_mouse: Enum.KeyCode.Return,
	},

	[EDefaultInputAction.ui_scroll_down]: {
		gamepad: ECustomKey.thumbstick2_down,
		keyboard_and_mouse: Enum.KeyCode.S,
	},

	[EDefaultInputAction.ui_scroll_up]: {
		gamepad: ECustomKey.thumbstick2_up,
		keyboard_and_mouse: Enum.KeyCode.W,
	},
};
