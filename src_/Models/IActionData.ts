import { InputKeyCode } from "./InputKeyCode";

export interface IActionData {
	Keycodes: InputKeyCode[];
	KeyBuffer: [number, number, number];
	ActivationStrength: number;
}
