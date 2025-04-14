import { InputKeyCode } from "./InputKeyCode";

export type InputDeviceType = "KeyboardAndMouse" | "Gamepad";

export default interface IInputMap {
	readonly Gamepad?: InputKeyCode;
	readonly KeyboardAndMouse?: InputKeyCode;
}
