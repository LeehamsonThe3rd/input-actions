//!native
import { ContextActionService, RunService } from "@rbxts/services";
import { Vector3Tools } from "@rbxts/tool_pack";
import { Actions } from "../actions";
import InputEvent from "./input_event";
import InputEventAction from "./input_event_action";
import InputBroadCaster from "./input_broad_caster/input_broad_caster";
import { ECustomKey } from "../input_key_code";

export namespace InputManager {
	const input_broad_caster = new InputBroadCaster<(input_event: InputEvent) => Enum.ContextActionResult | void>();
	export function Subscribe(...args: Parameters<typeof input_broad_caster.Subscribe>) {
		return input_broad_caster.Subscribe(...args);
	}

	/**all inputable keycodes */
	const keycodes = [
		...Enum.KeyCode.GetEnumItems(),
		...Enum.UserInputType.GetEnumItems(),
		...Enum.PlayerActions.GetEnumItems(),
	];

	function GetKeyCode(input: InputObject) {
		//will return user input type if keycode is unknown
		return input.KeyCode === Enum.KeyCode.Unknown ? input.UserInputType : input.KeyCode;
	}

	/**press or release the input from the input event */
	function ActionsFromInputEventSetPressed(input_event: InputEvent, pressed: boolean) {
		const actions_refferences = input_event.GetActions();
		if (actions_refferences === undefined) return;
		//pressed or releases all actions
		for (const action_name of actions_refferences) {
			if (pressed) {
				//presses the action if pressed
				Actions.ActionPress(action_name);
				continue;
			}
			//releases action if not pressed
			Actions.ActionRelease(action_name);
		}
	}

	export function ParseInputEvent(input_event_action: InputEventAction, canceled: boolean = false) {
		//sets if input state is canceled
		const input_event = new InputEvent(input_event_action, canceled);

		//presses all actions from the input event
		ActionsFromInputEventSetPressed(input_event, input_event_action.IsPressed());

		const callbacks = input_broad_caster.GetCallbacks();
		for (const [callback, _] of callbacks) {
			const [success, result] = pcall(callback, input_event);
			if (!success) {
				warn(result);
				continue;
			}
			//if the result is not sink, continue passing the event
			if (result !== Enum.ContextActionResult.Sink) continue;
			//stop the execution of function and sink the key
			return Enum.ContextActionResult.Sink;
		}

		//returns pass
		return Enum.ContextActionResult.Pass;
	}

	const is_custom_pressed: Map<ECustomKey, boolean> = new Map([
		[ECustomKey.thumbstick1_down, false],
		[ECustomKey.thumbstick1_up, false],
		[ECustomKey.thumbstick1_right, false],
		[ECustomKey.thumbstick1_left, false],

		[ECustomKey.thumbstick2_down, false],
		[ECustomKey.thumbstick2_up, false],
		[ECustomKey.thumbstick2_right, false],
		[ECustomKey.thumbstick2_left, false],
	]);

	const dead_zone = 0.2;

	function CompareCustomAndSendInputEvent(
		current: boolean,
		custom_key: ECustomKey,
		position: Vector3,
		delta: Vector3,
		isolator: Vector3,
		clamp_min: number,
		clamp_max: number,
	) {
		const previos = is_custom_pressed.get(custom_key)!;

		if (current === previos) return;
		//rewrites the value;
		is_custom_pressed.set(custom_key, current);

		const isolated_position = Vector3Tools.Clamp(position.mul(isolator), clamp_min, clamp_max);
		const isolated_delta = Vector3Tools.Clamp(delta.mul(isolator), clamp_min, clamp_max);

		const input_event_action = new InputEventAction(custom_key);
		input_event_action.SetDelta(isolated_delta);
		input_event_action.SetPosition(isolated_position);
		input_event_action.SetPressed(current);

		//is_canceled will always return false because it's not fully supported
		//TODO detect cancel and add press strength;
		ParseInputEvent(input_event_action);
	}

	//will check if the input is custom
	function CheckAndParseInputIfCustom(state: Enum.UserInputState, input: InputObject) {
		const is_custom_input =
			input.KeyCode === Enum.KeyCode.Thumbstick1 || input.KeyCode === Enum.KeyCode.Thumbstick2;
		if (!is_custom_input) return;

		const position = input.Position;
		const delta = input.Delta;

		const is_right_pressed = position.X >= dead_zone;
		const is_left_pressed = position.X <= -dead_zone;

		const is_up_pressed = position.Y >= dead_zone;
		const is_down_pressed = position.Y <= -dead_zone;

		let index_right: ECustomKey;
		let index_left: ECustomKey;
		let index_up: ECustomKey;
		let index_down: ECustomKey;
		if (Enum.KeyCode.Thumbstick1) {
			index_right = ECustomKey.thumbstick1_right;
			index_left = ECustomKey.thumbstick1_left;
			index_up = ECustomKey.thumbstick1_up;
			index_down = ECustomKey.thumbstick1_down;
		} else {
			index_right = ECustomKey.thumbstick2_right;
			index_left = ECustomKey.thumbstick2_left;
			index_up = ECustomKey.thumbstick2_up;
			index_down = ECustomKey.thumbstick2_down;
		}

		CompareCustomAndSendInputEvent(is_right_pressed, index_right, position, delta, Vector3.xAxis, 0, 1);
		CompareCustomAndSendInputEvent(is_left_pressed, index_left, position, delta, Vector3.xAxis, -1, 0);

		CompareCustomAndSendInputEvent(is_up_pressed, index_up, position, delta, Vector3.yAxis, 0, 1);
		CompareCustomAndSendInputEvent(is_down_pressed, index_down, position, delta, Vector3.yAxis, -1, 0);
	}

	function OnInput(action_name: string, state: Enum.UserInputState, input: InputObject) {
		const pressed = state === Enum.UserInputState.Begin;
		const key_code = GetKeyCode(input);
		const input_event_action = new InputEventAction(key_code);
		input_event_action.SetPosition(input.Position);
		input_event_action.SetDelta(input.Delta);
		//sets pressed if input began
		input_event_action.SetPressed(pressed);

		//checks for the custom input like thumbstick1_right;
		CheckAndParseInputIfCustom(state, input);
		return ParseInputEvent(input_event_action, state === Enum.UserInputState.Cancel);
	}

	function Update() {
		input_broad_caster.CheckNewAndUnsubscribed();
	}

	//TODO add the scrolling wheel
	let initialized = false;
	export function Initialize() {
		if (initialized) return;
		initialized = true;
		//reads keycodes. If will find the one that is used in actions, will set current action status false - released, true - down
		ContextActionService.BindActionAtPriority("ActionsReader", OnInput, false, 99999, ...keycodes);
		RunService.PostSimulation.Connect(Update);
	}
}
