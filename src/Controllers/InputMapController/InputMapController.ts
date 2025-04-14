import { UserInputService } from "@rbxts/services";
import { EInputType } from "../../Models/EInputType";
import IInputMap from "../../Models/IInputMap";
import { InputKeyCode } from "../../Models/InputKeyCode";
import GetInputKeyCodeName from "../../Utils/GetInputKeyCodeName";
import { InputKeyCodeImages } from "../../Utils/InputKeyCodeImages";
import IsCustomKey from "../../Utils/IsCustomKey";
import { ActionsController } from "../ActionsController";
import { InputTypeController } from "../InputTypeController";
import { DefaultInputMaps } from "./DefaultInputActions";
import { InputContextController } from "../InputContextController";

export namespace InputMapController {
	export interface IVisualInputKeyCodeData {
		readonly Name: string;
		readonly ImageId: string;
	}

	const registeredInputMaps = new Map<string, IInputMap>();

	export function get(name: string) {
		return registeredInputMaps.get(name);
	}

	function getInputKeyCodeByCurrentInputType(inputMapName: string): InputKeyCode | undefined {
		const inputMap = registeredInputMaps.get(inputMapName);
		if (inputMap === undefined) return undefined;
		const currentInputType = InputTypeController.GetMainInputType();
		if (currentInputType === EInputType.Gamepad) return inputMap.Gamepad;
		if (currentInputType === EInputType.KeyboardAndMouse) return inputMap.KeyboardAndMouse;
	}

	export function getVisualData(
		inputMapName: string,
		useCustomImages: boolean = true,
	): IVisualInputKeyCodeData {
		return getVisualInputKeyCodeData(
			getInputKeyCodeByCurrentInputType(inputMapName),
			useCustomImages,
		);
	}

	export function getVisualInputKeyCodeData(
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

	export function add(actionName: string, inputMap: IInputMap) {
		if (registeredInputMaps.has(actionName)) {
			warn(`${actionName} already exists`);
			return;
		}

		if (!ActionsController.IsExisting(actionName)) ActionsController.Add(actionName);

		registeredInputMaps.set(actionName, inputMap);

		if (inputMap.Gamepad !== undefined) ActionsController.AddKeyCode(actionName, inputMap.Gamepad);

		if (inputMap.KeyboardAndMouse !== undefined)
			ActionsController.AddKeyCode(actionName, inputMap.KeyboardAndMouse);
	}

	export function remove(actionName: string, eraseAction: boolean = false) {
		const inputMap = registeredInputMaps.get(actionName);
		if (inputMap === undefined) {
			warn(`${actionName} doesn't exist`);
			return;
		}

		if (inputMap.Gamepad !== undefined)
			ActionsController.EraseKeyCode(actionName, inputMap.Gamepad);

		if (inputMap.KeyboardAndMouse !== undefined)
			ActionsController.EraseKeyCode(actionName, inputMap.KeyboardAndMouse);

		if (eraseAction) ActionsController.Erase(actionName);

		registeredInputMaps.delete(actionName);
	}

	export function getDefaultInputMaps() {
		return DefaultInputMaps;
	}

	export function addDefaultInputMaps() {
		DefaultInputMaps.applyDefaultMaps();
	}

	export function getContextSystem() {
		return InputContextController;
	}

	export function createContext(name: string) {
		return InputContextController.createContext(name);
	}

	export function getGlobalContext() {
		return InputContextController.getGlobalContext();
	}
}
