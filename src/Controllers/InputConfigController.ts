import { ActionResources } from "../Resources/ActionResources";
import { InputKeyCode } from "../Models/InputKeyCode";
import { ECustomKey } from "../Models/ECustomKey";

/**
 * Controller for configuring input behavior settings
 */
export namespace InputConfigController {
	const DEFAULT_MIN_PRESS_STRENGTH = ActionResources.DEFAULT_MIN_PRESS_STRENGTH;

	// Per-action activation thresholds
	const actionActivationThresholds = new Map<string, number>();

	// Per-input deadzone settings
	const inputDeadzones = new Map<InputKeyCode, number>();

	/**
	 * Sets the activation threshold for a specific action
	 * @param actionName The name of the action
	 * @param threshold Value between 0 and 1
	 */
	export function SetActionActivationThreshold(actionName: string, threshold: number) {
		actionActivationThresholds.set(actionName, math.clamp(threshold, 0, 1));
	}

	/**
	 * Gets the activation threshold for a specific action
	 */
	export function GetActionActivationThreshold(actionName: string): number {
		return actionActivationThresholds.get(actionName) ?? DEFAULT_MIN_PRESS_STRENGTH;
	}

	/**
	 * Sets the deadzone for an analog input
	 * @param inputKey The input key (typically a thumbstick or trigger)
	 * @param deadzone Value between 0 and 1
	 */
	export function SetInputDeadzone(inputKey: InputKeyCode, deadzone: number) {
		inputDeadzones.set(inputKey, math.clamp(deadzone, 0, 1));
	}

	/**
	 * Gets the deadzone for a specific input
	 */
	export function GetInputDeadzone(inputKey: InputKeyCode): number {
		return (
			inputDeadzones.get(inputKey) ??
			(IsThumbstickInput(inputKey) ? ActionResources.DEFAULT_THUMBSTICK_DEAD_ZONE : 0)
		);
	}

	// Check custom thumbstick keys
	const thumbstickCustomKeys = [
		ECustomKey.Thumbstick1Up,
		ECustomKey.Thumbstick1Down,
		ECustomKey.Thumbstick1Left,
		ECustomKey.Thumbstick1Right,
		ECustomKey.Thumbstick2Up,
		ECustomKey.Thumbstick2Down,
		ECustomKey.Thumbstick2Left,
		ECustomKey.Thumbstick2Right,
	];

	/**
	 * Checks if an input is a thumbstick-related input
	 */
	function IsThumbstickInput(inputKey: InputKeyCode): boolean {
		if (inputKey === Enum.KeyCode.Thumbstick1 || inputKey === Enum.KeyCode.Thumbstick2) {
			return true;
		}

		return thumbstickCustomKeys.includes(inputKey as ECustomKey);
	}
}
