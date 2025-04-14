import { ContextActionService, HttpService } from "@rbxts/services";
import { ActionResources } from "../Resources/ActionResources";

function SinkKey() {
	return Enum.ContextActionResult.Sink;
}

export default class InputCatcher {
	private _priority: number;
	private _uuid = HttpService.GenerateGUID();
	private _isActive = false;

	/**
	 * Creates a new InputCatcher for blocking all input
	 * @param priority Priority level for the input catch (higher catches earlier)
	 */
	constructor(priority: number) {
		this._priority = priority;
	}

	/**
	 * Start capturing and blocking all user input
	 */
	GrabInput() {
		ContextActionService.BindActionAtPriority(
			this._uuid,
			SinkKey,
			false,
			this._priority,
			...ActionResources.ALL_KEYCODES,
		);
		this._isActive = true;
	}

	/**
	 * Stop capturing input and restore normal input handling
	 */
	ReleaseInput() {
		ContextActionService.UnbindAction(this._uuid);
		this._isActive = false;
	}

	/**
	 * Check if this InputCatcher is currently active
	 */
	IsActive(): boolean {
		return this._isActive;
	}
}
