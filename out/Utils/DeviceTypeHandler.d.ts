import { EDeviceType } from "../Models/EDeviceType";
import { EInputType } from "../Models/EInputType";
export declare namespace DeviceTypeHandler {
    const OnInputTypeChanged: RBXScriptSignal<(inputType: EInputType) => void>;
    const OnDeviceTypeChanged: RBXScriptSignal<(deviceType: EDeviceType) => void>;
    function GetMainInputType(): EInputType;
    function GetMainDeviceType(): EDeviceType;
    function Initialize(): Promise<void>;
}
