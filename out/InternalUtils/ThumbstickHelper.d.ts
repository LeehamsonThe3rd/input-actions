export declare namespace ThumbstickHelper {
    export const DEFAULT_DEAD_ZONE = 0.2;
    export function ExtractDirectionalStrength(value: number, min: number, max: number, deadZone?: number): number;
    interface IThumbstickPressData {
        Up: number;
        Down: number;
        Left: number;
        Right: number;
    }
    export function ProcessThumbstick(position: Vector2, deadZone?: number): IThumbstickPressData;
    export {};
}
