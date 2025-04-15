//!native
//!optimize 2
import { RunService } from "@rbxts/services";
import { ArrayTools, TableTools } from "@rbxts/tool_pack";
import { EInputBufferIndex } from "../Models/EInputBufferIndex";
import { IActionData } from "../Models/IActionData";
import { InputKeyCode } from "../Models/InputKeyCode";
import { ActionResources } from "../Resources/ActionResources";
import { InputConfigController } from "./InputConfigController";
import { InputEchoController } from "./InputEchoController";

/**
 * Controller for managing input actions
 *
 * The ActionsController handles the registration, triggering, and state tracking
 * of named actions that can be bound to input keys.
 */
export namespace ActionsController {
	// Maps action names to their data
	const actionsMap = new Map<string, IActionData>();
	// Maps input key codes to the actions they trigger
	const keyCodeToActionsReferences = new Map<InputKeyCode, string[]>();

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
		InputEchoController.SetActionsController(ActionsController);
	}

	/**
	 * Executes a callback with the action data for a given action name
	 * Warns if the action doesn't exist
	 */
	function ExecuteWithActionData(actionName: string, callback: (actionData: IActionData) => void) {
		const actionData = GetActionData(actionName);
		if (actionData !== undefined) {
			callback(actionData);
			return;
		}
		warn(`Tries to execute with non-existent action: ${actionName}`);
	}

	/**
	 * Gets the action data for a given action name
	 * Warns if the action doesn't exist
	 */
	function GetActionData(actionName: string): IActionData | undefined {
		const actionData = actionsMap.get(actionName);
		if (actionData === undefined) {
			warn(`Action: ${actionName} doesn't exist`);
		}

		return actionData;
	}

	/**
	 * Sets an action as pressed with the given strength
	 */
	export function Press(actionName: string, strength: number = 1) {
		ExecuteWithActionData(actionName, (actionTable) => {
			actionTable.KeyBuffer[EInputBufferIndex.Current] = strength;
		});
	}

	/**
	 * Gets the current press strength of an action
	 * @returns Press strength between 0 and 1, or 0 if action doesn't exist
	 */
	export function GetPressStrength(actionName: string): number {
		const actionData = GetActionData(actionName);
		if (actionData === undefined) return 0;
		return actionData.KeyBuffer[EInputBufferIndex.Previous];
	}

	export function Release(actionName: string) {
		ExecuteWithActionData(actionName, (action_table) => {
			// Sets the current status to release
			action_table.KeyBuffer[EInputBufferIndex.Current] = 0;
		});
	}

	export function IsPressed(actionName: string) {
		const actionData = GetActionData(actionName);
		if (actionData === undefined) return false;
		// Use InputConfigController for activation threshold if available
		const threshold = InputConfigController.GetActionActivationThreshold(actionName);
		return actionData.KeyBuffer[EInputBufferIndex.Previous] >= threshold;
	}

	/**NOT RECOMMENDED TO USE (InternalOnly) Low level of checking if the action is pressed in this frame */
	export function IsPressedThisFrame(actionName: string) {
		const actionData = GetActionData(actionName);
		if (actionData === undefined) return false;
		return actionData.KeyBuffer[EInputBufferIndex.Current] >= actionData.ActivationStrength;
	}

	/**NOT RECOMMENDED TO USE (InternalOnly) Low level of checking if the action is just pressed in this frame */
	export function IsJustPressedThisFrame(actionName: string) {
		const actionData = GetActionData(actionName);
		if (actionData === undefined) return false;
		return (
			actionData.KeyBuffer[EInputBufferIndex.Current] >= actionData.ActivationStrength &&
			actionData.KeyBuffer[EInputBufferIndex.Previous] < actionData.ActivationStrength
		);
	}

	export function IsReleased(actionName: string) {
		return !IsPressed(actionName);
	}

	/**Low level of checking if the action is released in this frame */
	export function IsReleasedThisFrame(actionName: string) {
		const actionData = GetActionData(actionName);
		if (actionData === undefined) return false;
		return actionData.KeyBuffer[EInputBufferIndex.Current] < actionData.ActivationStrength;
	}

	/**Low level of checking if the action is just released in this frame */
	export function IsJustReleasedThisFrame(actionName: string) {
		const actionData = GetActionData(actionName);
		if (actionData === undefined) return false;
		return (
			actionData.KeyBuffer[EInputBufferIndex.Current] < actionData.ActivationStrength &&
			actionData.KeyBuffer[EInputBufferIndex.Previous] >= actionData.ActivationStrength
		);
	}

	export function IsJustPressed(actionName: string): boolean {
		const actionData = GetActionData(actionName);
		if (actionData === undefined) return false;

		// Check for regular just-pressed status
		const justPressed =
			actionData.KeyBuffer[EInputBufferIndex.Previous] >= actionData.ActivationStrength &&
			actionData.KeyBuffer[EInputBufferIndex.PrePrevious] < actionData.ActivationStrength;

		// Also return true if an echo was triggered for this action
		return justPressed || InputEchoController.WasEchoTriggered(actionName);
	}

	export function IsJustReleased(actionName: string) {
		const actionData = GetActionData(actionName);
		if (actionData === undefined) return false;
		//was released in the previous frame, but was pressed in the pre-previos
		return (
			actionData.KeyBuffer[EInputBufferIndex.Previous] < actionData.ActivationStrength &&
			actionData.KeyBuffer[EInputBufferIndex.PrePrevious] >= actionData.ActivationStrength
		);
	}

	/**
	 * Updates the input buffer for all actions
	 * Called once per frame
	 */
	function Update() {
		for (const [_, action_table] of actionsMap) {
			// Shift values in the key buffer:
			// 0 - current input
			// 1 - previous input
			// 2 - pre-previous input
			[
				action_table.KeyBuffer[EInputBufferIndex.PrePrevious],
				action_table.KeyBuffer[EInputBufferIndex.Previous],
			] = [
				action_table.KeyBuffer[EInputBufferIndex.Previous],
				action_table.KeyBuffer[EInputBufferIndex.Current],
			];
		}
	}

	export function Add(
		actionName: string,
		activationStrength: number = ActionResources.DEFAULT_MIN_PRESS_STRENGTH,
		keyCodes: readonly InputKeyCode[] = [],
	) {
		if (actionsMap.has(actionName)) {
			warn(`Action ${actionName} already exists`);
			return;
		}

		const actionData = identity<IActionData>({
			Keycodes: [],
			KeyBuffer: [0, 0, 0],
			ActivationStrength: activationStrength,
		});

		actionsMap.set(actionName, actionData);

		// Register with InputConfigController
		InputConfigController.SetActionActivationThreshold(actionName, activationStrength);

		for (const keyCode of keyCodes) {
			AddKeyCode(actionName, keyCode);
		}
	}

	function AddKeyCodeToActionReference(keyCode: InputKeyCode, actionName: string) {
		TableTools.GetOrCreate(keyCodeToActionsReferences, keyCode, () => []).push(actionName);
	}

	function EraseKeyCodeToActionReference(keyCode: InputKeyCode, actionName: string) {
		const keyCode_to_actions_reference = keyCodeToActionsReferences.get(keyCode);
		if (keyCode_to_actions_reference === undefined) return;
		ArrayTools.RemoveElementFromArray(keyCode_to_actions_reference, actionName);
		if (!keyCode_to_actions_reference.isEmpty()) return;
		keyCodeToActionsReferences.delete(keyCode);
	}

	export function AddKeyCode(actionName: string, keyCode: InputKeyCode) {
		ExecuteWithActionData(actionName, (actionData) => {
			if (actionData.Keycodes.includes(keyCode)) {
				warn(`Action ${actionName} already includes keycode ${keyCode}`);
				return;
			}

			actionData.Keycodes.push(keyCode);
			AddKeyCodeToActionReference(keyCode, actionName);
		});
	}

	export function EraseKeyCode(actionName: string, keyCode: InputKeyCode) {
		ExecuteWithActionData(actionName, (actionData) => {
			if (!actionData.Keycodes.includes(keyCode)) return;
			ArrayTools.RemoveElementFromArray(actionData.Keycodes, keyCode);
			EraseKeyCodeToActionReference(keyCode, actionName);
		});
	}

	export function EraseAllKeyCodes(actionName: string) {
		ExecuteWithActionData(actionName, (actionData) => {
			for (const keyCode of actionData.Keycodes) {
				EraseKeyCodeToActionReference(keyCode, actionName);
			}

			actionData.Keycodes = [];
		});
	}

	export function GetKeyCodes(actionName: string): readonly InputKeyCode[] {
		return GetActionData(actionName)?.Keycodes ?? [];
	}

	export function HasKeyCode(actionName: string, keyCode: InputKeyCode) {
		return actionsMap.get(actionName)?.Keycodes.includes(keyCode);
	}

	export function IsExisting(actionName: string) {
		return actionsMap.has(actionName);
	}

	export function GetActionsFromKeyCode(keyCode: InputKeyCode): readonly string[] {
		return keyCodeToActionsReferences.get(keyCode) ?? [];
	}

	export function SetActivationStrength(actionName: string, activationStrength: number) {
		const actionData = GetActionData(actionName);
		if (actionData === undefined) return;
		actionData.ActivationStrength = activationStrength;
	}

	export function Erase(actionName: string) {
		EraseAllKeyCodes(actionName);
		actionsMap.delete(actionName);
	}

	export function GetActions(): string[] {
		return TableTools.GetKeys(actionsMap);
	}
}
