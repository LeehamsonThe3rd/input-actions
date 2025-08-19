import { InputKeyCode } from "../../Models/InputKeyCode";
import InputEventData from "./InputEventData";
/**
 * Represents an input event that can be handled by input processors
 * Similar to Godot's InputEvent class
 */
export default class InputEvent {
    /** The keycode that generated this event */
    readonly InputKeyCode: InputKeyCode;
    /** The type of input that generated this event */
    readonly UserInputType: Enum.UserInputType;
    /** Position of the input (for mouse/touch) */
    readonly Position: Vector3;
    /** Change in position since last event (for mouse/touch) */
    readonly Delta: Vector3;
    /** Strength of the press (0 to 1) */
    readonly PressStrength: number;
    /** Actions that are associated with this input */
    readonly Actions: readonly string[];
    /** Whether this is a change event (continuous input) */
    readonly Changed: boolean;
    /** Timestamp when this event was created */
    readonly Timestamp: number;
    constructor(inputEventAction: InputEventData);
    /**
     * Get the textual representation of the input
     */
    AsText(): string;
    /**
     * Check if this event is associated with a specific action
     */
    IsAction(actionName: string): boolean;
    /**
     * Check if an action associated with this event is currently pressed
     */
    IsActionPressed(actionName: string): boolean;
    /**
     * Check if an action associated with this event was just pressed this frame
     */
    IsActionJustPressed(actionName: string): boolean;
    /**
     * Check if an action associated with this event is currently released
     */
    IsActionReleased(actionName: string): boolean;
    /**
     * Check if an action associated with this event was just released this frame
     */
    IsActionJustReleased(actionName: string): boolean;
    /**
     * Check if this event has any associated actions
     */
    ContainsActions(): boolean;
    /**
     * Check if this input is pressed (strength >= activation threshold)
     */
    IsPressed(activationStrength?: number): boolean;
    /**
     * Check if this input is released (strength < activation threshold)
     */
    IsReleased(activationStrength?: number): boolean;
    /**
     * Check if a modifier key is pressed
     */
    IsKeyModifierPressed(modifier: Enum.ModifierKey): boolean;
}
