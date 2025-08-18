import { InputKeyCode } from "../../Models/InputKeyCode";
export default class InputEventData {
    static FromInputKeyCode(inputKeyCode: InputKeyCode, userInputType?: Enum.UserInputType): InputEventData;
    static FromAction(actionName: string): InputEventData;
    readonly InputKeyCode: InputKeyCode;
    readonly UserInputType: Enum.UserInputType;
    readonly Action: string;
    /**if the event is Enum.UserInputState.Changed */
    Changed: boolean;
    PressStrength: number;
    Position: Vector3;
    Delta: Vector3;
    private constructor();
}
