//!native
//!optimize 2
import { RunService } from "@rbxts/services";
import { ArrayTools, TableTools } from "@rbxts/tool_pack";
import { IActionData } from "../Models/IActionData";
import { InputKeyCode } from "../Models/InputKeyCode";
import { ActionResources } from "../Resources/ActionResources";

/**
 * Controller for managing input actions
 *
 * The ActionsController handles the registration, triggering, and state tracking
 * of named actions that can be bound to input keys.
 */
export namespace ActionsController {
	// Maps action names to their data
	const actions_map = new Map<string, IActionData>();
	// Maps input key codes to the actions they trigger
	const key_code_to_actions_refferences = new Map<InputKeyCode, string[]>();

	let initialized = false;
	/**
	 * Initialize the actions controller
	 * Must be called before using any other functionality
	 */
	export function Initialize() {
		if (initialized) return;
		initialized = true;
		RunService.BindToRenderStep(
			"_ActionsUpdate_",
			ActionResources.DEFAULT_ACTION_UPDATE_PRIORITY,
			Update,
		);
	}

	/**
	 * Executes a callback with the action data for a given action name
	 * Warns if the action doesn't exist
	 */
	function ExecuteWithActionData(
		action_name: string,
		callback: (action_data: IActionData) => void,
	) {
		const action_data = GetActionData(action_name);
		if (action_data !== undefined) {
			callback(action_data);
			return;
		}
		warn(`Tries to execute with non-existent action: ${action_name}`);
	}

	/**
	 * Gets the action data for a given action name
	 * Warns if the action doesn't exist
	 */
	function GetActionData(action_name: string): IActionData | undefined {
		const action_data = actions_map.get(action_name);
		if (action_data === undefined) {
			warn(`Action: ${action_name} doesn't exist`);
		}

		return action_data;
	}

	/**
	 * Sets an action as pressed with the given strength
	 */
	export function Press(action_name: string, strength: number = 1) {
		ExecuteWithActionData(action_name, (action_table) => {
			action_table.KeyBuffer[0] = strength;
		});
	}

	/**
	 * Gets the current press strength of an action
	 * @returns Press strength between 0 and 1, or 0 if action doesn't exist
	 */
	export function GetPressStrength(action_name: string): number {
		const action_data = GetActionData(action_name);
		if (action_data === undefined) return 0;
		return action_data.KeyBuffer[1];
	}

	export function Release(action_name: string) {
		ExecuteWithActionData(action_name, (action_table) => {
			//sets the current status to release
			action_table.KeyBuffer[0] = 0;
		});
	}

	export function IsPressed(action_name: string) {
		const action_data = GetActionData(action_name);
		if (action_data === undefined) return false;
		return action_data.KeyBuffer[1] >= action_data.ActivationStrength;
	}

	/**NOT RECOMMENDED TO USE (InternalOnly) Low level of checking if the action is pressed in this frame */
	export function IsPressedThisFrame(action_name: string) {
		const action_data = GetActionData(action_name);
		if (action_data === undefined) return false;
		return action_data.KeyBuffer[0] >= action_data.ActivationStrength;
	}

	/**NOT RECOMMENDED TO USE (InternalOnly) Low level of checking if the action is just pressed in this frame */
	export function IsJustPressedThisFrame(action_name: string) {
		const action_data = GetActionData(action_name);
		if (action_data === undefined) return false;
		return (
			action_data.KeyBuffer[0] >= action_data.ActivationStrength &&
			action_data.KeyBuffer[1] < action_data.ActivationStrength
		);
	}

	export function IsReleased(action_name: string) {
		return !IsPressed(action_name);
	}

	/**Low level of checking if the action is released in this frame */
	export function IsReleasedThisFrame(action_name: string) {
		const action_data = GetActionData(action_name);
		if (action_data === undefined) return false;
		return action_data.KeyBuffer[0] < action_data.ActivationStrength;
	}

	/**Low level of checking if the action is just released in this frame */
	export function IsJustReleasedThisFrame(action_name: string) {
		const action_data = GetActionData(action_name);
		if (action_data === undefined) return false;
		return (
			action_data.KeyBuffer[0] < action_data.ActivationStrength &&
			action_data.KeyBuffer[1] >= action_data.ActivationStrength
		);
	}

	export function IsJustPressed(action_name: string) {
		const action_data = GetActionData(action_name);
		if (action_data === undefined) return false;

		//was pressed in the previous frame, but was released in the pre-previos
		return (
			action_data.KeyBuffer[1] >= action_data.ActivationStrength &&
			action_data.KeyBuffer[2] < action_data.ActivationStrength
		);
	}

	export function IsJustReleased(action_name: string) {
		const action_data = GetActionData(action_name);
		if (action_data === undefined) return false;
		//was released in the previous frame, but was pressed in the pre-previos
		return (
			action_data.KeyBuffer[1] < action_data.ActivationStrength &&
			action_data.KeyBuffer[2] >= action_data.ActivationStrength
		);
	}

	/**
	 * Updates the input buffer for all actions
	 * Called once per frame
	 */
	function Update() {
		for (const [_, action_table] of actions_map) {
			// Shift values in the key buffer:
			// 0 - current input
			// 1 - previous input
			// 2 - pre-previous input
			[action_table.KeyBuffer[2], action_table.KeyBuffer[1]] = [
				action_table.KeyBuffer[1],
				action_table.KeyBuffer[0],
			];
		}
	}

	export function Add(
		action_name: string,
		activation_strength: number = ActionResources.DEFAULT_MIN_PRESS_STRENGTH,
		key_codes: readonly InputKeyCode[] = [],
	) {
		if (actions_map.has(action_name)) {
			warn(`Action ${action_name} already exist`);
			return;
		}

		const action_data = identity<IActionData>({
			Keycodes: [],
			KeyBuffer: [0, 0, 0],
			ActivationStrength: activation_strength,
		});

		actions_map.set(action_name, action_data);
		for (const key_code of key_codes) {
			AddKeyCode(action_name, key_code);
		}
	}

	function AddKeyCodeToActionRefference(key_code: InputKeyCode, action_name: string) {
		TableTools.GetOrCreate(key_code_to_actions_refferences, key_code, () => []).push(action_name);
	}

	function EraseKeyCodeToActionRefference(key_code: InputKeyCode, action_name: string) {
		const key_code_to_actions_refference = key_code_to_actions_refferences.get(key_code);
		if (key_code_to_actions_refference === undefined) return;
		ArrayTools.RemoveElementFromArray(key_code_to_actions_refference, action_name);
		if (!key_code_to_actions_refference.isEmpty()) return;
		key_code_to_actions_refferences.delete(key_code);
	}

	export function AddKeyCode(action_name: string, key_code: InputKeyCode) {
		ExecuteWithActionData(action_name, (action_data) => {
			if (action_data.Keycodes.includes(key_code)) {
				warn(`Action ${action_name} already includes keycode ${key_code}`);
				return;
			}

			action_data.Keycodes.push(key_code);
			AddKeyCodeToActionRefference(key_code, action_name);
		});
	}

	export function EraseKeyCode(action_name: string, key_code: InputKeyCode) {
		ExecuteWithActionData(action_name, (action_data) => {
			if (!action_data.Keycodes.includes(key_code)) return;
			ArrayTools.RemoveElementFromArray(action_data.Keycodes, key_code);
			EraseKeyCodeToActionRefference(key_code, action_name);
		});
	}

	export function EraseAllKeyCodes(action_name: string) {
		ExecuteWithActionData(action_name, (action_data) => {
			for (const key_code of action_data.Keycodes) {
				EraseKeyCodeToActionRefference(key_code, action_name);
			}

			action_data.Keycodes = [];
		});
	}

	export function GetKeyCodes(action_name: string): readonly InputKeyCode[] {
		return GetActionData(action_name)?.Keycodes ?? [];
	}

	export function HasKeyCode(action_name: string, key_code: InputKeyCode) {
		return actions_map.get(action_name)?.Keycodes.includes(key_code);
	}

	export function IsExisting(action_name: string) {
		return actions_map.has(action_name);
	}

	export function GetActionsFromKeyCode(key_code: InputKeyCode): readonly string[] {
		return key_code_to_actions_refferences.get(key_code) ?? [];
	}

	export function SetActivationStrength(action_name: string, activation_strength: number) {
		const action_data = GetActionData(action_name);
		if (action_data === undefined) return;
		action_data.ActivationStrength = activation_strength;
	}

	export function Erase(action_name: string) {
		EraseAllKeyCodes(action_name);
		actions_map.delete(action_name);
	}

	export function GetActions(): string[] {
		return TableTools.GetKeys(actions_map);
	}
}
