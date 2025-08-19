import { InputKeyCode } from "./InputKeyCode";
export default interface IInputMap {
    readonly Gamepad?: InputKeyCode[];
    readonly KeyboardAndMouse?: InputKeyCode[];
}
