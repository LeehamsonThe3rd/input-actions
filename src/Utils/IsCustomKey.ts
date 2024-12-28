//!native
import { ECustomKey } from "../Models/ECustomKey";
import { InputKeyCode } from "../Models/InputKeyCode";

export default function IsCustomKey(input_key_code: InputKeyCode): input_key_code is ECustomKey {
	return typeIs(input_key_code, "string");
}
