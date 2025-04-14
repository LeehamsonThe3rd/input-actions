import { ActionsController } from "./ActionsController";
import { InputKeyCode } from "../Models/InputKeyCode";
import { InputContextSystem } from "./InputContextController/InputContextSystem";

/**
 * Controller for managing different input contexts/action sets
 *
 * @deprecated Use InputContextSystem from InputMapController.getContextSystem() instead
 */
export namespace InputContextController {
	let initialized = false;

	/**
	 * Initialize the context controller
	 */
	export function Initialize() {
		if (initialized) return;
		initialized = true;
	}

	/**
	 * Creates a new input context
	 * @deprecated Use InputMapController.createContext() instead
	 */
	export function CreateContext(contextName: string) {
		return InputContextSystem.createContext(contextName);
	}

	/**
	 * Adds an action mapping to a specific context
	 * @deprecated Use context.addMap() or InputContextSystem directly
	 */
	export function AddActionToContext(
		contextName: string,
		actionName: string,
		keyCode: InputKeyCode,
	) {
		const context =
			InputContextSystem.getContext(contextName) ?? InputContextSystem.createContext(contextName);

		// Determine if it's a gamepad or keyboard key
		const isGamepad =
			keyCode.EnumType === Enum.KeyCode &&
			[
				Enum.KeyCode.ButtonA,
				Enum.KeyCode.ButtonB,
				Enum.KeyCode.ButtonX,
				Enum.KeyCode.ButtonY,
				Enum.KeyCode.ButtonR1,
				Enum.KeyCode.ButtonL1,
				Enum.KeyCode.ButtonR2,
				Enum.KeyCode.ButtonL2,
				Enum.KeyCode.ButtonR3,
				Enum.KeyCode.ButtonL3,
				Enum.KeyCode.DPadLeft,
				Enum.KeyCode.DPadRight,
				Enum.KeyCode.DPadUp,
				Enum.KeyCode.DPadDown,
				Enum.KeyCode.Thumbstick1,
				Enum.KeyCode.Thumbstick2,
			].includes(keyCode as Enum.KeyCode);

		// Get existing map or create a new one
		const currentMap = context.getMap(actionName) ?? {
			Gamepad: undefined,
			KeyboardAndMouse: undefined,
		};

		// Add the key to appropriate slot
		if (isGamepad) {
			context.add(actionName, {
				...currentMap,
				Gamepad: keyCode,
			});
		} else {
			context.add(actionName, {
				...currentMap,
				KeyboardAndMouse: keyCode,
			});
		}
	}

	/**
	 * Activates a specific input context, deactivating the previous one
	 * @deprecated Use context.assign() and context.unassign() instead
	 */
	export function SetActiveContext(contextName: string) {
		// Unassign all contexts first
		for (const [name, context] of InputContextSystem.getAllContexts()) {
			if (context.isAssigned()) {
				context.unassign();
			}
		}

		// Assign the new context
		InputContextSystem.assignContext(contextName);
	}

	/**
	 * Gets the currently active context name
	 * @deprecated Use InputContextSystem directly
	 */
	export function GetActiveContext(): string {
		for (const [name, context] of InputContextSystem.getAllContexts()) {
			if (context.isAssigned()) {
				return name;
			}
		}
		return "";
	}
}
