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

export namespace InputMapController {
	export interface IVisualInputKeyCodeData {
		readonly Name: string;
		readonly ImageId: string;
	}

	export const EmptyInputMap = {};
	const registered_input_maps = new Map<string, IInputMap>();
	export function Get(name: string) {
		return registered_input_maps.get(name);
	}

	function GetInputKeyCodeByCurrentInputType(input_map_name: string): InputKeyCode | undefined {
		const input_map = registered_input_maps.get(input_map_name);
		if (input_map === undefined) return undefined;
		const current_input_type = InputTypeController.GetMainInputType();
		if (current_input_type === EInputType.Gamepad) return input_map.Gamepad;
		if (current_input_type === EInputType.KeyboardAndMouse) return input_map.KeyboardAndMouse;
	}

	export function GetVisualData(
		input_map_name: string,
		use_custom_images: boolean = true,
	): IVisualInputKeyCodeData {
		return GetVisualInputKeyCodeData(
			GetInputKeyCodeByCurrentInputType(input_map_name),
			use_custom_images,
		);
	}

	export function GetVisualInputKeyCodeData(
		input_key_code?: InputKeyCode,
		use_custom_images: boolean = true,
	): IVisualInputKeyCodeData {
		if (input_key_code === undefined)
			return identity<IVisualInputKeyCodeData>({
				Name: "",
				ImageId: "",
			});

		let image = "";
		const name = GetInputKeyCodeName(input_key_code);

		if (use_custom_images) {
			image = InputKeyCodeImages.GetImageForKey(input_key_code);
		} else if (!IsCustomKey(input_key_code) && input_key_code.EnumType !== Enum.UserInputType) {
			image = UserInputService.GetImageForKeyCode(input_key_code as Enum.KeyCode);
		}

		return identity<IVisualInputKeyCodeData>({
			Name: name,
			ImageId: image,
		});
	}

	export function Add(action_name: string, input_map: IInputMap) {
		if (registered_input_maps.has(action_name)) {
			warn(`${action_name} already exists`);
			return;
		}
		if (!ActionsController.IsExisting(action_name)) ActionsController.Add(action_name);
		registered_input_maps.set(action_name, input_map);

		if (input_map.Gamepad !== undefined)
			ActionsController.AddKeyCode(action_name, input_map.Gamepad);
		if (input_map.KeyboardAndMouse !== undefined)
			ActionsController.AddKeyCode(action_name, input_map.KeyboardAndMouse);
	}

	export function Delete(action_name: string, erase_action: boolean = false) {
		const input_map = registered_input_maps.get(action_name)!;
		if (input_map === undefined) {
			warn(`${action_name} doesnt exist`);
			return;
		}

		if (input_map.Gamepad !== undefined)
			ActionsController.EraseKeyCode(action_name, input_map.Gamepad);
		if (input_map.KeyboardAndMouse !== undefined)
			ActionsController.EraseKeyCode(action_name, input_map.KeyboardAndMouse);
		ActionsController.Erase(action_name);
	}

	export function GetDefaultInputMaps() {
		return DefaultInputMaps;
	}

	let initialized = false;
	export function Initialize(initialize_default_input_maps: boolean = true) {
		if (initialized) return;
		initialized = true;
		if (!initialize_default_input_maps) return;

		const input_map_list = DefaultInputMaps as unknown as Map<string, IInputMap>;
		input_map_list.forEach((map, action_name) => {
			Add(action_name, map);
		});
	}
}
