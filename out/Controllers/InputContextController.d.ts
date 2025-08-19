import { EInputDeviceType, IInputMap, InputKeyCode } from "../Models";
import { InputKeyCodeHelper } from "../Utils/InputKeyCodeHelper";
/**
 * A collection of input maps that can be assigned/unassigned as a group
 */
export declare class InputContext {
    private readonly _name?;
    private _maps;
    private _assigned;
    constructor(_name?: string | undefined);
    /**
     * Add an input map to this context
     */
    Add(actionName: string, map: IInputMap): this;
    /**
     * Update an existing mapping for an action
     * @param actionName The action to update
     * @param inputType The input type (KeyboardAndMouse or Gamepad)
     * @param keyCode The new key code to bind
     */
    UpdateKeys(actionName: string, inputType: EInputDeviceType, keyCodes: InputKeyCode[]): this;
    /**
     * Get the appropriate key code for an action based on current input type
     * @param actionName The action to get the key for
     * @returns The key code for the current input type, or undefined if not mapped
     */
    GetInputKeysForCurrentDevice(actionName: string): InputKeyCode[] | undefined;
    /**
     * Get visual representation data for an action
     * @param actionName The action to get visual data for
     * @param useCustomImages Whether to use our custom images
     * @returns Visual data for displaying the input
     */
    GetVisualData(actionName: string, useCustomImages?: boolean): InputKeyCodeHelper.IVisualInputKeyCodeData[] | undefined;
    /**
     * Checks if this context has a mapping for the specified action
     */
    HasAction(actionName: string): boolean;
    /**
     * Toggle the assignment state of this context
     * @returns The new assigned state
     */
    ToggleAssignment(): boolean;
    /**
     * Check if any action assigned to this context is currently pressed
     * @param deviceType Optional device type to check, or current device if not specified
     */
    IsAnyActionPressed(deviceType?: EInputDeviceType): boolean;
    /**
     * Get the current keys for a specific device type
     * @param actionName The action to get the key for
     * @param deviceType The device type (KeyboardAndMouse or Gamepad)
     */
    GetDeviceKey(actionName: string, deviceType: EInputDeviceType): InputKeyCode[] | undefined;
    /**
     * Remove a specific mapping from this context
     */
    Remove(actionName: string): this;
    /**
     * Assign all mappings in this context
     */
    Assign(): this;
    /**
     * Unassign all mappings in this context
     */
    Unassign(): this;
    /**
     * Check if this context is currently assigned
     */
    IsAssigned(): boolean;
    /**
     * Get all maps in this context
     */
    GetMaps(): ReadonlyMap<string, IInputMap>;
    /**
     * Get the input map for a specific action
     */
    GetMap(actionName: string): IInputMap | undefined;
    /**
     * Get the name of this context
     */
    GetName(): string | undefined;
    /**
     * Get a list of all action names mapped in this context
     */
    GetAllMappedActions(): string[];
    private AssignSingleMap;
    private UnassignSingleMap;
}
/**
 * Manages multiple input contexts and provides a global context
 */
export declare namespace InputContextController {
    const GlobalContext: InputContext;
    const UiControlContext: InputContext;
    /**
     * Apply the default UI control mappings
     */
    function ApplyDefaultInputMaps(): void;
    /**
     * Create a new named input context
     */
    function CreateContext(name: string): InputContext;
    /**
     * Get an existing context by name
     */
    function GetContext(name: string): InputContext | undefined;
    /**
     * Get the global input context
     */
    function GetGlobalContext(): InputContext;
    /**
     * Get all registered contexts
     */
    function GetAllContexts(): ReadonlyMap<string, InputContext>;
    /**
     * Assign a context by name
     */
    function AssignContext(name: string): boolean;
    /**
     * Unassign a context by name
     */
    function UnassignContext(name: string): boolean;
    /**
     * Initialize the input context controller
     */
    function Initialize(): void;
}
