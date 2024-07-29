import { ContextActionService, HttpService } from "@rbxts/services";

/**all inputable keycodes */
const keycodes = [
	...Enum.KeyCode.GetEnumItems(),
	...Enum.UserInputType.GetEnumItems(),
	...Enum.PlayerActions.GetEnumItems(),
];

function SinkKey() {
	return Enum.ContextActionResult.Sink;
}

export default class InputCatcher {
	/**priority at which context action service is binded */
	private priority_: number;
	/**unique id of the bind */
	private uuid_ = HttpService.GenerateGUID();

	constructor(priority: number) {
		this.priority_ = priority;
	}

	/**binds the action that sinks all the keys */
	GrabInput() {
		ContextActionService.BindActionAtPriority(
			this.uuid_,
			SinkKey,
			false,
			this.priority_,
			...keycodes,
		);
	}

	/**unbinds action that sinks all the keys */
	ReleaseInput() {
		ContextActionService.UnbindAction(this.uuid_);
	}
}
