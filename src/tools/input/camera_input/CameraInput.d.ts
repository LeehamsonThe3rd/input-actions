interface ICameraInput {
	setInputEnabled: (enabled: boolean) => void;
	getRotation: () => Vector2;
	getZoomDelta: () => number;
	resetInputForFrameEnd: () => void;
}

declare const CameraInput: ICameraInput;
export = CameraInput;
