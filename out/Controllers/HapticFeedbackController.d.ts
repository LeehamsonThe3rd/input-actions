import { EVibrationPreset } from "../Models/EVibrationPreset";
/**
 * Controller for managing haptic feedback (vibration)
 *
 * Provides a simple API for triggering controller vibration
 */
export declare namespace HapticFeedbackController {
    interface IVibrationPreset {
        LargeMotor: number;
        SmallMotor: number;
        Duration: number;
    }
    /**
     * Triggers vibration with custom parameters
     */
    function Vibrate(largeMotor?: number, smallMotor?: number, duration?: number): void;
    /**
     * Triggers vibration using a named preset
     */
    function VibratePreset(presetName: EVibrationPreset | string): void;
    /**
     * Registers a custom vibration preset
     */
    function RegisterPreset(name: string, largeMotor: number, smallMotor: number, duration: number): void;
    /**
     * Stops all vibration
     */
    function StopAll(): void;
}
