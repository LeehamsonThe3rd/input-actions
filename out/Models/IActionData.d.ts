import { InputKeyCode } from "./InputKeyCode";
export interface IActionData {
    /**
     * Array of key codes that can trigger this action
     */
    Keycodes: InputKeyCode[];
    /**
     * Buffer that stores input state for the action
     * [0] - Current frame state (set by input events)
     * [1] - Previous frame state (set during update)
     * [2] - Pre-previous frame state (set during update)
     * Used to detect just pressed/released states
     */
    KeyBuffer: [number, number, number];
    /**
     * Minimum press strength required to consider this action activated
     * Values below this threshold are considered "released"
     */
    ActivationStrength: number;
}
