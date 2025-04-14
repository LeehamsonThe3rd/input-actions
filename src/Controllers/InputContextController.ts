import { ActionsController } from "./ActionsController";
import IInputMap from "../Models/IInputMap";
import { InputKeyCode } from "../Models/InputKeyCode";

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
	public add(actionName: string, map: IInputMap): this {
		this.maps.set(actionName, map);

		if (this.assigned) {
			this.assignSingleMap(actionName, map);
		}

		return this;
	}

	public remove(actionName: string): this {
		if (this.assigned && this.maps.has(actionName)) {
			this.unassignSingleMap(actionName);
		}

		this.maps.delete(actionName);
		return this;
	}

	public assign(): this {
		if (this.assigned) return this;

		for (const [actionName, map] of this.maps) {
			this.assignSingleMap(actionName, map);
		}

		this.assigned = true;
		return this;
	}

	public unassign(): this {
		if (!this.assigned) return this;

		for (const [actionName] of this.maps) {
			this.unassignSingleMap(actionName);
		}

		this.assigned = false;
		return this;
	}

	public isAssigned(): boolean {
		return this.assigned;
	}

	public getMaps(): ReadonlyMap<string, IInputMap> {
		return this.maps;
	}

	public getMap(actionName: string): IInputMap | undefined {
		return this.maps.get(actionName);
	}

	public getName(): string | undefined {
		return this.name;
	}

	private assignSingleMap(actionName: string, map: IInputMap): void {
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

	private unassignSingleMap(actionName: string): void {
		const map = this.maps.get(actionName);
		if (!map) return;

		if (map.KeyboardAndMouse !== undefined) {
			ActionsController.EraseKeyCode(actionName, map.KeyboardAndMouse);
		}

		if (map.Gamepad !== undefined) {
			ActionsController.EraseKeyCode(actionName, map.Gamepad);
		}
	}
}

/**
 * Manages multiple input contexts and provides a global context
 */
export namespace InputContextController {
	const contexts = new Map<string, InputContext>();
	const globalContext = new InputContext("Global");

	export function createContext(name: string): InputContext {
		if (contexts.has(name)) {
			warn(`Context '${name}' already exists, returning existing one.`);
			return contexts.get(name)!;
		}

		const context = new InputContext(name);
		contexts.set(name, context);
		return context;
	}

	export function getContext(name: string): InputContext | undefined {
		return contexts.get(name);
	}

	export function getGlobalContext(): InputContext {
		return globalContext;
	}

	export function getAllContexts(): ReadonlyMap<string, InputContext> {
		return contexts;
	}

	export function assignContext(name: string): boolean {
		const context = contexts.get(name);
		if (!context) {
			warn(`Context '${name}' does not exist.`);
			return false;
		}

		context.assign();
		return true;
	}

	export function unassignContext(name: string): boolean {
		const context = contexts.get(name);
		if (!context) {
			warn(`Context '${name}' does not exist.`);
			return false;
		}

		context.unassign();
		return true;
	}
}
