/**
 * Controller for handling input echo/repeat
 *
 * Provides functionality to trigger repeated input events when keys are held down
 */
export declare namespace InputEchoController {
    /**
     * Initializes the echo controller
     */
    function Initialize(): void;
    /**
     * Configures echo behavior for an action
     */
    function ConfigureActionEcho(actionName: string, initialDelay?: number, repeatInterval?: number): void;
    /**
     * Disables echo for an action
     */
    function DisableActionEcho(actionName: string): void;
    /**
     * Checks if an echo was triggered for the action this frame
     */
    function WasEchoTriggered(actionName: string): boolean;
}
