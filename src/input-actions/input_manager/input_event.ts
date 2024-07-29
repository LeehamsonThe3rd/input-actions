//!native
import { UserInputService } from "@rbxts/services";
import { ActionsController } from "../actions_controller";
import { InputKeyCode } from "../input_key_code";
import InputEventAction from "./input_event_action";

const actions = ActionsController.actions;
const reverse_actions = ActionsController.reverse_actions;
export default class InputEvent {
	readonly keycode: InputKeyCode;
	private position_: Vector3;
	private delta_: Vector3;
	private pressed_: boolean;
	private canceled_: boolean;
	private actions_: readonly string[];

	constructor(input_event_action: InputEventAction, canceled: boolean = false) {
		//fetching data from the input event action
		this.keycode = input_event_action.keycode;
		this.position_ = input_event_action.GetPosition();
		this.delta_ = input_event_action.GetDelta();
		this.pressed_ = input_event_action.IsPressed();
		this.canceled_ = canceled;

		//sets actions
		const action = input_event_action.GetAction();
		//if doest exist, take the default ones
		if (action === "") {
			const actions = reverse_actions.get(this.keycode);
			this.actions_ = actions ?? [];
			return;
		}
		this.actions_ = [action];
	}

	AsText() {
		//checks if the keycode is string and retuns the itself if true
		return typeIs(this.keycode, "string") ? this.keycode : this.keycode.Name;
	}

	IsAction(action: string) {
		return this.actions_.includes(action);
	}

	IsActionPressed(action: string) {
		//dont check if it doesnt contain the action
		if (!this.actions_.includes(action)) return;
		//checks the first, because keys change the buffer immediately
		return actions.get(action)?.buffer[0];
	}

	IsActionReleased(action: string) {
		//dont check if it doesnt contain the action
		if (!this.actions_.includes(action)) return;
		//checks the first, because keys change the buffer immediately
		return !actions.get(action)?.buffer[0];
	}

	IsActionType() {
		//checks if there are actions that this input is bound to
		return this.actions_.size() !== 0;
	}

	IsCanceled() {
		return this.canceled_;
	}

	IsPressed() {
		return this.pressed_;
	}

	IsReleased() {
		return !this.pressed_;
	}

	GetPosition() {
		return this.position_;
	}

	GetDelta() {
		return this.delta_;
	}

	IsModifierPressed(modifier: Enum.ModifierKey) {
		//checks the combinations
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

	GetActions() {
		return this.actions_;
	}
}
