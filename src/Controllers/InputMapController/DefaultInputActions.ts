import { ECustomKey } from "../../Models/ECustomKey";
import { EDefaultInputAction } from "../../Models/EDefaultInputAction";
import IInputMap from "../../Models/IInputMap";

export const DefaultInputMaps: { [name: string]: IInputMap } = {
	[EDefaultInputAction.MouseDebugMode]: {
		Gamepad: undefined,
		KeyboardAndMouse: Enum.KeyCode.LeftAlt,
	},

	[EDefaultInputAction.UiCancel]: {
		Gamepad: Enum.KeyCode.ButtonB,
		KeyboardAndMouse: Enum.KeyCode.B,
	},

	[EDefaultInputAction.UiNextPage]: {
		Gamepad: Enum.KeyCode.ButtonR1,
		KeyboardAndMouse: Enum.KeyCode.E,
	},

	[EDefaultInputAction.UiPreviousPage]: {
		Gamepad: Enum.KeyCode.ButtonL1,
		KeyboardAndMouse: Enum.KeyCode.Q,
	},

	[EDefaultInputAction.UiGoUp]: {
		Gamepad: Enum.KeyCode.DPadUp,
		KeyboardAndMouse: Enum.KeyCode.Up,
	},

	[EDefaultInputAction.UiGoDown]: {
		Gamepad: Enum.KeyCode.DPadDown,
		KeyboardAndMouse: Enum.KeyCode.Down,
	},

	[EDefaultInputAction.UiGoRight]: {
		Gamepad: Enum.KeyCode.DPadRight,
		KeyboardAndMouse: Enum.KeyCode.Right,
	},

	[EDefaultInputAction.UiGoLeft]: {
		Gamepad: Enum.KeyCode.DPadLeft,
		KeyboardAndMouse: Enum.KeyCode.Left,
	},

	[EDefaultInputAction.UiAccept]: {
		Gamepad: Enum.KeyCode.ButtonA,
		KeyboardAndMouse: Enum.KeyCode.Return,
	},

	[EDefaultInputAction.UiScrollDown]: {
		Gamepad: ECustomKey.Thumbstick2Down,
		KeyboardAndMouse: Enum.KeyCode.S,
	},

	[EDefaultInputAction.UiScrollUp]: {
		Gamepad: ECustomKey.Thumbstick2Up,
		KeyboardAndMouse: Enum.KeyCode.W,
	},
};
