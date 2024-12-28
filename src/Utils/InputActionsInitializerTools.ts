import { ActionsController } from "../Controllers/ActionsController";
import { InputController } from "../Controllers/InputController/InputController";
import { InputManagerController } from "../Controllers/InputManagerController/InputManagerController";
import { InputMapController } from "../Controllers/InputMapController/InputMapController";
import { InputTypeController } from "../Controllers/InputTypeController";
import { MouseController } from "../Controllers/MouseController";

export namespace InputActionsInitializerTools {
	export function InitAll(initialize_default_input_maps?: boolean) {
		InitInputMapController(initialize_default_input_maps);
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

	export function InitInputMapController(initialize_default_input_maps?: boolean) {
		InputMapController.Initialize(initialize_default_input_maps);
	}

	export function InitActionsAndInputManager() {
		InputManagerController.Initialize();
		ActionsController.Initialize();
	}

	export function InitInputController() {
		InputController.Initialize();
	}
}
