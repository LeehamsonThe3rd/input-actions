import { UserInputService } from "@rbxts/services";
import { EInputType } from "../../Models/EInputType";
import IInputMap from "../../Models/IInputMap";
import { InputKeyCode } from "../../Models/InputKeyCode";
import GetInputKeyCodeName from "../../Utils/GetInputKeyCodeName";
import { InputKeyCodeImages } from "../../Utils/InputKeyCodeImages";
import IsCustomKey from "../../Utils/IsCustomKey";
import { InputContextController } from "../InputContextController";
import { InputTypeController } from "../InputTypeController";
import { DefaultInputMaps } from "./DefaultInputActions";

/**
 * Utilities for working with input maps and their visual representation
 */
export namespace InputMapController {
	export interface IVisualInputKeyCodeData {
		readonly Name: string;
		readonly ImageId: string;
	}

	/**
	 * Get the input map for an action
	 */
	export function Get(actionName: string): IInputMap | undefined {
		return InputContextController.GetGlobalContext().GetMap(actionName);
	}

	/**
	 * Get the appropriate key code for the current input type
	 */
	function GetInputKeyCodeByCurrentInputType(actionName: string): InputKeyCode | undefined {
		const inputMap = Get(actionName);
		if (inputMap === undefined) return undefined;

		const currentInputType = InputTypeController.GetMainInputType();
		if (currentInputType === EInputType.Gamepad) return inputMap.Gamepad;
		if (currentInputType === EInputType.KeyboardAndMouse) return inputMap.KeyboardAndMouse;
	}

	/**
	 * Get visual data for displaying an input map
	 */
	export function GetVisualData(
		actionName: string,
		useCustomImages: boolean = true,
	): IVisualInputKeyCodeData {
		return GetVisualInputKeyCodeData(
			GetInputKeyCodeByCurrentInputType(actionName),
			useCustomImages,
		);
	}

	/**
	 * Get visual data for a specific input key code
	 */
	export function GetVisualInputKeyCodeData(
		inputKeyCode?: InputKeyCode,
		useCustomImages: boolean = true,
	): IVisualInputKeyCodeData {
		if (inputKeyCode === undefined)
			return identity<IVisualInputKeyCodeData>({
				Name: "",
				ImageId: "",
			});

		let image = "";
		const name = GetInputKeyCodeName(inputKeyCode);

		if (useCustomImages) {
			image = InputKeyCodeImages.GetImageForKey(inputKeyCode);
		} else if (!IsCustomKey(inputKeyCode) && inputKeyCode.EnumType !== Enum.UserInputType) {
			image = UserInputService.GetImageForKeyCode(inputKeyCode as Enum.KeyCode);
		}

		return identity<IVisualInputKeyCodeData>({
			Name: name,
			ImageId: image,
		});
	}

	/**
	 * Get access to default input maps
	 */
	export function GetDefaultInputMaps() {
		return DefaultInputMaps;
	}

	/**
	 * Apply the default input maps
	 */
	export function AddDefaultInputMaps() {
		DefaultInputMaps.ApplyDefaultMaps();
	}
}
