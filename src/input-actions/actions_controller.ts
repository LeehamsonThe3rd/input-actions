import { InputKeyCode } from "./input_key_code";

export interface IAction {
	keycodes: InputKeyCode[];
	buffer: [boolean, boolean, boolean];
}

export namespace ActionsController {
	/**actions store the keycodes*/
	export const actions: Map<string, IAction> = new Map();
	/**keycodes store actions, hash map of refferences*/
	export const reverse_actions: Map<InputKeyCode, string[]> = new Map();

	/**gets an action table, will warn if the event is not found */
	export function GetActionTable(action_name: string) {
		const action_table = actions.get(action_name);
		if (action_table === undefined) {
			warn(`Action ${action_name} doesn not exist`);
		}
		return action_table;
	}

	export function ExecuteWithActionTable(action_name: string, callback: (action_table: IAction) => void) {
		const action_table = GetActionTable(action_name);
		if (action_table === undefined) return;
		callback(action_table);
	}
}
