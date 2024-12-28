import { InputKeyCode } from "../../Models/InputKeyCode";
import { ActionResources } from "../../Resources/ActionResources";

export default class InputEventData {
	static FromInputKeyCode(input_key_code: InputKeyCode, user_input_type?: Enum.UserInputType) {
		return new this(input_key_code, undefined, user_input_type);
	}
	static FromAction(action_name: string) {
		return new this(undefined, action_name);
	}

	readonly InputKeyCode: InputKeyCode = Enum.UserInputType.None;
	readonly UserInputType: Enum.UserInputType = Enum.UserInputType.None;
	readonly Action: string = ActionResources.NONE_ACTION;

	/**if the event is Enum.UserInputState.Changed */
	Changed: boolean = false;

	PressStrength: number = 0;
	Position: Vector3 = Vector3.zero;
	Delta: Vector3 = Vector3.zero;

	private constructor(
		keycode?: InputKeyCode,
		action?: string,
		user_input_type?: Enum.UserInputType,
	) {
		this.InputKeyCode = keycode ?? this.InputKeyCode;
		this.Action = action ?? this.Action;
		this.UserInputType = user_input_type ?? this.UserInputType;
	}
}
