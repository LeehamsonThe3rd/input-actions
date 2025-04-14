import { ActionResources } from "../Resources/ActionResources";

export namespace ThumbstickHelper {
	export const DEFAULT_DEAD_ZONE = ActionResources.DEFAULT_THUMBSTICK_DEAD_ZONE;

	export function ExtractDirectionalStrength(
		value: number,
		min: number,
		max: number,
		deadZone: number = DEFAULT_DEAD_ZONE,
	): number {
		if (math.abs(value) < deadZone) {
			return 0;
		}

		const adjustedValue = (math.abs(value) - deadZone) / (1 - deadZone);
		return math.abs(math.clamp(value < 0 ? min : max, 0, 1)) * adjustedValue;
	}

	export function ProcessThumbstick(
		position: Vector2,
		deadZone: number = DEFAULT_DEAD_ZONE,
	): {
		up: number;
		down: number;
		left: number;
		right: number;
	} {
		return {
			left: ExtractDirectionalStrength(position.X, -1, 0, deadZone),
			right: ExtractDirectionalStrength(position.X, 0, 1, deadZone),
			up: ExtractDirectionalStrength(position.Y, 0, 1, deadZone),
			down: ExtractDirectionalStrength(position.Y, -1, 0, deadZone),
		};
	}
}
