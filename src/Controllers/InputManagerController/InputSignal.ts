//!native

import { ArrayTools } from "@rbxts/tool_pack";
import { EInputEventSubscribtionType } from "../../Models/EInputEventSubscribtionType";
import { CleanUp } from "../../UtilityTypes/CleanUp";
import InputEvent from "./InputEvent";

//at the end returns whether to sink the input or no
export type InputCallback = (
	input_event: InputEvent,
) => Enum.ContextActionResult | void | undefined;

const not_skip_strategies = identity<
	Record<EInputEventSubscribtionType, (input_event: InputEvent) => boolean>
>({
	[EInputEventSubscribtionType.All]: () => true,
	[EInputEventSubscribtionType.AllWithNoCustomKeys]: (input_event) =>
		typeOf(input_event.InputKeyCode) !== "string",
	[EInputEventSubscribtionType.KeysOnly]: (input_event) => !input_event.Changed,
	[EInputEventSubscribtionType.OnlyChanged]: (input_event: InputEvent) => input_event.Changed,
	[EInputEventSubscribtionType.OnlyCustomKeys]: (input_event: InputEvent) =>
		typeOf(input_event.InputKeyCode) === "string",
	[EInputEventSubscribtionType.KeysOnlyWithCustomKeys]: (input_event: InputEvent) =>
		!input_event.Changed || typeOf(input_event.InputKeyCode) === "string",
});

export default class InputSignal {
	private subscriptions_: [
		callback: InputCallback,
		subscribtion_type: EInputEventSubscribtionType,
		priority: number,
	][] = [];

	Subscribe(
		callback: InputCallback,
		priority: number = 1,
		subscribtion_type: EInputEventSubscribtionType = EInputEventSubscribtionType.KeysOnly,
	): CleanUp {
		const value: [
			callback: InputCallback,
			subscribtion_type: EInputEventSubscribtionType,
			priority: number,
		] = [callback, priority, subscribtion_type];
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
