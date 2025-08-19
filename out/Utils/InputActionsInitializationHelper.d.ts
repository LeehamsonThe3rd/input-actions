export declare namespace InputActionsInitializationHelper {
    function InitAll(): void;
    function InitMouseController(): void;
    function InitDeviceTypeHandler(): void;
    function InitRawInputHandler(): void;
    /**
     * InputManagerController
     * ActionsController
     */
    function InitBasicInputControllers(): void;
    /**
     * InputEchoController
     * KeyCombinationController
     * InputContextController
     */
    function InitAdvancedInputControllers(): void;
    /**
     * Apply default input maps for standard UI navigation
     */
    function ApplyDefaultInputMaps(): void;
}
