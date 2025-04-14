import { ActionsController } from "./ActionsController";
import IInputMap from "../Models/IInputMap";
import { InputKeyCode } from "../Models/InputKeyCode";
import { TableTools } from "@rbxts/tool_pack";

/**
 * A collection of input maps that can be assigned/unassigned as a group
 */
export class InputContext {
	private maps = new Map<string, IInputMap>();
	private assigned = false;

	constructor(private readonly name?: string) {}

	/**
	 * Add an input map to this context
	 */
	public Add(actionName: string, map: IInputMap): this {
		this.maps.set(actionName, map);

		if (this.assigned) {
			this.AssignSingleMap(actionName, map);
		}

		return this;
	}

	/**
	 * Update an existing mapping for an action
	 * @param actionName The action to update
	 * @param inputType The input type (KeyboardAndMouse or Gamepad)
	 * @param keyCode The new key code to bind
	 */
	public UpdateKey(
		actionName: string,
		inputType: "KeyboardAndMouse" | "Gamepad",
		keyCode: InputKeyCode,
	): this {
		const map = this.maps.get(actionName);
		if (!map) {
			warn(`Cannot update key for non-existent map: ${actionName}`);
			return this;
		}

		// If the action is currently assigned, remove the old key
		if (this.assigned) {
			const oldKey = map[inputType];
			if (oldKey !== undefined) {
				ActionsController.EraseKeyCode(actionName, oldKey);
			}
		}

		// Create a new map with the updated key
		const newMap = {
			...map,
			[inputType]: keyCode,
		};

		this.maps.set(actionName, newMap);

		// If assigned, bind the new key
		if (this.assigned && keyCode !== undefined) {
			ActionsController.AddKeyCode(actionName, keyCode);
		}

		return this;
	}

	public Remove(actionName: string): this {
		if (this.assigned && this.maps.has(actionName)) {
			this.UnassignSingleMap(actionName);
		}

		this.maps.delete(actionName);
		return this;
	}

	public Assign(): this {
		if (this.assigned) return this;

		for (const [actionName, map] of this.maps) {
			this.AssignSingleMap(actionName, map);
		}

		this.assigned = true;
		return this;
	}

	public Unassign(): this {
		if (!this.assigned) return this;

		for (const [actionName] of this.maps) {
			this.UnassignSingleMap(actionName);
		}

		this.assigned = false;
		return this;
	}

	public IsAssigned(): boolean {
		return this.assigned;
	}

	public GetMaps(): ReadonlyMap<string, IInputMap> {
		return this.maps;
	}

	public GetMap(actionName: string): IInputMap | undefined {
		return this.maps.get(actionName);
	}

	public GetName(): string | undefined {
		return this.name;
	}

	private AssignSingleMap(actionName: string, map: IInputMap): void {
		if (!ActionsController.IsExisting(actionName)) {
			ActionsController.Add(actionName);
		}

		if (map.KeyboardAndMouse !== undefined) {
			ActionsController.AddKeyCode(actionName, map.KeyboardAndMouse);
		}

		if (map.Gamepad !== undefined) {
			ActionsController.AddKeyCode(actionName, map.Gamepad);
		}
	}

	private UnassignSingleMap(actionName: string): void {
		const map = this.maps.get(actionName);
		if (!map) return;

		if (map.KeyboardAndMouse !== undefined) {
			ActionsController.EraseKeyCode(actionName, map.KeyboardAndMouse);
		}

		if (map.Gamepad !== undefined) {
			ActionsController.EraseKeyCode(actionName, map.Gamepad);
		}
	}

	public GetAllMappedActions(): string[] {
		return TableTools.GetKeys(this.maps);
	}
}

/**
 * Manages multiple input contexts and provides a global context
 */
export namespace InputContextController {
	const contexts = new Map<string, InputContext>();
	const globalContext = new InputContext("Global");

	export function CreateContext(name: string): InputContext {
		if (contexts.has(name)) {
			warn(`Context '${name}' already exists, returning existing one.`);
			return contexts.get(name)!;
		}

		const context = new InputContext(name);
		contexts.set(name, context);
		return context;
	}

	export function GetContext(name: string): InputContext | undefined {
		return contexts.get(name);
	}

	export function GetGlobalContext(): InputContext {
		return globalContext;
	}

	export function GetAllContexts(): ReadonlyMap<string, InputContext> {
		return contexts;
	}

	export function AssignContext(name: string): boolean {
		const context = contexts.get(name);
		if (!context) {
			warn(`Context '${name}' does not exist.`);
			return false;
		}

		context.Assign();
		return true;
	}

	export function UnassignContext(name: string): boolean {
		const context = contexts.get(name);
		if (!context) {
			warn(`Context '${name}' does not exist.`);
			return false;
		}

		context.Unassign();
		return true;
	}

	export function Initialize() {}
}
