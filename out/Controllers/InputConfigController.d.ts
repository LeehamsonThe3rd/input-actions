import { InputKeyCode } from "../Models/InputKeyCode";
/**
 * Controller for configuring input behavior settings
 */
export declare namespace InputConfigController {
    /**
     * Sets the activation threshold for a specific action
     * @param actionName The name of the action
     * @param threshold Value between 0 and 1
     */
    function SetActionActivationThreshold(actionName: string, threshold: number): void;
    /**
     * Gets the activation threshold for a specific action
     */
    function GetActionActivationThreshold(actionName: string): number;
    /**
     * Sets the deadzone for an analog input
     * @param inputKey The input key (typically a thumbstick or trigger)
     * @param deadzone Value between 0 and 1
     */
    function SetInputDeadzone(inputKey: InputKeyCode, deadzone: number): void;
    /**
     * Gets the deadzone for a specific input
     */
    function GetInputDeadzone(inputKey: InputKeyCode): number;
}
