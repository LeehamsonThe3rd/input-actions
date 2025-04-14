import { UserInputService } from "@rbxts/services";
import { InputKeyCode } from "../Models/InputKeyCode";
import { InputPriorityResources } from "../Resources/InputPriorityResources";
import { ActionsController } from "./ActionsController";
import { InputManagerController } from "./InputManagerController/InputManagerController";

/**
 * Controller for handling key combinations/chords
 */
export namespace KeyCombinationController {
	interface KeyCombination {
		/** Main key in the combination */
		mainKey: InputKeyCode;
		/** Modifier keys required (AND relationship) */
		modifiers: Enum.KeyCode[];
		/** Action to trigger when combination is detected */
		actionName: string;
	}

	const keyCombinations: KeyCombination[] = [];
	let initialized = false;

	/**
	 * Initializes the key combination controller
	 */
	export function Initialize() {
		if (initialized) return;
		initialized = true;

		// Subscribe to input events with high priority
		InputManagerController.Subscribe(HandleKeyInput, {
			Priority: InputPriorityResources.KEY_COMBINATION_PRIORITY,
		});
	}

	/**
	 * Registers a new key combination
	 */
	export function RegisterCombination(
		actionName: string,
		mainKey: InputKeyCode,
		modifiers: Enum.KeyCode[] = [],
	) {
		// Create the action if it doesn't exist
		if (!ActionsController.IsExisting(actionName)) {
			ActionsController.Add(actionName);
		}

		// Register the combination
		keyCombinations.push({
			mainKey,
			modifiers,
			actionName,
		});
	}

	/**
	 * Checks if all modifiers for a combination are currently pressed
	 */
	function AreModifiersPressed(modifiers: Enum.KeyCode[]): boolean {
		for (const modifier of modifiers) {
			if (!UserInputService.IsKeyDown(modifier)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Handles input events to detect key combinations
	 */
	function HandleKeyInput(inputEvent: import("./InputManagerController/InputEvent").default) {
		// Only process key presses, not releases
		if (!inputEvent.IsPressed()) return;

		// Check each registered combination
		for (const combo of keyCombinations) {
			if (inputEvent.InputKeyCode === combo.mainKey) {
				if (AreModifiersPressed(combo.modifiers)) {
					// Combination detected, trigger the action
					ActionsController.Press(combo.actionName);

					// Release it after a brief delay to simulate a press
					task.delay(InputPriorityResources.KEY_COMBINATION_RELEASE_DELAY, () => {
						ActionsController.Release(combo.actionName);
					});

					// Sink the input to prevent the main key from triggering its normal action
					return Enum.ContextActionResult.Sink;
				}
			}
		}
	}
}
