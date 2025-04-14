//!native
//!optimize 2

import { ArrayTools } from "@rbxts/tool_pack";
import { EInputEventSubscriptionType } from "../../Models/EInputEventSubscriptionType";
import { CleanUp } from "../../UtilityTypes/CleanUp";
import InputEvent from "./InputEvent";

const DEFAULT_SUBSCRIPTION_PRIORITY = 1;

export type InputCallback = (inputEvent: InputEvent) => Enum.ContextActionResult | void | undefined;

const notSkipStrategies = identity<
	Record<EInputEventSubscriptionType, (inputEvent: InputEvent) => boolean>
>({
	[EInputEventSubscriptionType.All]: () => true,
	[EInputEventSubscriptionType.AllWithNoCustomKeys]: (inputEvent) =>
		typeOf(inputEvent.InputKeyCode) !== "string",
	[EInputEventSubscriptionType.KeysOnly]: (inputEvent) => !inputEvent.Changed,
	[EInputEventSubscriptionType.ChangedOnly]: (inputEvent: InputEvent) => inputEvent.Changed,
	[EInputEventSubscriptionType.CustomKeysOnly]: (inputEvent: InputEvent) =>
		typeOf(inputEvent.InputKeyCode) === "string",
	[EInputEventSubscriptionType.KeysWithCustomKeysOnly]: (inputEvent: InputEvent) =>
		!inputEvent.Changed || typeOf(inputEvent.InputKeyCode) === "string",
});

export default class InputSignal {
	private subscriptions: [
		callback: InputCallback,
		subscriptionType: EInputEventSubscriptionType,
		priority: number,
	][] = [];

	Subscribe(
		callback: InputCallback,
		priority: number = DEFAULT_SUBSCRIPTION_PRIORITY,
		subscriptionType: EInputEventSubscriptionType = EInputEventSubscriptionType.KeysOnly,
	): CleanUp {
		const value: [
			callback: InputCallback,
			subscriptionType: EInputEventSubscriptionType,
			priority: number,
		] = [callback, subscriptionType, priority];
		ArrayTools.SortedInsert(this.subscriptions, value, (currentValue, b) => {
			return currentValue[2] > b[2];
		});
		return () => ArrayTools.RemoveElementFromArray(this.subscriptions, value);
	}

	Fire(inputEvent: InputEvent): Enum.ContextActionResult {
		for (const [callback, subscriptionType] of table.clone(this.subscriptions)) {
			const notSkipStrategy = notSkipStrategies[subscriptionType];
			if (!notSkipStrategy(inputEvent)) continue;
			const [success, result] = pcall(callback, inputEvent);
			if (!success) {
				warn(result);
				continue;
			}
			if (result === Enum.ContextActionResult.Sink) return result;
		}

		return Enum.ContextActionResult.Pass;
	}
}
