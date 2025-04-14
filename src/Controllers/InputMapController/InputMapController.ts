import { InputContextController } from "../InputContextController";
import { DefaultInputMaps } from "./DefaultInputActions";
import { GetVisualInputKeyCodeData, IVisualInputKeyCodeData } from "../../Utils/InputVisualization";
import { InputKeyCode } from "../../Models/InputKeyCode";

/**
 * Utilities for working with input maps and visual representation
 *
 * Note: Most functionality has moved to InputContextController, which is now
 * the recommended way to access and manage input mappings.
 */
export namespace InputMapController {
	/**
	 * Get visual data for a specific input key code
	 */
	export function GetVisualInputKeyCodeData(
		inputKeyCode?: InputKeyCode,
		useCustomImages: boolean = true,
	): IVisualInputKeyCodeData {
		return GetVisualInputKeyCodeData(inputKeyCode, useCustomImages);
	}

	/**
	 * Get access to default input maps
	 */
	export function GetDefaultInputMaps() {
		return DefaultInputMaps;
	}

	/**
	 * Apply the default input maps
	 */
	export function AddDefaultInputMaps() {
		DefaultInputMaps.ApplyDefaultMaps();
	}
}
