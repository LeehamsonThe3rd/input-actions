import { RunService, UserInputService } from "@rbxts/services";
import { ArrayTools } from "@rbxts/tool_pack";
import { EDefaultInputAction } from "../Models/EDefaultInputAction";
import { EMouseLockAction } from "../Models/EMouseLockAction";
import { EMouseLockActionPriority } from "../Models/EMouseLockActionPriority";
import { ActionsController } from "./ActionsController";

export namespace MouseController {
	//the stacks should be sorted by priority all the time
	const locked_center_priorities_stack: number[] = [];
	const unlocked_stack: number[] = [];
	const locked_at_position_stack: number[] = [];

	const default_mouse_lock_action_priorities = {
		[EMouseLockAction.UnlockMouse]: EMouseLockActionPriority.UnlockMouse,
		[EMouseLockAction.LockMouseCenter]: EMouseLockActionPriority.LockMouseCenter,
		[EMouseLockAction.LockMouseAtPosition]: EMouseLockActionPriority.LockMouseAtPosition,
	};
	const mouse_lock_action_stacks = {
		[EMouseLockAction.UnlockMouse]: unlocked_stack,
		[EMouseLockAction.LockMouseCenter]: locked_center_priorities_stack,
		[EMouseLockAction.LockMouseAtPosition]: locked_at_position_stack,
	};

	export class MouseLockAction {
		private active_ = false;

		constructor(
			private readonly action_: EMouseLockAction,
			private readonly priority_: number = default_mouse_lock_action_priorities[this.action_],
		) {}

		SetActive(active: boolean) {
			if (this.active_ === active) return;
			this.active_ = active;
			const stack = mouse_lock_action_stacks[this.action_];
			if (active) {
				ArrayTools.SortedInsert(stack, this.priority_, (current_value, b) => {
					return current_value >= b;
				});
				return;
			}

			ArrayTools.RemoveElementFromArray(stack, this.priority_);
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

	export function SetMouseLockActionStrictMode(action: EMouseLockAction, value: boolean) {
		strict_mode[action] = value;
	}

	function GetCurrentMouseLockAction() {
		if (ActionsController.IsPressed(EDefaultInputAction.MouseDebugMode))
			return EMouseLockAction.UnlockMouse;

		//sets unlock mouse on top
		const unlock_mouse_max_priority = unlocked_stack[0] ?? 0;
		const locked_center_max_priority = locked_center_priorities_stack[0] ?? -1;
		const locked_at_position_max_priority = locked_at_position_stack[0] ?? -1;

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
		} else if (action === EMouseLockAction.LockMouseCenter) {
			UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;
			UserInputService.MouseIconEnabled = false;
		} else if (action === EMouseLockAction.LockMouseAtPosition) {
			UserInputService.MouseBehavior = Enum.MouseBehavior.LockCurrentPosition;
			UserInputService.MouseIconEnabled = true;
		}
	}

	let current_action: EMouseLockAction;
	function SetMouseLockAction(mouse_lock_action: EMouseLockAction) {
		const is_strict_mode = strict_mode[mouse_lock_action];
		//dont apply changes if strict mode is not enabled
		if (!is_strict_mode && current_action === mouse_lock_action) return;
		current_action = mouse_lock_action;
		ApplyAction(mouse_lock_action);
	}

	let enabled = true;
	function Update() {
		if (!enabled) return;
		SetMouseLockAction(GetCurrentMouseLockAction());
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
