import { EInputEventSubscriptionType } from "../../Models/EInputEventSubscriptionType";
import { CleanUp } from "../../UtilityTypes/CleanUp";
import InputEvent from "./InputEvent";
export type InputCallback = (inputEvent: InputEvent) => Enum.ContextActionResult | void | undefined;
export default class InputSignal {
    private subscriptions;
    Subscribe(callback: InputCallback, priority?: number, subscriptionType?: EInputEventSubscriptionType): CleanUp;
    Fire(inputEvent: InputEvent): Enum.ContextActionResult;
}
