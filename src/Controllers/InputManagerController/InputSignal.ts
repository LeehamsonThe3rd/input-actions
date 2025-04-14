//!native
//!optimize 2

import { ArrayTools } from "@rbxts/tool_pack";
import { EInputEventSubscriptionType } from "../../Models/EInputEventSubscriptionType";
import { CleanUp } from "../../UtilityTypes/CleanUp";
import InputEvent from "./InputEvent";

/**
 * Constants for InputSignal
 */
const DEFAULT_SUBSCRIPTION_PRIORITY = 1;

//at the end returns whether to sink the input or no
export type InputCallback = (
	input_event: InputEvent,
) => Enum.ContextActionResult | void | undefined;

const not_skip_strategies = identity<
	Record<EInputEventSubscriptionType, (input_event: InputEvent) => boolean>
>({
	[EInputEventSubscriptionType.All]: () => true,
	[EInputEventSubscriptionType.AllWithNoCustomKeys]: (input_event) =>
		typeOf(input_event.InputKeyCode) !== "string",
	[EInputEventSubscriptionType.KeysOnly]: (input_event) => !input_event.Changed,
	[EInputEventSubscriptionType.ChangedOnly]: (input_event: InputEvent) => input_event.Changed,
	[EInputEventSubscriptionType.CustomKeysOnly]: (input_event: InputEvent) =>
		typeOf(input_event.InputKeyCode) === "string",
	[EInputEventSubscriptionType.KeysWithCustomKeysOnly]: (input_event: InputEvent) =>
		!input_event.Changed || typeOf(input_event.InputKeyCode) === "string",
});

export default class InputSignal {
	private subscriptions_: [
		callback: InputCallback,
		subscribtion_type: EInputEventSubscriptionType,
		priority: number,
	][] = [];

	Subscribe(
		callback: InputCallback,
		priority: number = DEFAULT_SUBSCRIPTION_PRIORITY,
		subscribtion_type: EInputEventSubscriptionType = EInputEventSubscriptionType.KeysOnly,
	): CleanUp {
		const value: [
			callback: InputCallback,
			subscribtion_type: EInputEventSubscriptionType,
			priority: number,
		] = [callback, subscribtion_type, priority];
		ArrayTools.SortedInsert(this.subscriptions_, value, (current_value, b) => {
			//current_priority > b_priority
			return current_value[2] > b[2];
		});
		return () => ArrayTools.RemoveElementFromArray(this.subscriptions_, value);
	}

	Fire(input_event: InputEvent): Enum.ContextActionResult {
		for (const [callback, subscribtion_type] of table.clone(this.subscriptions_)) {
			const not_skip_strategy = not_skip_strategies[subscribtion_type];
			if (!not_skip_strategy(input_event)) continue;
			const [success, result] = pcall(callback, input_event);
			if (!success) {
				warn(result);
				continue;
			}
			if (result === Enum.ContextActionResult.Sink) return result;
		}

		return Enum.ContextActionResult.Pass;
	}
}
