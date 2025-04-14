import { InputKeyCode } from "./InputKeyCode";

export type EInputDeviceType = "KeyboardAndMouse" | "Gamepad";

export default interface IInputMap {
	readonly Gamepad?: InputKeyCode;
	readonly KeyboardAndMouse?: InputKeyCode;
}
