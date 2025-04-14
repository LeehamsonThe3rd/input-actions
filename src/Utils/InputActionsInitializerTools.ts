import { ActionsController } from "../Controllers/ActionsController";
import { HapticFeedbackController } from "../Controllers/HapticFeedbackController";
import { InputConfigController } from "../Controllers/InputConfigController";
import { InputController } from "../Controllers/InputController/InputController";
import { InputEchoController } from "../Controllers/InputEchoController";
import { InputMapController } from "../Controllers/InputMapController/InputMapController";
import { InputManagerController } from "../Controllers/InputManagerController/InputManagerController";
import { InputTypeController } from "../Controllers/InputTypeController";
import { KeyCombinationController } from "../Controllers/KeyCombinationController";
import { MouseController } from "../Controllers/MouseController";
import { EVibrationPreset } from "../Models/EVibrationPreset";

export namespace InputActionsInitializerTools {
	export function InitAll() {
		InitMouseController();
		InitInputTypeController();
		InitActionsAndInputManager();
		InitInputController();
		InitAdvancedControllers();
		InitConfigController();
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
		InputEchoController.Initialize();
		KeyCombinationController.Initialize();
		InputMapController.GetContextController();
	}

	export function InitConfigController() {
		// Nothing to initialize, but this function is provided for consistency
	}

	export function TriggerHapticFeedback(
		preset: EVibrationPreset | { largeMotor?: number; smallMotor?: number; duration?: number },
	) {
		if (typeof preset === "object") {
			HapticFeedbackController.Vibrate(preset.largeMotor, preset.smallMotor, preset.duration);
		} else {
			HapticFeedbackController.VibratePreset(preset);
		}
	}
}
