export default class InputCatcher {
    private _priority;
    private _uuid;
    private _isActive;
    /**
     * Creates a new InputCatcher for blocking all input
     * @param priority Priority level for the input catch (higher catches earlier)
     */
    constructor(priority: number);
    /**
     * Start capturing and blocking all user input
     */
    GrabInput(): void;
    /**
     * Stop capturing input and restore normal input handling
     */
    ReleaseInput(): void;
    /**
     * Check if this InputCatcher is currently active
     */
    IsActive(): boolean;
}
