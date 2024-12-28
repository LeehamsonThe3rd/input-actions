import { ActionsController } from "../Controllers/ActionsController";
import { InputController } from "../Controllers/InputController/InputController";
import { InputManagerController } from "../Controllers/InputManagerController/InputManagerController";
import { InputTypeController } from "../Controllers/InputTypeController";
import { MouseController } from "../Controllers/MouseController";

export namespace InputActionsInitializerTools {
	export function InitAll() {
		InitMouseController();
		InitInputTypeController();

		InitActionsAndInputManager();
		InitInputController();
	}

	export function InitMouseController() {
		MouseController.Initialize();
	}

	export function InitInputTypeController() {
		InputTypeController.Initialize();
	}

	export function InitActionsAndInputManager() {
		InputManagerController.Initialize();
		ActionsController.Initialize();
	}

	export function InitInputController() {
		InputController.Initialize();
	}
}
