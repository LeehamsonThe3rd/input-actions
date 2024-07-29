//!native
import { ArrayTools } from "@rbxts/tool_pack";
import { ActionsController } from "./actions_controller";
import { InputKeyCode } from "./input_key_code";

const actions = ActionsController.actions;
const reverse_actions = ActionsController.reverse_actions;
export namespace InputMap {
	export function ActionAddKeyCode(
		action_name: string,
		key_code: InputKeyCode,
	) {
		ActionsController.ExecuteWithActionTable(action_name, (action_table) => {
			if (action_table.keycodes.includes(key_code)) {
				warn("Keycode already exist in action");
				return;
			}
			//adds the keycode;
			action_table.keycodes.push(key_code);
			let actions_refferences = reverse_actions.get(key_code);
			if (actions_refferences === undefined) {
				actions_refferences = [];
				reverse_actions.set(key_code, actions_refferences);
			}
			//sets the action refference to the keycode
			actions_refferences.push(action_name);
		});
	}

	export function ActionEraseKeyCode(
		action_name: string,
		key_code: InputKeyCode,
	) {
		ActionsController.ExecuteWithActionTable(action_name, (action_table) => {
			if (!action_table.keycodes.includes(key_code)) return;
			//removes the keycode from the actions
			ArrayTools.RemoveElementFromArray(action_table.keycodes, key_code);
			const actions_refferences = reverse_actions.get(key_code)!;
			//deletes the action from the action refferences
			ArrayTools.RemoveElementFromArray(actions_refferences, action_name);
		});
	}

	export function ActionEraseKeyCodes(action_name: string) {
		ActionsController.ExecuteWithActionTable(action_name, (action_table) => {
			action_table.keycodes.forEach((key_code) => {
				const actions_refferences = reverse_actions.get(key_code)!;
				//removes the action from action refferences of the key
				ArrayTools.RemoveElementFromArray(actions_refferences, action_name);
			});
			//clears the action table;
			action_table.keycodes.clear();
		});
	}

	export function ActionGetKeyCodes(action_name: string): InputKeyCode[] {
		const action_table = ActionsController.GetActionTable(action_name);
		//returns the copy of the table or the empty table
		return action_table !== undefined ? table.clone(action_table.keycodes) : [];
	}

	export function ActionHasKeyCode(
		action_name: string,
		key_code: InputKeyCode,
	) {
		const action_table = ActionsController.GetActionTable(action_name);
		//returns whether the action table includes the key_code
		return action_table?.keycodes.includes(key_code) ?? false;
	}

	export function AddAction(action_name: string) {
		if (actions.has(action_name)) {
			warn(`Action ${action_name} already exist`);
			return;
		}
		//creates new table for the action
		actions.set(action_name, {
			buffer: [false, false, false],
			keycodes: [],
		});
	}

	export function EraseAction(action_name: string) {
		actions.delete(action_name);
	}

	export function KeyCodeIsAction(key_code: InputKeyCode, action: string) {
		const actions_refferences = reverse_actions.get(key_code);
		//returns whether it found an action
		return actions_refferences?.includes(action);
	}

	export function GetActions() {
		const actions_table = new Array<string>();
		//returns all actions_names
		actions.forEach((_, action_name) => actions_table.push(action_name));
		return actions_table;
	}

	export function HasAction(action_name: string) {
		return actions.has(action_name);
	}
}
