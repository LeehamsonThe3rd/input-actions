import { Players, RunService, Workspace } from "@rbxts/services";
import { ICameraInputModule } from "./CameraInput/ICameraInputModule";

export namespace InputController {
	let cameraInput: ICameraInputModule | undefined;
	function GetCameraInput(): ICameraInputModule {
		if (cameraInput !== undefined) return cameraInput;
		cameraInput = import("./CameraInput").expect();
		return cameraInput;
	}

	const localPlayer = Players.LocalPlayer;
	interface IControlModule {
		GetMoveVector(): Vector3;
		Enable(enabled?: boolean): void;
		Disable(): void;
	}

	interface IPlayerModule {
		GetControls(): IControlModule;
	}

	let playerModule: IPlayerModule;
	let controlModule: IControlModule;

	let lastZoomDelta = 0;
	let lastRotation = Vector2.zero;
	function GetRawInputVector() {
		return controlModule.GetMoveVector();
	}

	export function ControlSetEnabled(value: boolean) {
		playerModule.GetControls().Enable(value);
	}

	export function MouseInputSetEnabled(value: boolean) {
		GetCameraInput().setInputEnabled(value);
	}

	export function GetRotation() {
		return lastRotation;
	}

	export function GetZoomDelta() {
		return lastZoomDelta;
	}

	//normalized will return input.Unit
	//follow_full_rotation will apply pitch and roll of the camera cframe
	export function GetMoveVector(
		relativeCamera?: boolean,
		normalized?: boolean,
		followFullRotation?: boolean,
	) {
		let inputVector = GetRawInputVector();

		//skips the calculation if input vector is Vector3.zero;
		if (inputVector === Vector3.zero) return inputVector;

		//normalized vector;
		inputVector = normalized ? inputVector.Unit : inputVector;

		if (!relativeCamera) return inputVector;

		const currentCamera = Workspace.CurrentCamera!;

		//follows the pitch and roll of the camera as well
		if (followFullRotation) return currentCamera.CFrame.Rotation.PointToWorldSpace(inputVector);

		const [pitch, yaw, roll] = currentCamera.CFrame.ToOrientation();
		//takes the yaw rotation of the camera;
		const rotationCframe = CFrame.fromAxisAngle(Vector3.yAxis, yaw);
		//rotates the vector around y axis;
		return rotationCframe.PointToWorldSpace(inputVector);
	}

	function UpdateInput(deltaTime: number) {
		//--fetching the delta from input
		lastZoomDelta = GetCameraInput().getZoomDelta();
		lastRotation = GetCameraInput().getRotation(deltaTime);
		GetCameraInput().resetInputForFrameEnd();
	}

	let initialized = false;
	export function Initialize() {
		if (initialized) return;
		initialized = true;
		const playerScripts = localPlayer.WaitForChild("PlayerScripts") as Folder;
		const playerModuleScript = playerScripts.WaitForChild("PlayerModule") as ModuleScript;

		playerModule = require(playerModuleScript) as IPlayerModule;
		controlModule = playerModule.GetControls();
		GetCameraInput().setInputEnabled(true);
		//starts update input cycle
		RunService.BindToRenderStep("FetchInput", Enum.RenderPriority.Input.Value + 1, UpdateInput);
	}
}
