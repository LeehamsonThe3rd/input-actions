import { InputKeyCode } from "../Models/InputKeyCode";
/**
 * Controller for managing input actions
 *
 * The ActionsController handles the registration, triggering, and state tracking
 * of named actions that can be bound to input keys.
 */
export declare namespace ActionsController {
    /**
     * Initialize the actions controller
     * Must be called before using any other functionality
     */
    function Initialize(): void;
    /**
     * Sets an action as pressed with the given strength
     */
    function Press(actionName: string, strength?: number): void;
    /**
     * Gets the current press strength of an action
     * @returns Press strength between 0 and 1, or 0 if action doesn't exist
     */
    function GetPressStrength(actionName: string): number;
    function Release(actionName: string): void;
    function IsPressed(actionName: string): boolean;
    /**NOT RECOMMENDED TO USE (InternalOnly) Low level of checking if the action is pressed in this frame */
    function IsPressedThisFrame(actionName: string): boolean;
    /**NOT RECOMMENDED TO USE (InternalOnly) Low level of checking if the action is just pressed in this frame */
    function IsJustPressedThisFrame(actionName: string): boolean;
    function IsReleased(actionName: string): boolean;
    /**Low level of checking if the action is released in this frame */
    function IsReleasedThisFrame(actionName: string): boolean;
    /**Low level of checking if the action is just released in this frame */
    function IsJustReleasedThisFrame(actionName: string): boolean;
    function IsJustPressed(actionName: string): boolean;
    function IsJustReleased(actionName: string): boolean;
    function Add(actionName: string, activationStrength?: number, keyCodes?: readonly InputKeyCode[]): void;
    function AddKeyCode(actionName: string, keyCode: InputKeyCode): void;
    function EraseKeyCode(actionName: string, keyCode: InputKeyCode): void;
    function EraseAllKeyCodes(actionName: string): void;
    function GetKeyCodes(actionName: string): readonly InputKeyCode[];
    function HasKeyCode(actionName: string, keyCode: InputKeyCode): boolean | undefined;
    function IsExisting(actionName: string): boolean;
    function GetActionsFromKeyCode(keyCode: InputKeyCode): readonly string[];
    function SetActivationStrength(actionName: string, activationStrength: number): void;
    function Erase(actionName: string): void;
    function GetActions(): string[];
}
