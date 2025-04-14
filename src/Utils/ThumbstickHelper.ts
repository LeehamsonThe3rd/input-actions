import { ActionResources } from "../Resources/ActionResources";

/**
 * Helper functions for processing thumbstick input
 */
export namespace ThumbstickHelper {
	/**
	 * Default thumbstick dead zone value
	 */
	export const DEFAULT_DEAD_ZONE = ActionResources.DEFAULT_THUMBSTICK_DEAD_ZONE;

	/**
	 * Extracts directional press strength from thumbstick input
	 * with dead zone handling
	 *
	 * @param value The raw thumbstick value (-1 to 1)
	 * @param min The minimum value to consider
	 * @param max The maximum value to consider
	 * @param deadZone The dead zone threshold (0 to 1)
	 * @returns The processed press strength (0 to 1)
	 */
	export function ExtractDirectionalStrength(
		value: number,
		min: number,
		max: number,
		deadZone: number = DEFAULT_DEAD_ZONE,
	): number {
		// Check if value is within the dead zone
		if (math.abs(value) < deadZone) {
			return 0;
		}

		// Apply the dead zone (rescale the value to 0-1 range)
		const adjustedValue = (math.abs(value) - deadZone) / (1 - deadZone);

		// Clamp and return the value
		return math.abs(math.clamp(value < 0 ? min : max, 0, 1)) * adjustedValue;
	}

	/**
	 * Processes a thumbstick position into four directional strengths
	 *
	 * @param position The thumbstick position (typically -1 to 1 for each axis)
	 * @param deadZone The dead zone threshold (0 to 1)
	 * @returns Object containing strengths for each direction
	 */
	export function ProcessThumbstick(
		position: Vector2,
		deadZone: number = DEFAULT_DEAD_ZONE,
	): {
		up: number;
		down: number;
		left: number;
		right: number;
	} {
		// Process each direction
		return {
			left: ExtractDirectionalStrength(position.X, -1, 0, deadZone),
			right: ExtractDirectionalStrength(position.X, 0, 1, deadZone),
			up: ExtractDirectionalStrength(position.Y, 0, 1, deadZone),
			down: ExtractDirectionalStrength(position.Y, -1, 0, deadZone),
		};
	}
}
