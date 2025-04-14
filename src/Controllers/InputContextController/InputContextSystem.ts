import { ActionsController } from "../ActionsController";
import { InputMapController } from "../InputMapController/InputMapController";
import IInputMap from "../../Models/IInputMap";
import { InputKeyCode } from "../../Models/InputKeyCode";
import { InputMapBuilder } from "../InputMapController/InputMapBuilder";

/**
 * A collection of input maps that can be assigned/unassigned as a group
 */
export class InputContext {
	private maps = new Map<string, IInputMap>();
	private assigned = false;

	/**
	 * Create a new input context
	 * @param name Optional name for this context
	 */
	constructor(private readonly name?: string) {}

	/**
	 * Add an input map to this context
	 */
	public add(actionName: string, map: IInputMap): this {
		this.maps.set(actionName, map);

		// If already assigned, also assign this new map
		if (this.assigned) {
			this.assignSingleMap(actionName, map);
		}

		return this;
	}

	/**
	 * Remove an input map from this context
	 */
	public remove(actionName: string): this {
		// If assigned, unassign this map first
		if (this.assigned && this.maps.has(actionName)) {
			this.unassignSingleMap(actionName);
		}

		this.maps.delete(actionName);
		return this;
	}

	/**
	 * Create and add an input map using the builder pattern
	 */
	public addMap(actionName: string): InputMapBuilder {
		const builder = InputMapBuilder.create();

		// Return a proxy to capture the build() call
		return new Proxy(builder, {
			get: (target, prop) => {
				if (prop === "build") {
					return () => {
						const map = target.build();
						this.add(actionName, map);
						return map;
					};
				}
				return Reflect.get(target, prop);
			},
		}) as InputMapBuilder;
	}

	/**
	 * Apply all maps in this context to the input system
	 */
	public assign(): this {
		if (this.assigned) return this;

		for (const [actionName, map] of this.maps) {
			this.assignSingleMap(actionName, map);
		}

		this.assigned = true;
		return this;
	}

	/**
	 * Remove all maps in this context from the input system
	 */
	public unassign(): this {
		if (!this.assigned) return this;

		for (const [actionName] of this.maps) {
			this.unassignSingleMap(actionName);
		}

		this.assigned = false;
		return this;
	}

	/**
	 * Check if this context is currently assigned
	 */
	public isAssigned(): boolean {
		return this.assigned;
	}

	/**
	 * Get all maps in this context
	 */
	public getMaps(): ReadonlyMap<string, IInputMap> {
		return this.maps;
	}

	/**
	 * Get a specific map from this context
	 */
	public getMap(actionName: string): IInputMap | undefined {
		return this.maps.get(actionName);
	}

	/**
	 * Get the name of this context
	 */
	public getName(): string | undefined {
		return this.name;
	}

	private assignSingleMap(actionName: string, map: IInputMap): void {
		// Create the action if it doesn't exist
		if (!ActionsController.IsExisting(actionName)) {
			ActionsController.Add(actionName);
		}

		// Add the keyboard/mouse key if defined
		if (map.KeyboardAndMouse !== undefined) {
			ActionsController.AddKeyCode(actionName, map.KeyboardAndMouse);
		}

		// Add the gamepad key if defined
		if (map.Gamepad !== undefined) {
			ActionsController.AddKeyCode(actionName, map.Gamepad);
		}
	}

	private unassignSingleMap(actionName: string): void {
		// Get the map to know which keys to remove
		const map = this.maps.get(actionName);
		if (!map) return;

		// Remove the keyboard/mouse key if defined
		if (map.KeyboardAndMouse !== undefined) {
			ActionsController.EraseKeyCode(actionName, map.KeyboardAndMouse);
		}

		// Remove the gamepad key if defined
		if (map.Gamepad !== undefined) {
			ActionsController.EraseKeyCode(actionName, map.Gamepad);
		}
	}
}

/**
 * Manages multiple input contexts and provides a global context
 */
export namespace InputContextSystem {
	const contexts = new Map<string, InputContext>();
	const globalContext = new InputContext("Global");

	/**
	 * Create a new named context
	 */
	export function createContext(name: string): InputContext {
		if (contexts.has(name)) {
			warn(`Context '${name}' already exists, returning existing one.`);
			return contexts.get(name)!;
		}

		const context = new InputContext(name);
		contexts.set(name, context);
		return context;
	}

	/**
	 * Get an existing context by name
	 */
	export function getContext(name: string): InputContext | undefined {
		return contexts.get(name);
	}

	/**
	 * Get the global context that's always available
	 */
	export function getGlobalContext(): InputContext {
		return globalContext;
	}

	/**
	 * Get all registered contexts
	 */
	export function getAllContexts(): ReadonlyMap<string, InputContext> {
		return contexts;
	}

	/**
	 * Assign a context by name
	 */
	export function assignContext(name: string): boolean {
		const context = contexts.get(name);
		if (!context) {
			warn(`Context '${name}' does not exist.`);
			return false;
		}

		context.assign();
		return true;
	}

	/**
	 * Unassign a context by name
	 */
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
