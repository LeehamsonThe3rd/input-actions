import { HttpService, RunService, UserInputService } from "@rbxts/services";
import { ArrayTools } from "@rbxts/tool_pack";
import { Actions } from "../../input-actions/actions";
import { EDefaultInputAction } from "../../input-actions/input_settings/default_input_actions";

export namespace MouseControl {
	interface IStackElement {
		Priority: number;
		UUID: string;
	}

	//the stacks should be sorted by priority all the time
	const locked_center_stack = new Array<IStackElement>();
	const unlocked_stack = new Array<IStackElement>();
	const locked_at_position_stack = new Array<IStackElement>();

	const priority_refference = {
		[EMouseLockAction.UnlockMouse]: EPriority.unlock_mouse,
		[EMouseLockAction.LockMouseCenter]: EPriority.lock_mouse_center,
		[EMouseLockAction.LockMouseAtPosition]: EPriority.lock_mouse_at_position,
	};
	const stack_refference = {
		[EMouseLockAction.UnlockMouse]: unlocked_stack,
		[EMouseLockAction.LockMouseCenter]: locked_center_stack,
		[EMouseLockAction.LockMouseAtPosition]: locked_at_position_stack,
	};

	function GetDefaultPriorityForAction(action: EMouseLockAction) {
		return priority_refference[action];
	}
	function GetStackForAction(action: EMouseLockAction) {
		return stack_refference[action];
	}

	export class MouseLockAction {
		private uuid_ = HttpService.GenerateGUID();
		private stack_element_: IStackElement;
		private active_ = false;
		//to push the element to the stack
		private action_: EMouseLockAction;
		constructor(action: EMouseLockAction, priority?: number) {
			this.action_ = action;
			//creates the stack element
			this.stack_element_ = {
				Priority: priority ?? GetDefaultPriorityForAction(action),
				UUID: this.uuid_,
			};
		}

		SetActive(value: boolean) {
			//dont insert if the same
			if (this.active_ === value) return;
			this.active_ = value;
			const stack = GetStackForAction(this.action_);
			if (value) {
				//inserts stack element at the start of the elements with the same or smaller priority
				//e.g   if has priority 14  [15, [insert here], 14, 14, 13 ...];
				ArrayTools.SortedInsert(stack, this.stack_element_, (a, b) => {
					return a.Priority >= b.Priority;
				});
				return;
			}
			//removes from stack;
			ArrayTools.RemoveElementFromArray(stack, this.stack_element_);
		}
	}

	/**during the strict mode the mouse e.g if mouse should be visible and unlocked, it will ensure that it will be unlocked all the time
	 * without it, mouse behaviour and visibility can be changed during the process and action like unlock the mouse will be applied only at change
	 */
	const strict_mode = {
		[EMouseLockAction.LockMouseAtPosition]: false,
		[EMouseLockAction.LockMouseCenter]: false,
		[EMouseLockAction.UnlockMouse]: false,
	};

	export function ActionStrictModeSet(
		action: EMouseLockAction,
		value: boolean,
	) {
		strict_mode[action] = value;
	}

	export const enum EMouseLockAction {
		LockMouseAtPosition,
		LockMouseCenter,
		UnlockMouse,
	}

	export const enum EPriority {
		lock_mouse_at_position = 100,
		lock_mouse_center = 200,
		unlock_mouse = 300,
	}

	function DetermineAction() {
		if (Actions.IsActionPressed(EDefaultInputAction.mouse_debug_mode))
			return EMouseLockAction.UnlockMouse;

		//sets unlock mouse on top
		const unlock_mouse_max_priority = unlocked_stack[0]?.Priority ?? 0;
		const locked_center_max_priority = locked_center_stack[0]?.Priority ?? -1;
		const locked_at_position_max_priority =
			locked_at_position_stack[0]?.Priority ?? -1;

		if (
			unlock_mouse_max_priority >= locked_at_position_max_priority &&
			unlock_mouse_max_priority >= locked_center_max_priority
		)
			return EMouseLockAction.UnlockMouse;
		if (locked_center_max_priority >= locked_at_position_max_priority)
			return EMouseLockAction.LockMouseCenter;
		return EMouseLockAction.LockMouseAtPosition;
	}

	function ApplyAction(action: EMouseLockAction) {
		if (action === EMouseLockAction.UnlockMouse) {
			UserInputService.MouseBehavior = Enum.MouseBehavior.Default;
			UserInputService.MouseIconEnabled = true;
			// print("SetUnlocked");
		} else if (action === EMouseLockAction.LockMouseCenter) {
			UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;
			UserInputService.MouseIconEnabled = false;
			// print("SetLockedCenter");
		} else if (action === EMouseLockAction.LockMouseAtPosition) {
			UserInputService.MouseBehavior = Enum.MouseBehavior.LockCurrentPosition;
			UserInputService.MouseIconEnabled = true;
			// print("SetLockedAtPosition");
		}
	}

	let current_action: EMouseLockAction;
	function SetAction(action: EMouseLockAction) {
		const is_strict_mode = strict_mode[action];
		//dont apply changes if strict mode is not enabled
		if (!is_strict_mode && current_action === action) return;
		current_action = action;
		ApplyAction(action);
	}

	let enabled = true;
	function Update() {
		if (!enabled) return;
		SetAction(DetermineAction());
	}

	export function SetEnabled(value: boolean) {
		enabled = value;
	}

	let initialized = false;
	export function Initialize() {
		if (initialized) return;
		initialized = true;
		RunService.RenderStepped.Connect(Update);
	}
}
