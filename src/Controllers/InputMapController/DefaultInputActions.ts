import { ECustomKey } from "../../Models/ECustomKey";
import { EDefaultInputAction } from "../../Models/EDefaultInputAction";
import IInputMap from "../../Models/IInputMap";
import { InputMapBuilder } from "./InputMapBuilder";
import { InputContext, InputContextSystem } from "../InputContextController/InputContextSystem";

/**
 * Default input maps organized by category
 */
export namespace DefaultInputMaps {
	// Create contexts for each category
	const navigationContext = new InputContext("Navigation");
	const actionContext = new InputContext("Actions");
	const scrollingContext = new InputContext("Scrolling");
	const debugContext = new InputContext("Debug");

	// Set up navigation maps
	navigationContext.add(
		EDefaultInputAction.UiGoUp,
		InputMapBuilder.create()
			.withGamepad(Enum.KeyCode.DPadUp)
			.withKeyboardAndMouse(Enum.KeyCode.Up)
			.build(),
	);

	navigationContext.add(
		EDefaultInputAction.UiGoDown,
		InputMapBuilder.create()
			.withGamepad(Enum.KeyCode.DPadDown)
			.withKeyboardAndMouse(Enum.KeyCode.Down)
			.build(),
	);

	navigationContext.add(
		EDefaultInputAction.UiGoLeft,
		InputMapBuilder.create()
			.withGamepad(Enum.KeyCode.DPadLeft)
			.withKeyboardAndMouse(Enum.KeyCode.Left)
			.build(),
	);

	navigationContext.add(
		EDefaultInputAction.UiGoRight,
		InputMapBuilder.create()
			.withGamepad(Enum.KeyCode.DPadRight)
			.withKeyboardAndMouse(Enum.KeyCode.Right)
			.build(),
	);

	// Set up action maps
	actionContext.add(
		EDefaultInputAction.UiAccept,
		InputMapBuilder.create()
			.withGamepad(Enum.KeyCode.ButtonA)
			.withKeyboardAndMouse(Enum.KeyCode.Return)
			.build(),
	);

	actionContext.add(
		EDefaultInputAction.UiCancel,
		InputMapBuilder.create()
			.withGamepad(Enum.KeyCode.ButtonB)
			.withKeyboardAndMouse(Enum.KeyCode.B)
			.build(),
	);

	// Set up scrolling maps
	scrollingContext.add(
		EDefaultInputAction.UiScrollUp,
		InputMapBuilder.create()
			.withGamepad(ECustomKey.Thumbstick2Up)
			.withKeyboardAndMouse(Enum.KeyCode.W)
			.build(),
	);

	scrollingContext.add(
		EDefaultInputAction.UiScrollDown,
		InputMapBuilder.create()
			.withGamepad(ECustomKey.Thumbstick2Down)
			.withKeyboardAndMouse(Enum.KeyCode.S)
			.build(),
	);

	scrollingContext.add(
		EDefaultInputAction.UiNextPage,
		InputMapBuilder.create()
			.withGamepad(Enum.KeyCode.ButtonR1)
			.withKeyboardAndMouse(Enum.KeyCode.E)
			.build(),
	);

	scrollingContext.add(
		EDefaultInputAction.UiPreviousPage,
		InputMapBuilder.create()
			.withGamepad(Enum.KeyCode.ButtonL1)
			.withKeyboardAndMouse(Enum.KeyCode.Q)
			.build(),
	);

	// Set up debug maps
	debugContext.add(
		EDefaultInputAction.MouseDebugMode,
		InputMapBuilder.create().withKeyboardAndMouse(Enum.KeyCode.LeftAlt).build(),
	);

	/**
	 * Initialize default input maps in the global context
	 */
	export function initializeDefaultMaps(): void {
		const globalContext = InputContextSystem.getGlobalContext();

		// Add all maps to the global context
		for (const context of [navigationContext, actionContext, scrollingContext, debugContext]) {
			for (const [actionName, map] of context.getMaps()) {
				globalContext.add(actionName, map);
			}
		}
	}

	/**
	 * Apply default input maps to the input system
	 */
	export function applyDefaultMaps(): void {
		initializeDefaultMaps();
		InputContextSystem.getGlobalContext().assign();
	}

	/**
	 * Get navigation-related input maps
	 */
	export function getNavigationMaps(): ReadonlyMap<string, IInputMap> {
		return navigationContext.getMaps();
	}

	/**
	 * Get action-related input maps
	 */
	export function getActionMaps(): ReadonlyMap<string, IInputMap> {
		return actionContext.getMaps();
	}

	/**
	 * Get scrolling-related input maps
	 */
	export function getScrollingMaps(): ReadonlyMap<string, IInputMap> {
		return scrollingContext.getMaps();
	}

	/**
	 * Get debug-related input maps
	 */
	export function getDebugMaps(): ReadonlyMap<string, IInputMap> {
		return debugContext.getMaps();
	}
}
