import { HapticService, UserInputService } from "@rbxts/services";
import { EVibrationPreset } from "../Models/EVibrationPreset";

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
		[EVibrationPreset.Light, { largeMotor: 0.2, smallMotor: 0.3, duration: 0.1 }],
		[EVibrationPreset.Medium, { largeMotor: 0.5, smallMotor: 0.5, duration: 0.2 }],
		[EVibrationPreset.Heavy, { largeMotor: 0.8, smallMotor: 0.7, duration: 0.3 }],
		[EVibrationPreset.Failure, { largeMotor: 1.0, smallMotor: 0.3, duration: 0.5 }],
		[EVibrationPreset.Success, { largeMotor: 0.4, smallMotor: 0.8, duration: 0.2 }],
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
			// Apply vibration to each motor separately
			HapticService.SetMotor(gamepad, Enum.VibrationMotor.LeftHand, largeMotor);
			HapticService.SetMotor(gamepad, Enum.VibrationMotor.RightHand, smallMotor);
			HapticService.SetMotor(gamepad, Enum.VibrationMotor.LeftTrigger, 0);
			HapticService.SetMotor(gamepad, Enum.VibrationMotor.RightTrigger, 0);

			// Stop the vibration after duration
			task.delay(duration, () => {
				HapticService.SetMotor(gamepad, Enum.VibrationMotor.LeftHand, 0);
				HapticService.SetMotor(gamepad, Enum.VibrationMotor.RightHand, 0);
				HapticService.SetMotor(gamepad, Enum.VibrationMotor.LeftTrigger, 0);
				HapticService.SetMotor(gamepad, Enum.VibrationMotor.RightTrigger, 0);
			});
		}
	}

	/**
	 * Triggers vibration using a named preset
	 */
	export function VibratePreset(presetName: EVibrationPreset | string) {
		const preset = presets.get(typeof presetName === "string" ? presetName.lower() : presetName);
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
			HapticService.SetMotor(gamepad, Enum.VibrationMotor.LeftHand, 0);
			HapticService.SetMotor(gamepad, Enum.VibrationMotor.RightHand, 0);
			HapticService.SetMotor(gamepad, Enum.VibrationMotor.LeftTrigger, 0);
			HapticService.SetMotor(gamepad, Enum.VibrationMotor.RightTrigger, 0);
		}
	}
}
