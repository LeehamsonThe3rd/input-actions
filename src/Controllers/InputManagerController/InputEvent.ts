//!native
//!optimize 2
import { UserInputService } from "@rbxts/services";
import { InputKeyCode } from "../../Models/InputKeyCode";
import { ActionResources } from "../../Resources/ActionResources";
import GetInputKeyCodeName from "../../Utils/GetInputKeyCodeName";
import { ActionsController } from "../ActionsController";
import InputEventData from "./InputEventData";

export default class InputEvent {
	readonly InputKeyCode: InputKeyCode;
	readonly UserInputType: Enum.UserInputType;
	readonly Position: Vector3;
	readonly Delta: Vector3;
	readonly PressStrength: number;
	readonly Actions: readonly string[];
	readonly Changed: boolean;

	constructor(input_event_action: InputEventData) {
		//fetching data from the input event action
		this.InputKeyCode = input_event_action.InputKeyCode;
		this.Position = input_event_action.Position;
		this.Delta = input_event_action.Delta;
		this.PressStrength = input_event_action.PressStrength;
		this.UserInputType = input_event_action.UserInputType;
		this.Changed = input_event_action.Changed;

		const action = input_event_action.Action;
		if (action !== ActionResources.NONE_ACTION) {
			this.Actions = [action];
		} else this.Actions = table.clone(ActionsController.GetActionsFromKeyCode(this.InputKeyCode));

		table.freeze(this.Actions);
		return table.freeze(this);
	}

	AsText(): string {
		return GetInputKeyCodeName(this.InputKeyCode);
	}

	IsAction(action_name: string): boolean {
		return this.Actions.includes(action_name);
	}

	IsActionPressed(action_name: string): boolean {
		if (!this.Actions.includes(action_name)) return false;
		return ActionsController.IsPressedThisFrame(action_name);
	}

	IsActionJustPressed(action_name: string): boolean {
		if (!this.Actions.includes(action_name)) return false;
		return ActionsController.IsJustPressedThisFrame(action_name);
	}

	IsActionReleased(action_name: string): boolean {
		if (!this.Actions.includes(action_name)) return false;
		return ActionsController.IsReleasedThisFrame(action_name);
	}

	IsActionJustReleased(action_name: string): boolean {
		if (!this.Actions.includes(action_name)) return false;
		return ActionsController.IsJustReleasedThisFrame(action_name);
	}

	ContainsActions(): boolean {
		return this.Actions.isEmpty();
	}

	IsPressed(activation_strength: number = ActionResources.DEFAULT_MIN_PRESS_STRENGTH): boolean {
		return this.PressStrength >= activation_strength;
	}

	IsReleased(activation_strength: number = ActionResources.DEFAULT_MIN_PRESS_STRENGTH) {
		return this.PressStrength < activation_strength;
	}

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
	}
}
