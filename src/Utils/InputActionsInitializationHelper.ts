import { ActionsController } from "../Controllers/ActionsController";
import { HapticFeedbackController } from "../Controllers/HapticFeedbackController";
import { InputContextController } from "../Controllers/InputContextController";
import { InputEchoController } from "../Controllers/InputEchoController";
import { InputManagerController } from "../Controllers/InputManagerController/InputManagerController";
import { InputTypeController } from "../Controllers/InputTypeController";
import { KeyCombinationController } from "../Controllers/KeyCombinationController";
import { MouseController } from "../Controllers/MouseController";
import { EVibrationPreset } from "../Models/EVibrationPreset";
import { RawInputHandler } from "./RawInputHandler";

export namespace InputActionsInitializationHelper {
	export function InitAll() {
		InitMouseController();
		InitInputTypeController();
		InitActionsAndInputManager();
		InitRawInputHandler();
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

	export function InitRawInputHandler() {
		RawInputHandler.Initialize();
	}

	export function InitAdvancedControllers() {
		InputEchoController.Initialize();
		KeyCombinationController.Initialize();
		InputContextController.Initialize();
	}

	/**
	 * Apply default input maps for standard UI navigation
	 */
	export function ApplyDefaultInputMaps() {
		InputContextController.ApplyDefaultInputMaps();
	}

	export function InitConfigController() {
		// Nothing to initialize, but this function is provided for consistency
	}

	export function TriggerHapticFeedback(
		preset: EVibrationPreset | HapticFeedbackController.IVibrationPreset,
	) {
		if (typeIs(preset, "table")) {
			HapticFeedbackController.Vibrate(preset.LargeMotor, preset.SmallMotor, preset.Duration);
		} else {
			HapticFeedbackController.VibratePreset(preset);
		}
	}
}
