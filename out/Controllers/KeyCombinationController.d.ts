import { InputKeyCode } from "../Models/InputKeyCode";
/**
 * Controller for handling key combinations/chords
 */
export declare namespace KeyCombinationController {
    /**
     * Initializes the key combination controller
     */
    function Initialize(): void;
    /**
     * Registers a new key combination
     */
    function RegisterCombination(actionName: string, mainKey: InputKeyCode, modifiers?: Enum.KeyCode[]): void;
}
