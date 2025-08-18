import { EInputEventSubscriptionType } from "../../Models";
import InputEventData from "./InputEventData";
import { InputCallback } from "./InputSignal";
/**
 * Controller for managing and processing input events
 *
 * Handles the conversion of Roblox input events to our custom input system,
 * including custom key processing for thumbsticks and mouse movement.
 */
export declare namespace InputManagerController {
    /**
     * Configuration options for input subscription
     */
    interface ISubscriptionConfig {
        /** Priority of the subscription (higher values are processed first) */
        Priority?: number;
        /** Type of events to subscribe to */
        SubscriptionType?: EInputEventSubscriptionType;
    }
    /**
     * Subscribe to input events with optional configuration
     * @param callback Function to call when input is received
     * @param config Optional configuration for the subscription
     * @returns Cleanup function to remove the subscription
     */
    function Subscribe(callback: InputCallback, config?: ISubscriptionConfig): import("../../UtilityTypes/CleanUp").CleanUp;
    /**
     * Parse and process an input event
     * @param inputEventData The raw input event data
     * @returns The result of processing the event
     */
    function ParseInputEvent(inputEventData: InputEventData): Enum.ContextActionResult;
    /**
     * Initialize the input manager system
     * Must be called before using any other functionality
     */
    function Initialize(): void;
}
