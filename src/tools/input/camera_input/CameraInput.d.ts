interface ICameraInput {
	setInputEnabled: (enabled: boolean) => void;
	getRotation: (dt: number, disable_keyboard_rotation?: boolean) => Vector2;
	getZoomDelta: () => number;
	resetInputForFrameEnd: () => void;
}

declare const CameraInput: ICameraInput;
export = CameraInput;
