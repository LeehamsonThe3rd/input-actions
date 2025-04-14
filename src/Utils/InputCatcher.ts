import { ContextActionService, HttpService } from "@rbxts/services";
import { ActionResources } from "../Resources/ActionResources";

function SinkKey() {
	return Enum.ContextActionResult.Sink;
}

export default class InputCatcher {
	private _priority: number;
	private _uuid = HttpService.GenerateGUID();

	constructor(priority: number) {
		this._priority = priority;
	}

	GrabInput() {
		ContextActionService.BindActionAtPriority(
			this._uuid,
			SinkKey,
			false,
			this._priority,
			...ActionResources.ALL_KEYCODES,
		);
	}

	ReleaseInput() {
		ContextActionService.UnbindAction(this._uuid);
	}
}
