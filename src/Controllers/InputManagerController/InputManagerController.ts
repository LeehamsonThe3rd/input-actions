//!native
//!optimize 2
import { ContextActionService } from "@rbxts/services";
import { EInputEventSubscriptionType } from "../../Models";
import { ECustomKey } from "../../Models/ECustomKey";
import { ActionResources } from "../../Resources/ActionResources";
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
	const input_signal = new InputSignal();

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
		return input_signal.Subscribe(callback, config?.Priority, config?.SubscriptionType);
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
	function PressActionsFromInputEvent(input_event: InputEvent) {
		for (const action_name of input_event.Actions) {
			ActionsController.Press(action_name, input_event.PressStrength);
		}
	}

	/**
	 * Parse and process an input event
	 * @param input_event_data The raw input event data
	 * @returns The result of processing the event
	 */
	export function ParseInputEvent(input_event_data: InputEventData) {
		const input_event = new InputEvent(input_event_data);
		PressActionsFromInputEvent(input_event);
		return input_signal.Fire(input_event);
	}

	/**
	 * Sets the press strength for a custom key and creates an input event
	 */
	function SetCustomKeyStrength(
		input: InputObject,
		custom_key: ECustomKey,
		strength: number,
		force: boolean = false,
	) {
		if (!force && saved_custom_key_press_strengths[custom_key] === strength) return;
		saved_custom_key_press_strengths[custom_key] = strength;

		const input_event_data = InputEventData.FromInputKeyCode(custom_key, input.UserInputType);
		input_event_data.Position = input.Position;
		input_event_data.Delta = input.Delta;
		input_event_data.PressStrength = strength;
		input_event_data.Changed = true;
		ParseInputEvent(input_event_data);
	}

	/**
	 * Extracts a normalized press strength from a raw input value
	 */
	function ExtractPressStrength(value: number, min: number, max: number) {
		return math.abs(math.clamp(value, min, max));
	}

	// Tracks the current press strength of all custom keys
	const saved_custom_key_press_strengths = identity<Record<ECustomKey, number>>({
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

	let saved_mouse_position = Vector3.zero;
	type CustomKeyStrategy = (input: InputObject) => void;

	// Strategies for processing different types of custom input
	const custom_key_strategies = {
		[Enum.KeyCode.Thumbstick1 as never]: (input: InputObject) => {
			const keyCode = Enum.KeyCode.Thumbstick1;
			const position = new Vector2(input.Position.X, input.Position.Y);
			const deadzone = InputConfigController.GetInputDeadzone(keyCode);

			const directions = ThumbstickHelper.ProcessThumbstick(position, deadzone);

			SetCustomKeyStrength(input, ECustomKey.Thumbstick1Left, directions.left);
			SetCustomKeyStrength(input, ECustomKey.Thumbstick1Right, directions.right);
			SetCustomKeyStrength(input, ECustomKey.Thumbstick1Up, directions.up);
			SetCustomKeyStrength(input, ECustomKey.Thumbstick1Down, directions.down);
		},
		[Enum.KeyCode.Thumbstick2 as never]: (input: InputObject) => {
			const keyCode = Enum.KeyCode.Thumbstick2;
			const position = new Vector2(input.Position.X, input.Position.Y);
			const deadzone = InputConfigController.GetInputDeadzone(keyCode);

			const directions = ThumbstickHelper.ProcessThumbstick(position, deadzone);

			SetCustomKeyStrength(input, ECustomKey.Thumbstick2Left, directions.left);
			SetCustomKeyStrength(input, ECustomKey.Thumbstick2Right, directions.right);
			SetCustomKeyStrength(input, ECustomKey.Thumbstick2Up, directions.up);
			SetCustomKeyStrength(input, ECustomKey.Thumbstick2Down, directions.down);
		},
		[Enum.UserInputType.MouseWheel as never]: (input: InputObject) => {
			const down_strength = ExtractPressStrength(input.Position.Z, -1, 0);
			const up_strength = ExtractPressStrength(input.Position.Z, 0, 1);
			if (down_strength !== 0)
				SetCustomKeyStrength(input, ECustomKey.MouseWheelDown, down_strength, true);

			if (up_strength !== 0)
				SetCustomKeyStrength(input, ECustomKey.MouseWheelUp, up_strength, true);
		},
		[Enum.UserInputType.MouseMovement as never]: (input: InputObject) => {
			const position_delta = input.Position.sub(saved_mouse_position);
			saved_mouse_position = input.Position;

			const total_delta = position_delta.add(input.Delta);

			const left_strength = math.abs(math.min(total_delta.X, 0));
			const right_strength = math.abs(math.max(total_delta.X, 0));
			const up_strength = math.abs(math.min(total_delta.Y, 0));
			const down_strength = math.abs(math.max(total_delta.Y, 0));

			SetCustomKeyStrength(input, ECustomKey.MouseLeft, left_strength);
			SetCustomKeyStrength(input, ECustomKey.MouseRight, right_strength);
			SetCustomKeyStrength(input, ECustomKey.MouseDown, down_strength);
			SetCustomKeyStrength(input, ECustomKey.MouseUp, up_strength);
		},
	};

	/**
	 * Checks if the input requires custom key processing and handles it
	 */
	function CheckAndParseIfCustomInputKeyCode(input: InputObject) {
		if (input.UserInputState !== Enum.UserInputState.Change) return;
		const input_key_code = GetInputKeyCode(input);
		const strategy = custom_key_strategies[input_key_code as never] as
			| CustomKeyStrategy
			| undefined;
		strategy?.(input);
	}

	/**
	 * Main input handler function called by ContextActionService
	 */
	function OnInput(_: string, state: Enum.UserInputState, input: InputObject) {
		if (state === Enum.UserInputState.None) return;
		if (state === Enum.UserInputState.Cancel) return;

		const press_strength = state === Enum.UserInputState.Begin ? 1 : 0;
		const input_key_code = GetInputKeyCode(input);
		const input_event_action = InputEventData.FromInputKeyCode(input_key_code, input.UserInputType);
		input_event_action.Position = input.Position;
		input_event_action.Changed = state === Enum.UserInputState.Change;
		input_event_action.Delta = input.Delta;
		input_event_action.PressStrength = press_strength;

		CheckAndParseIfCustomInputKeyCode(input);
		return ParseInputEvent(input_event_action);
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
			"ActionsReader",
			OnInput,
			false,
			ActionResources.DEFAULT_INPUT_PRIORITY,
			...ActionResources.ALL_KEYCODES,
		);
	}
}
