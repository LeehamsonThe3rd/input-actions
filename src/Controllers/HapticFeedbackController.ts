import { HapticService, UserInputService } from "@rbxts/services";

/**
 * Controller for managing haptic feedback (vibration)
 *
 * Provides a simple API for triggering controller vibration
 */
export namespace HapticFeedbackController {
	const DEFAULT_LARGE_MOTOR_STRENGTH = 0.5;
	const DEFAULT_SMALL_MOTOR_STRENGTH = 0.5;
	const DEFAULT_DURATION = 0.2;

	interface VibrationPreset {
		largeMotor: number;
		smallMotor: number;
		duration: number;
	}

	const presets = new Map<string, VibrationPreset>([
		["light", { largeMotor: 0.2, smallMotor: 0.3, duration: 0.1 }],
		["medium", { largeMotor: 0.5, smallMotor: 0.5, duration: 0.2 }],
		["heavy", { largeMotor: 0.8, smallMotor: 0.7, duration: 0.3 }],
		["failure", { largeMotor: 1.0, smallMotor: 0.3, duration: 0.5 }],
		["success", { largeMotor: 0.4, smallMotor: 0.8, duration: 0.2 }],
	]);

	/**
	 * Triggers vibration with custom parameters
	 */
	export function Vibrate(
		largeMotor: number = DEFAULT_LARGE_MOTOR_STRENGTH,
		smallMotor: number = DEFAULT_SMALL_MOTOR_STRENGTH,
		duration: number = DEFAULT_DURATION,
	) {
		if (!UserInputService.GamepadEnabled) return;

		// Get all connected gamepads
		for (const gamepad of UserInputService.GetConnectedGamepads()) {
			// Create motor options
			const motorOptions = {
				[Enum.VibrationMotor.LeftHand]: largeMotor,
				[Enum.VibrationMotor.RightHand]: smallMotor,
				[Enum.VibrationMotor.LeftTrigger]: 0,
				[Enum.VibrationMotor.RightTrigger]: 0,
			};

			// Apply vibration
			HapticService.SetMotor(gamepad, motorOptions);

			// Stop the vibration after duration
			task.delay(duration, () => {
				const stopOptions = {
					[Enum.VibrationMotor.LeftHand]: 0,
					[Enum.VibrationMotor.RightHand]: 0,
					[Enum.VibrationMotor.LeftTrigger]: 0,
					[Enum.VibrationMotor.RightTrigger]: 0,
				};
				HapticService.SetMotor(gamepad, stopOptions);
			});
		}
	}

	/**
	 * Triggers vibration using a named preset
	 */
	export function VibratePreset(presetName: string) {
		const preset = presets.get(presetName.lower());
		if (!preset) {
			warn(`Vibration preset "${presetName}" not found`);
			return;
		}

		Vibrate(preset.largeMotor, preset.smallMotor, preset.duration);
	}

	/**
	 * Registers a custom vibration preset
	 */
	export function RegisterPreset(
		name: string,
		largeMotor: number,
		smallMotor: number,
		duration: number,
	) {
		presets.set(name.lower(), {
			largeMotor,
			smallMotor,
			duration,
		});
	}

	/**
	 * Stops all vibration
	 */
	export function StopAll() {
		if (!UserInputService.GamepadEnabled) return;

		for (const gamepad of UserInputService.GetConnectedGamepads()) {
			const stopOptions = {
				[Enum.VibrationMotor.LeftHand]: 0,
				[Enum.VibrationMotor.RightHand]: 0,
				[Enum.VibrationMotor.LeftTrigger]: 0,
				[Enum.VibrationMotor.RightTrigger]: 0,
			};
			HapticService.SetMotor(gamepad, stopOptions);
		}
	}
}
