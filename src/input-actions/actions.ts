//!native
import { RunService } from "@rbxts/services";
import { ActionsController, IAction } from "./actions_controller";

const actions = ActionsController.actions;
const reverse_actions = ActionsController.reverse_actions;
export namespace Actions {
	function SetActionsActive(actions: IAction[], active: boolean) {
		for (const action of actions) {
			//sets the current frame to true
			action.buffer[0] = active;
		}
	}

	export function ActionPress(action: string) {
		ActionsController.ExecuteWithActionTable(action, (action_table) => {
			//sets the current status to down
			action_table.buffer[0] = true;
		});
	}

	export function ActionRelease(action: string) {
		ActionsController.ExecuteWithActionTable(action, (action_table) => {
			//sets the current status to release
			action_table.buffer[0] = false;
		});
	}

	export function IsActionPressed(action: string) {
		//converts to boolean
		return !!actions.get(action)?.buffer[1];
	}

	export function IsActionReleased(action: string) {
		return !actions.get(action)?.buffer[1];
	}

	export function IsActionJustPressed(action: string) {
		const action_table = ActionsController.GetActionTable(action);
		if (action_table === undefined) return false;

		//was pressed in the previous frame, but was released in the pre-previos
		return action_table.buffer[1] && !action_table.buffer[2];
	}

	export function IsActionJustReleased(action: string) {
		const action_table = ActionsController.GetActionTable(action);
		if (action_table === undefined) return false;
		//was released in the previous frame, but was pressed in the pre-previos
		return !action_table.buffer[1] && action_table.buffer[2];
	}

	/**updates the input */
	function Update() {
		for (const [_, action_table] of actions) {
			//0 - current input
			//1 - previous input
			//2 - pre-previous input
			//sets previous input to current
			//save previous
			action_table.buffer[2] = action_table.buffer[1];
			//clone current
			action_table.buffer[1] = action_table.buffer[0];
		}
	}

	let initialized = false;
	export function Initialize() {
		if (initialized) return;
		initialized = true;
		//starts the update
		//update at the start of the frame cause deferred events are resumed after post simulation
		RunService.BindToRenderStep(
			"_ActionsUpdate_",
			Enum.RenderPriority.First.Value - 1,
			Update,
		);
	}
}
