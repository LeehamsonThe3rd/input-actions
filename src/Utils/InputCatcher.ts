import { ContextActionService, HttpService } from "@rbxts/services";
import { ActionResources } from "../Resources/ActionResources";

function SinkKey() {
	return Enum.ContextActionResult.Sink;
}

export default class InputCatcher {
	private priority: number;
	private uuid = HttpService.GenerateGUID();

	constructor(priority: number) {
		this.priority = priority;
	}

	GrabInput() {
		ContextActionService.BindActionAtPriority(
			this.uuid,
			SinkKey,
			false,
			this.priority,
			...ActionResources.ALL_KEYCODES,
		);
	}

	ReleaseInput() {
		ContextActionService.UnbindAction(this.uuid);
	}
}
