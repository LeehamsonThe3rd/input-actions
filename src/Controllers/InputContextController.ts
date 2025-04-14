import { ActionsController } from "./ActionsController";
import { InputKeyCode } from "../Models/InputKeyCode";

/**
 * Controller for managing different input contexts/action sets
 *
 * Allows switching between different input mappings for different
 * game states (e.g., gameplay, menu, vehicle)
 */
export namespace InputContextController {
	const contexts = new Map<string, Map<string, InputKeyCode[]>>();
	let currentContext = "";
	let initialized = false;

	/**
	 * Initialize the context controller
	 * Currently just marks the controller as initialized
	 */
	export function Initialize() {
		if (initialized) return;
		initialized = true;
	}

	/**
	 * Creates a new input context
	 */
	export function CreateContext(contextName: string) {
		if (contexts.has(contextName)) return;
		contexts.set(contextName, new Map<string, InputKeyCode[]>());
	}

	/**
	 * Adds an action mapping to a specific context
	 */
	export function AddActionToContext(
		contextName: string,
		actionName: string,
		keyCode: InputKeyCode,
	) {
		if (!contexts.has(contextName)) {
			CreateContext(contextName);
		}

		const contextMap = contexts.get(contextName)!;
		if (!contextMap.has(actionName)) {
			contextMap.set(actionName, []);
		}

		const keyCodes = contextMap.get(actionName)!;
		if (!keyCodes.includes(keyCode)) {
			keyCodes.push(keyCode);
		}
	}

	/**
	 * Activates a specific input context, deactivating the previous one
	 */
	export function SetActiveContext(contextName: string) {
		if (contextName === currentContext) return;
		if (!contexts.has(contextName)) {
			warn(`Context "${contextName}" does not exist`);
			return;
		}

		// Deactivate current context
		if (currentContext !== "" && contexts.has(currentContext)) {
			const prevContextMap = contexts.get(currentContext)!;
			for (const [actionName, _] of prevContextMap) {
				ActionsController.EraseAllKeyCodes(actionName);
			}
		}

		// Activate new context
		const newContextMap = contexts.get(contextName)!;
		for (const [actionName, keyCodes] of newContextMap) {
			if (!ActionsController.IsExisting(actionName)) {
				ActionsController.Add(actionName);
			}

			for (const keyCode of keyCodes) {
				ActionsController.AddKeyCode(actionName, keyCode);
			}
		}

		currentContext = contextName;
	}

	/**
	 * Gets the currently active context name
	 */
	export function GetActiveContext(): string {
		return currentContext;
	}
}
