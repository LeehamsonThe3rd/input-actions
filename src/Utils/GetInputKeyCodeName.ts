import { InputKeyCode } from "../Models/InputKeyCode";

export default function GetInputKeyCodeName(inputKeyCode: InputKeyCode) {
	return typeIs(inputKeyCode, "string") ? inputKeyCode : inputKeyCode.Name;
}
