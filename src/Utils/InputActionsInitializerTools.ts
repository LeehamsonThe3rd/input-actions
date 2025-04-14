import { ActionsController } from "../Controllers/ActionsController";
import { HapticFeedbackController } from "../Controllers/HapticFeedbackController";
import { InputConfigController } from "../Controllers/InputConfigController";
import { InputContextController } from "../Controllers/InputContextController";
import { InputController } from "../Controllers/InputController/InputController";
import { InputEchoController } from "../Controllers/InputEchoController";
import { InputManagerController } from "../Controllers/InputManagerController/InputManagerController";
import { InputTypeController } from "../Controllers/InputTypeController";
import { KeyCombinationController } from "../Controllers/KeyCombinationController";
import { MouseController } from "../Controllers/MouseController";

export namespace InputActionsInitializerTools {
	export function InitAll() {
		InitMouseController();
		InitInputTypeController();
		InitActionsAndInputManager();
		InitInputController();
		InitAdvancedControllers();
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

	export function InitAdvancedControllers() {
		InputContextController.Initialize?.();
		InputEchoController.Initialize();
		KeyCombinationController.Initialize();
	}
}
