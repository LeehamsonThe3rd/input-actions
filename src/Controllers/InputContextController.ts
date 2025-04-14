import { ActionsController } from "./ActionsController";
import IInputMap, { InputDeviceType } from "../Models/IInputMap";
import { InputKeyCode } from "../Models/InputKeyCode";
import { TableTools } from "@rbxts/tool_pack";
import { InputTypeController } from "./InputTypeController";
import { EInputType } from "../Models/EInputType";
import { GetVisualInputKeyCodeData, IVisualInputKeyCodeData } from "../Utils/InputVisualization";

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
	public UpdateKey(actionName: string, inputType: InputDeviceType, keyCode: InputKeyCode): this {
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

	/**
	 * Get the appropriate key code for an action based on current input type
	 * @param actionName The action to get the key for
	 * @returns The key code for the current input type, or undefined if not mapped
	 */
	public GetInputKeyForCurrentDevice(actionName: string): InputKeyCode | undefined {
		const map = this.GetMap(actionName);
		if (map === undefined) return undefined;

		const currentInputType = InputTypeController.GetMainInputType();
		if (currentInputType === EInputType.Gamepad) return map.Gamepad;
		if (currentInputType === EInputType.KeyboardAndMouse) return map.KeyboardAndMouse;
		return undefined;
	}

	/**
	 * Get visual representation data for an action
	 * @param actionName The action to get visual data for
	 * @param useCustomImages Whether to use our custom images
	 * @returns Visual data for displaying the input
	 */
	public GetVisualData(
		actionName: string,
		useCustomImages: boolean = true,
	): IVisualInputKeyCodeData {
		return GetVisualInputKeyCodeData(this.GetInputKeyForCurrentDevice(actionName), useCustomImages);
	}

	/**
	 * Checks if this context has a mapping for the specified action
	 */
	public HasAction(actionName: string): boolean {
		return this.maps.has(actionName);
	}

	/**
	 * Toggle the assignment state of this context
	 * @returns The new assigned state
	 */
	public ToggleAssignment(): boolean {
		if (this.assigned) {
			this.Unassign();
		} else {
			this.Assign();
		}
		return this.assigned;
	}

	/**
	 * Check if any action assigned to this context is currently pressed
	 * @param deviceType Optional device type to check, or current device if not specified
	 */
	public IsAnyActionPressed(deviceType?: InputDeviceType): boolean {
		for (const [actionName] of this.maps) {
			if (ActionsController.IsPressed(actionName)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Get current key for a specific device type
	 * @param actionName The action to get the key for
	 * @param deviceType The device type (KeyboardAndMouse or Gamepad)
	 */
	public GetDeviceKey(actionName: string, deviceType: InputDeviceType): InputKeyCode | undefined {
		const map = this.GetMap(actionName);
		if (!map) return undefined;
		return map[deviceType];
	}

	/**
	 * Remove a specific mapping from this context
	 */
	public Remove(actionName: string): this {
		if (this.assigned && this.maps.has(actionName)) {
			this.UnassignSingleMap(actionName);
		}

		this.maps.delete(actionName);
		return this;
	}

	/**
	 * Assign all mappings in this context
	 */
	public Assign(): this {
		if (this.assigned) return this;

		for (const [actionName, map] of this.maps) {
			this.AssignSingleMap(actionName, map);
		}

		this.assigned = true;
		return this;
	}

	/**
	 * Unassign all mappings in this context
	 */
	public Unassign(): this {
		if (!this.assigned) return this;

		for (const [actionName] of this.maps) {
			this.UnassignSingleMap(actionName);
		}

		this.assigned = false;
		return this;
	}

	/**
	 * Check if this context is currently assigned
	 */
	public IsAssigned(): boolean {
		return this.assigned;
	}

	/**
	 * Get all maps in this context
	 */
	public GetMaps(): ReadonlyMap<string, IInputMap> {
		return this.maps;
	}

	/**
	 * Get the input map for a specific action
	 */
	public GetMap(actionName: string): IInputMap | undefined {
		return this.maps.get(actionName);
	}

	/**
	 * Get the name of this context
	 */
	public GetName(): string | undefined {
		return this.name;
	}

	/**
	 * Get a list of all action names mapped in this context
	 */
	public GetAllMappedActions(): string[] {
		return TableTools.GetKeys(this.maps);
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
}

/**
 * Manages multiple input contexts and provides a global context
 */
export namespace InputContextController {
	const contexts = new Map<string, InputContext>();
	const globalContext = new InputContext("Global");

	/**
	 * Create a new named input context
	 */
	export function CreateContext(name: string): InputContext {
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
	export function GetContext(name: string): InputContext | undefined {
		return contexts.get(name);
	}

	/**
	 * Get the global input context
	 */
	export function GetGlobalContext(): InputContext {
		return globalContext;
	}

	/**
	 * Get all registered contexts
	 */
	export function GetAllContexts(): ReadonlyMap<string, InputContext> {
		return contexts;
	}

	/**
	 * Assign a context by name
	 */
	export function AssignContext(name: string): boolean {
		const context = contexts.get(name);
		if (!context) {
			warn(`Context '${name}' does not exist.`);
			return false;
		}

		context.Assign();
		return true;
	}

	/**
	 * Unassign a context by name
	 */
	export function UnassignContext(name: string): boolean {
		const context = contexts.get(name);
		if (!context) {
			warn(`Context '${name}' does not exist.`);
			return false;
		}

		context.Unassign();
		return true;
	}

	/**
	 * Initialize the input context controller
	 */
	export function Initialize() {
		// Nothing to initialize currently
	}
}
