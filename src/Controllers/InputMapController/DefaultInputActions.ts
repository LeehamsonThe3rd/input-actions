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
	navigationContext.add(EDefaultInputAction.UiGoUp, {
		Gamepad: Enum.KeyCode.DPadUp,
		KeyboardAndMouse: Enum.KeyCode.Up,
	});

	navigationContext.add(EDefaultInputAction.UiGoDown, {
		Gamepad: Enum.KeyCode.DPadDown,
		KeyboardAndMouse: Enum.KeyCode.Down,
	});

	navigationContext.add(EDefaultInputAction.UiGoLeft, {
		Gamepad: Enum.KeyCode.DPadLeft,
		KeyboardAndMouse: Enum.KeyCode.Left,
	});

	navigationContext.add(EDefaultInputAction.UiGoRight, {
		Gamepad: Enum.KeyCode.DPadRight,
		KeyboardAndMouse: Enum.KeyCode.Right,
	});

	// Set up action maps
	actionContext.add(EDefaultInputAction.UiAccept, {
		Gamepad: Enum.KeyCode.ButtonA,
		KeyboardAndMouse: Enum.KeyCode.Return,
	});

	actionContext.add(EDefaultInputAction.UiCancel, {
		Gamepad: Enum.KeyCode.ButtonB,
		KeyboardAndMouse: Enum.KeyCode.B,
	});

	// Set up scrolling maps
	scrollingContext.add(EDefaultInputAction.UiScrollUp, {
		Gamepad: ECustomKey.Thumbstick2Up,
		KeyboardAndMouse: Enum.KeyCode.W,
	});

	scrollingContext.add(EDefaultInputAction.UiScrollDown, {
		Gamepad: ECustomKey.Thumbstick2Down,
		KeyboardAndMouse: Enum.KeyCode.S,
	});

	scrollingContext.add(EDefaultInputAction.UiNextPage, {
		Gamepad: Enum.KeyCode.ButtonR1,
		KeyboardAndMouse: Enum.KeyCode.E,
	});

	scrollingContext.add(EDefaultInputAction.UiPreviousPage, {
		Gamepad: Enum.KeyCode.ButtonL1,
		KeyboardAndMouse: Enum.KeyCode.Q,
	});

	// Set up debug maps
	debugContext.add(EDefaultInputAction.MouseDebugMode, {
		KeyboardAndMouse: Enum.KeyCode.LeftAlt,
	});

	/**
	 * Initialize default input maps in the global context
	 */
	export function initializeDefaultMaps(): void {
		const globalContext = InputContextController.getGlobalContext();

		for (const context of [navigationContext, actionContext, scrollingContext, debugContext]) {
			for (const [actionName, map] of context.getMaps()) {
				globalContext.add(actionName, map);
			}
		}
	}

	export function applyDefaultMaps(): void {
		initializeDefaultMaps();
		InputContextController.getGlobalContext().assign();
	}

	export function getNavigationMaps(): ReadonlyMap<string, IInputMap> {
		return navigationContext.getMaps();
	}

	export function getActionMaps(): ReadonlyMap<string, IInputMap> {
		return actionContext.getMaps();
	}

	export function getScrollingMaps(): ReadonlyMap<string, IInputMap> {
		return scrollingContext.getMaps();
	}

	export function getDebugMaps(): ReadonlyMap<string, IInputMap> {
		return debugContext.getMaps();
	}
}
