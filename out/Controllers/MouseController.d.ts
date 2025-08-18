import { EMouseLockAction } from "../Models/EMouseLockAction";
export declare namespace MouseController {
    class MouseLockAction {
        private readonly action_;
        private readonly priority_;
        private active_;
        constructor(action_: EMouseLockAction, priority_?: number);
        SetActive(active: boolean): void;
    }
    function SetMouseLockActionStrictMode(action: EMouseLockAction, value: boolean): void;
    function SetEnabled(value: boolean): void;
    function Initialize(): void;
}
