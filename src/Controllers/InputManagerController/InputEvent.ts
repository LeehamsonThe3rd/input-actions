//!native
//!optimize 2
import { UserInputService } from "@rbxts/services";
import { InputKeyCode } from "../../Models/InputKeyCode";
import { ActionResources } from "../../Resources/ActionResources";
import GetInputKeyCodeName from "../../Utils/GetInputKeyCodeName";
import { ActionsController } from "../ActionsController";
import InputEventData from "./InputEventData";

/**
 * Represents an input event that can be handled by input processors
 * Similar to Godot's InputEvent class
 */
export default class InputEvent {
	/** The keycode that generated this event */
	readonly InputKeyCode: InputKeyCode;
	/** The type of input that generated this event */
	readonly UserInputType: Enum.UserInputType;
	/** Position of the input (for mouse/touch) */
	readonly Position: Vector3;
	/** Change in position since last event (for mouse/touch) */
	readonly Delta: Vector3;
	/** Strength of the press (0 to 1) */
	readonly PressStrength: number;
	/** Actions that are associated with this input */
	readonly Actions: readonly string[];
	/** Whether this is a change event (continuous input) */
	readonly Changed: boolean;
	/** Timestamp when this event was created */
	readonly Timestamp: number;

	constructor(input_event_action: InputEventData) {
		//fetching data from the input event action
		this.InputKeyCode = input_event_action.InputKeyCode;
		this.Position = input_event_action.Position;
		this.Delta = input_event_action.Delta;
		this.PressStrength = input_event_action.PressStrength;
		this.UserInputType = input_event_action.UserInputType;
		this.Changed = input_event_action.Changed;
		this.Timestamp = os.clock();

		const action = input_event_action.Action;
		if (action !== ActionResources.NONE_ACTION) {
			this.Actions = [action];
		} else this.Actions = table.clone(ActionsController.GetActionsFromKeyCode(this.InputKeyCode));

		table.freeze(this.Actions);
		return table.freeze(this);
	}

	/**
	 * Get the textual representation of the input
	 */
	AsText(): string {
		return GetInputKeyCodeName(this.InputKeyCode);
	}

	/**
	 * Check if this event is associated with a specific action
	 */
	IsAction(action_name: string): boolean {
		return this.Actions.includes(action_name);
	}

	/**
	 * Check if an action associated with this event is currently pressed
	 */
	IsActionPressed(action_name: string): boolean {
		if (!this.Actions.includes(action_name)) return false;
		return ActionsController.IsPressedThisFrame(action_name);
	}

	/**
	 * Check if an action associated with this event was just pressed this frame
	 */
	IsActionJustPressed(action_name: string): boolean {
		if (!this.Actions.includes(action_name)) return false;
		return ActionsController.IsJustPressedThisFrame(action_name);
	}

	/**
	 * Check if an action associated with this event is currently released
	 */
	IsActionReleased(action_name: string): boolean {
		if (!this.Actions.includes(action_name)) return false;
		return ActionsController.IsReleasedThisFrame(action_name);
	}

	/**
	 * Check if an action associated with this event was just released this frame
	 */
	IsActionJustReleased(action_name: string): boolean {
		if (!this.Actions.includes(action_name)) return false;
		return ActionsController.IsJustReleasedThisFrame(action_name);
	}

	/**
	 * Check if this event has any associated actions
	 */
	ContainsActions(): boolean {
		return !this.Actions.isEmpty();
	}

	/**
	 * Check if this input is pressed (strength >= activation threshold)
	 */
	IsPressed(activation_strength: number = ActionResources.DEFAULT_MIN_PRESS_STRENGTH): boolean {
		return this.PressStrength >= activation_strength;
	}

	/**
	 * Check if this input is released (strength < activation threshold)
	 */
	IsReleased(activation_strength: number = ActionResources.DEFAULT_MIN_PRESS_STRENGTH) {
		return this.PressStrength < activation_strength;
	}

	/**
	 * Check if a modifier key is pressed
	 */
	IsKeyModifierPressed(modifier: Enum.ModifierKey) {
		if (modifier === Enum.ModifierKey.Alt) {
			return (
				UserInputService.IsKeyDown(Enum.KeyCode.LeftAlt) ||
				UserInputService.IsKeyDown(Enum.KeyCode.RightAlt)
			);
		} else if (modifier === Enum.ModifierKey.Ctrl) {
			return (
				UserInputService.IsKeyDown(Enum.KeyCode.LeftControl) ||
				UserInputService.IsKeyDown(Enum.KeyCode.RightControl)
			);
		} else if (modifier === Enum.ModifierKey.Shift) {
			return (
				UserInputService.IsKeyDown(Enum.KeyCode.LeftShift) ||
				UserInputService.IsKeyDown(Enum.KeyCode.RightShift)
			);
		} else if (modifier === Enum.ModifierKey.Meta) {
			return (
				UserInputService.IsKeyDown(Enum.KeyCode.LeftMeta) ||
				UserInputService.IsKeyDown(Enum.KeyCode.RightMeta)
			);
		}
		return false;
	}
}
