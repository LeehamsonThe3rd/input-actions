import { ActionsController } from "../Controllers/ActionsController";
import { InputContextController } from "../Controllers/InputContextController";
import { InputEchoController } from "../Controllers/InputEchoController";
import { InputManagerController } from "../Controllers/InputManagerController/InputManagerController";
import { KeyCombinationController } from "../Controllers/KeyCombinationController";
import { MouseController } from "../Controllers/MouseController";
import { DeviceTypeHandler } from "./DeviceTypeHandler";
import { RawInputHandler } from "./RawInputHandler";

export namespace InputActionsInitializationHelper {
	export function InitAll() {
		InitMouseController();
		InitDeviceTypeHandler();
		InitBasicInputControllers();
		InitRawInputHandler();
		InitAdvancedInputControllers();
	}

	export function InitMouseController() {
		MouseController.Initialize();
	}

	export function InitDeviceTypeHandler() {
		DeviceTypeHandler.Initialize();
	}

	export function InitRawInputHandler() {
		RawInputHandler.Initialize();
	}

	/**
	 * InputManagerController
	 * ActionsController
	 */
	export function InitBasicInputControllers() {
		InputManagerController.Initialize();
		ActionsController.Initialize();
	}

	/**
	 * InputEchoController
	 * KeyCombinationController
	 * InputContextController
	 */
	export function InitAdvancedInputControllers() {
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
}
