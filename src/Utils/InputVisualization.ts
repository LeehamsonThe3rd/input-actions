import { UserInputService } from "@rbxts/services";
import { InputKeyCode } from "../Models/InputKeyCode";
import GetInputKeyCodeName from "./GetInputKeyCodeName";
import { InputKeyCodeImages } from "./InputKeyCodeImages";
import IsCustomKey from "./IsCustomKey";

/**
 * Data for visually representing an input key
 */
export interface IVisualInputKeyCodeData {
	readonly Name: string;
	readonly ImageId: string;
}

/**
 * Get visual representation data for a specific input key code
 */
export function GetVisualInputKeyCodeData(
	inputKeyCode?: InputKeyCode,
	useCustomImages: boolean = true,
): IVisualInputKeyCodeData {
	if (inputKeyCode === undefined)
		return {
			Name: "",
			ImageId: "",
		};

	let image = "";
	const name = GetInputKeyCodeName(inputKeyCode);

	if (useCustomImages) {
		image = InputKeyCodeImages.GetImageForKey(inputKeyCode);
	} else if (!IsCustomKey(inputKeyCode) && inputKeyCode.EnumType !== Enum.UserInputType) {
		image = UserInputService.GetImageForKeyCode(inputKeyCode as Enum.KeyCode);
	}

	return {
		Name: name,
		ImageId: image,
	};
}
