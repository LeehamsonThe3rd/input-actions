import { InputKeyCode } from "../Models/InputKeyCode";

export default function GetInputKeyCodeName(input_key_code: InputKeyCode) {
	return typeIs(input_key_code, "string") ? input_key_code : input_key_code.Name;
}
