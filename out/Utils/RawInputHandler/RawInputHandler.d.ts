export declare namespace RawInputHandler {
    function ControlSetEnabled(value: boolean): void;
    function MouseInputSetEnabled(value: boolean): void;
    function GetRotation(): Vector2;
    function GetZoomDelta(): number;
    function GetMoveVector(relativeCamera?: boolean, normalized?: boolean, followFullRotation?: boolean): Vector3;
    function Initialize(): void;
}
