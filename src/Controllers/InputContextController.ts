import { TableTools } from "@rbxts/tool_pack";
import {
	ECustomKey,
	EDefaultInputAction,
	EInputDeviceType,
	EInputType,
	IInputMap,
	InputKeyCode,
} from "../Models";
import { DeviceTypeHandler } from "../Utils/DeviceTypeHandler";
import { InputKeyCodeHelper } from "../Utils/InputKeyCodeHelper";
import { ActionsController } from "./ActionsController";

/**
 * A collection of input maps that can be assigned/unassigned as a group
 */
export class InputContext {
	private _maps = new Map<string, IInputMap>();
	private _assigned = false;

	constructor(private readonly _name?: string) {}

	/**
	 * Add an input map to this context
	 */
	public Add(actionName: string, map: IInputMap): this {
		this._maps.set(actionName, map);

		if (this._assigned) {
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
	public UpdateKey(actionName: string, inputType: EInputDeviceType, keyCode: InputKeyCode): this {
		const map = this._maps.get(actionName);
		if (!map) {
			warn(`Cannot update key for non-existent map: ${actionName}`);
			return this;
		}

		// If the action is currently assigned, remove the old key
		if (this._assigned) {
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

		this._maps.set(actionName, newMap);

		// If assigned, bind the new key
		if (this._assigned && keyCode !== undefined) {
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

		const currentInputType = DeviceTypeHandler.GetMainInputType();
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
	): InputKeyCodeHelper.IVisualInputKeyCodeData {
		return InputKeyCodeHelper.GetVisualInputKeyCodeData(
			this.GetInputKeyForCurrentDevice(actionName),
			useCustomImages,
		);
	}

	/**
	 * Checks if this context has a mapping for the specified action
	 */
	public HasAction(actionName: string): boolean {
		return this._maps.has(actionName);
	}

	/**
	 * Toggle the assignment state of this context
	 * @returns The new assigned state
	 */
	public ToggleAssignment(): boolean {
		if (this._assigned) {
			this.Unassign();
		} else {
			this.Assign();
		}
		return this._assigned;
	}

	/**
	 * Check if any action assigned to this context is currently pressed
	 * @param deviceType Optional device type to check, or current device if not specified
	 */
	public IsAnyActionPressed(deviceType?: EInputDeviceType): boolean {
		for (const [actionName] of this._maps) {
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
	public GetDeviceKey(actionName: string, deviceType: EInputDeviceType): InputKeyCode | undefined {
		const map = this.GetMap(actionName);
		if (!map) return undefined;
		return map[deviceType];
	}

	/**
	 * Remove a specific mapping from this context
	 */
	public Remove(actionName: string): this {
		if (this._assigned && this._maps.has(actionName)) {
			this.UnassignSingleMap(actionName);
		}

		this._maps.delete(actionName);
		return this;
	}

	/**
	 * Assign all mappings in this context
	 */
	public Assign(): this {
		if (this._assigned) return this;

		for (const [actionName, map] of this._maps) {
			this.AssignSingleMap(actionName, map);
		}

		this._assigned = true;
		return this;
	}

	/**
	 * Unassign all mappings in this context
	 */
	public Unassign(): this {
		if (!this._assigned) return this;

		for (const [actionName] of this._maps) {
			this.UnassignSingleMap(actionName);
		}

		this._assigned = false;
		return this;
	}

	/**
	 * Check if this context is currently assigned
	 */
	public IsAssigned(): boolean {
		return this._assigned;
	}

	/**
	 * Get all maps in this context
	 */
	public GetMaps(): ReadonlyMap<string, IInputMap> {
		return this._maps;
	}

	/**
	 * Get the input map for a specific action
	 */
	public GetMap(actionName: string): IInputMap | undefined {
		return this._maps.get(actionName);
	}

	/**
	 * Get the name of this context
	 */
	public GetName(): string | undefined {
		return this._name;
	}

	/**
	 * Get a list of all action names mapped in this context
	 */
	public GetAllMappedActions(): string[] {
		return TableTools.GetKeys(this._maps);
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
		const map = this._maps.get(actionName);
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
	globalContext.Assign();

	// Combined UI context instead of separate contexts
	const uiControlContext = new InputContext("UIControls");

	// Setup navigation controls
	uiControlContext.Add(EDefaultInputAction.UiGoUp, {
		Gamepad: Enum.KeyCode.DPadUp,
		KeyboardAndMouse: Enum.KeyCode.Up,
	});

	uiControlContext.Add(EDefaultInputAction.UiGoDown, {
		Gamepad: Enum.KeyCode.DPadDown,
		KeyboardAndMouse: Enum.KeyCode.Down,
	});

	uiControlContext.Add(EDefaultInputAction.UiGoLeft, {
		Gamepad: Enum.KeyCode.DPadLeft,
		KeyboardAndMouse: Enum.KeyCode.Left,
	});

	uiControlContext.Add(EDefaultInputAction.UiGoRight, {
		Gamepad: Enum.KeyCode.DPadRight,
		KeyboardAndMouse: Enum.KeyCode.Right,
	});

	// Setup action controls
	uiControlContext.Add(EDefaultInputAction.UiAccept, {
		Gamepad: Enum.KeyCode.ButtonA,
		KeyboardAndMouse: Enum.KeyCode.Return,
	});

	uiControlContext.Add(EDefaultInputAction.UiCancel, {
		Gamepad: Enum.KeyCode.ButtonB,
		KeyboardAndMouse: Enum.KeyCode.B,
	});

	// Setup scrolling controls
	uiControlContext.Add(EDefaultInputAction.UiScrollUp, {
		Gamepad: ECustomKey.Thumbstick2Up,
		KeyboardAndMouse: Enum.KeyCode.W,
	});

	uiControlContext.Add(EDefaultInputAction.UiScrollDown, {
		Gamepad: ECustomKey.Thumbstick2Down,
		KeyboardAndMouse: Enum.KeyCode.S,
	});

	uiControlContext.Add(EDefaultInputAction.UiNextPage, {
		Gamepad: Enum.KeyCode.ButtonR1,
		KeyboardAndMouse: Enum.KeyCode.E,
	});

	uiControlContext.Add(EDefaultInputAction.UiPreviousPage, {
		Gamepad: Enum.KeyCode.ButtonL1,
		KeyboardAndMouse: Enum.KeyCode.Q,
	});

	// Setup debug controls
	uiControlContext.Add(EDefaultInputAction.MouseDebugMode, {
		KeyboardAndMouse: Enum.KeyCode.LeftAlt,
	});

	/**
	 * Apply the default UI control mappings
	 */
	export function ApplyDefaultInputMaps(): void {
		uiControlContext.Assign();
	}

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
