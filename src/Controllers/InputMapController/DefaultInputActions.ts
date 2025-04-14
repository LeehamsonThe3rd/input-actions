import { ECustomKey } from "../../Models/ECustomKey";
import { EDefaultInputAction } from "../../Models/EDefaultInputAction";
import IInputMap from "../../Models/IInputMap";
import { InputContext, InputContextController } from "../InputContextController";

/**
 * Default input maps organized by category
 */
export namespace DefaultInputMaps {
	// Create contexts for each category
	const navigationContext = new InputContext("Navigation");
	const actionContext = new InputContext("Actions");
	const scrollingContext = new InputContext("Scrolling");
	const debugContext = new InputContext("Debug");

	// Set up navigation maps using direct object literals
	navigationContext.Add(EDefaultInputAction.UiGoUp, {
		Gamepad: Enum.KeyCode.DPadUp,
		KeyboardAndMouse: Enum.KeyCode.Up,
	});

	navigationContext.Add(EDefaultInputAction.UiGoDown, {
		Gamepad: Enum.KeyCode.DPadDown,
		KeyboardAndMouse: Enum.KeyCode.Down,
	});

	navigationContext.Add(EDefaultInputAction.UiGoLeft, {
		Gamepad: Enum.KeyCode.DPadLeft,
		KeyboardAndMouse: Enum.KeyCode.Left,
	});

	navigationContext.Add(EDefaultInputAction.UiGoRight, {
		Gamepad: Enum.KeyCode.DPadRight,
		KeyboardAndMouse: Enum.KeyCode.Right,
	});

	// Set up action maps
	actionContext.Add(EDefaultInputAction.UiAccept, {
		Gamepad: Enum.KeyCode.ButtonA,
		KeyboardAndMouse: Enum.KeyCode.Return,
	});

	actionContext.Add(EDefaultInputAction.UiCancel, {
		Gamepad: Enum.KeyCode.ButtonB,
		KeyboardAndMouse: Enum.KeyCode.B,
	});

	// Set up scrolling maps
	scrollingContext.Add(EDefaultInputAction.UiScrollUp, {
		Gamepad: ECustomKey.Thumbstick2Up,
		KeyboardAndMouse: Enum.KeyCode.W,
	});

	scrollingContext.Add(EDefaultInputAction.UiScrollDown, {
		Gamepad: ECustomKey.Thumbstick2Down,
		KeyboardAndMouse: Enum.KeyCode.S,
	});

	scrollingContext.Add(EDefaultInputAction.UiNextPage, {
		Gamepad: Enum.KeyCode.ButtonR1,
		KeyboardAndMouse: Enum.KeyCode.E,
	});

	scrollingContext.Add(EDefaultInputAction.UiPreviousPage, {
		Gamepad: Enum.KeyCode.ButtonL1,
		KeyboardAndMouse: Enum.KeyCode.Q,
	});

	// Set up debug maps
	debugContext.Add(EDefaultInputAction.MouseDebugMode, {
		KeyboardAndMouse: Enum.KeyCode.LeftAlt,
	});

	/**
	 * Initialize default input maps in the global context
	 */
	export function InitializeDefaultMaps(): void {
		const globalContext = InputContextController.GetGlobalContext();

		for (const context of [navigationContext, actionContext, scrollingContext, debugContext]) {
			for (const [actionName, map] of context.GetMaps()) {
				globalContext.Add(actionName, map);
			}
		}
	}

	export function ApplyDefaultMaps(): void {
		InitializeDefaultMaps();
		InputContextController.GetGlobalContext().Assign();
	}

	export function GetNavigationMaps(): ReadonlyMap<string, IInputMap> {
		return navigationContext.GetMaps();
	}

	export function GetActionMaps(): ReadonlyMap<string, IInputMap> {
		return actionContext.GetMaps();
	}

	export function GetScrollingMaps(): ReadonlyMap<string, IInputMap> {
		return scrollingContext.GetMaps();
	}

	export function GetDebugMaps(): ReadonlyMap<string, IInputMap> {
		return debugContext.GetMaps();
	}
}
