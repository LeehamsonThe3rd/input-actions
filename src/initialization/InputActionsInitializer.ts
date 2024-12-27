import { Actions } from "../input-actions/actions";
import { InputManager } from "../input-actions/input_manager/input_manager";
import { InputSettings } from "../input-actions/input_settings/input_settings";
import { InputTypeTracker } from "../tools/input_type_tracker";
import { MouseControl } from "../tools/mouse_control/MouseControl";
import { Input } from "../tools/input/input";

export namespace InputActionsInitializer {
	export function ActivateAll() {
		ActivateInputSettings();
		ActivateMouseControl();
		ActivateInputTypeTracker();

		ActivateActions();
		ActivateInput();
	}

	export function ActivateMouseControl() {
		MouseControl.Initialize();
	}

	export function ActivateInputTypeTracker() {
		InputTypeTracker.Initialize();
	}

	export function ActivateInputSettings() {
		InputSettings.Initialize();
	}

	export async function ActivateActions() {
		task.wait(1);
		InputManager.Initialize();
		Actions.Initialize();
	}

	export function ActivateInput() {
		Input.Initialize();
	}
}
