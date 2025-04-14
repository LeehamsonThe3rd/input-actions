//!native
//!optimize 2
import { ContextActionService } from "@rbxts/services";
import { EInputEventSubscriptionType } from "../../Models";
import { ECustomKey } from "../../Models/ECustomKey";
import { ActionResources } from "../../Resources/ActionResources";
import { ContextActionResources } from "../../Resources/ContextActionResources";
import { ThumbstickHelper } from "../../Utils/ThumbstickHelper";
import { ActionsController } from "../ActionsController";
import { InputConfigController } from "../InputConfigController";
import InputEvent from "./InputEvent";
import InputEventData from "./InputEventData";
import InputSignal, { InputCallback } from "./InputSignal";

/**
 * Controller for managing and processing input events
 *
 * Handles the conversion of Roblox input events to our custom input system,
 * including custom key processing for thumbsticks and mouse movement.
 */
export namespace InputManagerController {
	const inputSignal = new InputSignal();

	/**
	 * Configuration options for input subscription
	 */
	export interface ISubscriptionConfig {
		/** Priority of the subscription (higher values are processed first) */
		Priority?: number;
		/** Type of events to subscribe to */
		SubscriptionType?: EInputEventSubscriptionType;
	}

	/**
	 * Subscribe to input events with optional configuration
	 * @param callback Function to call when input is received
	 * @param config Optional configuration for the subscription
	 * @returns Cleanup function to remove the subscription
	 */
	export function Subscribe(callback: InputCallback, config?: ISubscriptionConfig) {
		return inputSignal.Subscribe(callback, config?.Priority, config?.SubscriptionType);
	}

	/**
	 * Gets the appropriate key code from an input object
	 */
	function GetInputKeyCode(input: InputObject) {
		return input.KeyCode === Enum.KeyCode.Unknown ? input.UserInputType : input.KeyCode;
	}

	/**
	 * Updates action press states based on an input event
	 */
	function PressActionsFromInputEvent(inputEvent: InputEvent) {
		for (const actionName of inputEvent.Actions) {
			ActionsController.Press(actionName, inputEvent.PressStrength);
		}
	}

	/**
	 * Parse and process an input event
	 * @param inputEventData The raw input event data
	 * @returns The result of processing the event
	 */
	export function ParseInputEvent(inputEventData: InputEventData) {
		const inputEvent = new InputEvent(inputEventData);
		PressActionsFromInputEvent(inputEvent);
		return inputSignal.Fire(inputEvent);
	}

	/**
	 * Sets the press strength for a custom key and creates an input event
	 */
	function SetCustomKeyStrength(
		input: InputObject,
		customKey: ECustomKey,
		strength: number,
		force: boolean = false,
	) {
		if (!force && CustomKeyPressStrengths[customKey] === strength) return;
		CustomKeyPressStrengths[customKey] = strength;

		const inputEventData = InputEventData.FromInputKeyCode(customKey, input.UserInputType);
		inputEventData.Position = input.Position;
		inputEventData.Delta = input.Delta;
		inputEventData.PressStrength = strength;
		inputEventData.Changed = true;
		ParseInputEvent(inputEventData);
	}

	/**
	 * Extracts a normalized press strength from a raw input value
	 */
	function ExtractPressStrength(value: number, min: number, max: number) {
		return math.abs(math.clamp(value, min, max));
	}

	// Tracks the current press strength of all custom keys
	const CustomKeyPressStrengths = identity<Record<ECustomKey, number>>({
		[ECustomKey.Thumbstick1Left]: 0,
		[ECustomKey.Thumbstick1Right]: 0,
		[ECustomKey.Thumbstick1Up]: 0,
		[ECustomKey.Thumbstick1Down]: 0,

		[ECustomKey.Thumbstick2Left]: 0,
		[ECustomKey.Thumbstick2Right]: 0,
		[ECustomKey.Thumbstick2Up]: 0,
		[ECustomKey.Thumbstick2Down]: 0,

		[ECustomKey.MouseWheelUp]: 0,
		[ECustomKey.MouseWheelDown]: 0,

		[ECustomKey.MouseLeft]: 0,
		[ECustomKey.MouseRight]: 0,
		[ECustomKey.MouseDown]: 0,
		[ECustomKey.MouseUp]: 0,
	});

	let savedMousePosition = Vector3.zero;
	type CustomKeyStrategy = (input: InputObject) => void;

	// Strategies for processing different types of custom input
	const CustomKeyStrategies = {
		[Enum.KeyCode.Thumbstick1 as never]: (input: InputObject) => {
			const keyCode = Enum.KeyCode.Thumbstick1;
			const position = new Vector2(input.Position.X, input.Position.Y);
			const deadzone = InputConfigController.GetInputDeadzone(keyCode);

			const directions = ThumbstickHelper.ProcessThumbstick(position, deadzone);

			SetCustomKeyStrength(input, ECustomKey.Thumbstick1Left, directions.Left);
			SetCustomKeyStrength(input, ECustomKey.Thumbstick1Right, directions.Right);
			SetCustomKeyStrength(input, ECustomKey.Thumbstick1Up, directions.Up);
			SetCustomKeyStrength(input, ECustomKey.Thumbstick1Down, directions.Down);
		},
		[Enum.KeyCode.Thumbstick2 as never]: (input: InputObject) => {
			const keyCode = Enum.KeyCode.Thumbstick2;
			const position = new Vector2(input.Position.X, input.Position.Y);
			const deadzone = InputConfigController.GetInputDeadzone(keyCode);

			const directions = ThumbstickHelper.ProcessThumbstick(position, deadzone);

			SetCustomKeyStrength(input, ECustomKey.Thumbstick2Left, directions.Left);
			SetCustomKeyStrength(input, ECustomKey.Thumbstick2Right, directions.Right);
			SetCustomKeyStrength(input, ECustomKey.Thumbstick2Up, directions.Up);
			SetCustomKeyStrength(input, ECustomKey.Thumbstick2Down, directions.Down);
		},
		[Enum.UserInputType.MouseWheel as never]: (input: InputObject) => {
			const downStrength = ExtractPressStrength(input.Position.Z, -1, 0);
			const upStrength = ExtractPressStrength(input.Position.Z, 0, 1);
			if (downStrength !== 0)
				SetCustomKeyStrength(input, ECustomKey.MouseWheelDown, downStrength, true);

			if (upStrength !== 0) SetCustomKeyStrength(input, ECustomKey.MouseWheelUp, upStrength, true);
		},
		[Enum.UserInputType.MouseMovement as never]: (input: InputObject) => {
			const positionDelta = input.Position.sub(savedMousePosition);
			savedMousePosition = input.Position;

			const totalDelta = positionDelta.add(input.Delta);

			const leftStrength = math.abs(math.min(totalDelta.X, 0));
			const rightStrength = math.abs(math.max(totalDelta.X, 0));
			const upStrength = math.abs(math.min(totalDelta.Y, 0));
			const downStrength = math.abs(math.max(totalDelta.Y, 0));

			SetCustomKeyStrength(input, ECustomKey.MouseLeft, leftStrength);
			SetCustomKeyStrength(input, ECustomKey.MouseRight, rightStrength);
			SetCustomKeyStrength(input, ECustomKey.MouseDown, downStrength);
			SetCustomKeyStrength(input, ECustomKey.MouseUp, upStrength);
		},
	};

	/**
	 * Checks if the input requires custom key processing and handles it
	 */
	function CheckAndParseIfCustomInputKeyCode(input: InputObject) {
		if (input.UserInputState !== Enum.UserInputState.Change) return;
		const inputKeyCode = GetInputKeyCode(input);
		const strategy = CustomKeyStrategies[inputKeyCode as never] as CustomKeyStrategy | undefined;
		strategy?.(input);
	}

	/**
	 * Main input handler function called by ContextActionService
	 */
	function OnInput(_: string, state: Enum.UserInputState, input: InputObject) {
		if (state === Enum.UserInputState.None) return;
		if (state === Enum.UserInputState.Cancel) return;

		const pressStrength = state === Enum.UserInputState.Begin ? 1 : 0;
		const inputKeyCode = GetInputKeyCode(input);
		const inputEventAction = InputEventData.FromInputKeyCode(inputKeyCode, input.UserInputType);
		inputEventAction.Position = input.Position;
		inputEventAction.Changed = state === Enum.UserInputState.Change;
		inputEventAction.Delta = input.Delta;
		inputEventAction.PressStrength = pressStrength;

		CheckAndParseIfCustomInputKeyCode(input);
		return ParseInputEvent(inputEventAction);
	}

	let initialized = false;
	/**
	 * Initialize the input manager system
	 * Must be called before using any other functionality
	 */
	export function Initialize() {
		if (initialized) return;
		initialized = true;
		ContextActionService.BindActionAtPriority(
			ContextActionResources.ACTIONS_READER_NAME,
			OnInput,
			false,
			ActionResources.DEFAULT_INPUT_PRIORITY,
			...ActionResources.ALL_KEYCODES,
		);
	}
}
