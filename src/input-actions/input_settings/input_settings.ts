import { UserInputService } from "@rbxts/services";
import { FunctionTools } from "@rbxts/tool_pack";
import { KeysImages } from "../../tools/images/KeysImages";
import { InputTypeTracker } from "../../tools/input_type_tracker";
import { InputKeyCode } from "../input_key_code";
import { InputMap } from "../input_map";
import { default_input_maps } from "./default_input_actions";

export namespace InputSettings {
	export interface IInputMap {
		readonly gamepad?: InputKeyCode;
		readonly keyboard_and_mouse?: InputKeyCode;
	}

	export const empty_input_map = {};

	const saved_input_maps = new Map<string, IInputMap>();

	export function GetInputMap(name: string) {
		return saved_input_maps.get(name);
	}

	/**returns name and image of the main input keycode from the input map
	 * @returns [name, image]
	 */
	export function GetNameAndImageOfCurrentInputMapKey(
		input_map_name: string,
		use_custom_images: boolean = true,
	): LuaTuple<[name: string, image_id: string]> {
		const input_map = GetInputMap(input_map_name);
		//returns empty strings
		if (input_map === undefined) return $tuple("", "");

		//gets current input type
		const current_input_type = InputTypeTracker.GetMainInputType();
		//gets a key from the map
		const key = FunctionTools.SwitchValueIfEquals(
			current_input_type,
			[
				InputTypeTracker.EInputType.gamepad,
				InputTypeTracker.EInputType.keyboard_and_mouse,
			],
			[input_map.gamepad, input_map.keyboard_and_mouse],
			undefined,
		);
		//if didnt find, return empty strings
		if (key === undefined) return $tuple("", "");
		return GetNameAndImageOfKey(key, use_custom_images);
	}

	export function GetNameAndImageOfKey(
		key: InputKeyCode,
		use_custom_images: boolean = true,
	): LuaTuple<[name: string, image_id: string]> {
		let image = "";

		const is_custom = typeIs(key, "string");
		//save name
		const name = is_custom ? key : key.Name;
		if (use_custom_images) {
			image = KeysImages.GetImageForKey(key);
			return $tuple(name, image);
		}

		if (!is_custom && key.EnumType !== Enum.UserInputType) {
			//try to get image if is a keycode
			image = UserInputService.GetImageForKeyCode(key as Enum.KeyCode);
		}

		//return name and image
		return $tuple(name, image);
	}

	export function AddInputMap(action_name: string, input_map: IInputMap) {
		if (saved_input_maps.has(action_name)) {
			warn(`${action_name} already exist`);
			return;
		}
		saved_input_maps.set(action_name, input_map);
		InputMap.AddAction(action_name);

		//ads keyboard and mouse to the events
		if (input_map.gamepad !== undefined)
			InputMap.ActionAddKeyCode(action_name, input_map.gamepad);
		if (input_map.keyboard_and_mouse !== undefined)
			InputMap.ActionAddKeyCode(action_name, input_map.keyboard_and_mouse);
	}

	export function DeleteInputMap(action_name: string) {
		if (!saved_input_maps.has(action_name)) {
			warn(`${action_name} doesnt exist`);
			return;
		}
		const input_map = saved_input_maps.get(action_name)!;
		if (input_map.gamepad !== undefined)
			InputMap.ActionEraseKeyCode(action_name, input_map.gamepad);
		if (input_map.keyboard_and_mouse !== undefined)
			InputMap.ActionEraseKeyCode(action_name, input_map.keyboard_and_mouse);
		InputMap.EraseAction(action_name);
	}

	export function GetDefaultInputMaps() {
		return default_input_maps;
	}

	let initialized = false;
	export function Initialize() {
		if (initialized) return;
		initialized = true;
		const input_map_list = default_input_maps as unknown as Map<
			string,
			IInputMap
		>;

		input_map_list.forEach((map, action_name) => {
			AddInputMap(action_name, map);
		});
	}
}
