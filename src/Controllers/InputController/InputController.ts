import { Players, RunService, Workspace } from "@rbxts/services";
import { FunctionTools } from "@rbxts/tool_pack";
import { ICameraInputModule } from "./CameraInput/ICameraInputModule";

export namespace InputController {
	let camera_input: ICameraInputModule | undefined;
	function GetCameraInput(): ICameraInputModule {
		if (camera_input !== undefined) return camera_input;
		camera_input = import("./CameraInput").expect();
		return camera_input;
	}

	const local_player = Players.LocalPlayer;
	interface IControlModule {
		GetMoveVector(): Vector3;
		Enable(enabled?: boolean): void;
		Disable(): void;
	}

	interface IPlayerModule {
		GetControls(): IControlModule;
	}

	let player_module: IPlayerModule;
	let control_module: IControlModule;

	let last_zoom_delta = 0;
	let last_rotation = Vector2.zero;
	function GetRawInputVector() {
		return control_module.GetMoveVector();
	}

	export function ControlSetEnabled(value: boolean) {
		player_module.GetControls().Enable(value);
	}

	export function MouseInputSetEnabled(value: boolean) {
		GetCameraInput().setInputEnabled(value);
	}

	export function GetRotation() {
		return last_rotation;
	}

	export function GetZoomDelta() {
		return last_zoom_delta;
	}

	//normalized will return input.Unit
	//follow_full_rotation will apply pitch and roll of the camera cframe
	export function GetMoveVector(
		relative_camera?: boolean,
		normalized?: boolean,
		follow_full_rotation?: boolean,
	) {
		let input_vector = GetRawInputVector();

		//skips the calculation if input vector is Vector3.zero;
		if (input_vector === Vector3.zero) return input_vector;

		//normalized vector;
		input_vector = normalized ? input_vector.Unit : input_vector;

		if (!relative_camera) return input_vector;

		const current_camera = Workspace.CurrentCamera!;

		//follows the pitch and roll of the camera as well
		if (follow_full_rotation) return current_camera.CFrame.Rotation.PointToWorldSpace(input_vector);

		const [pitch, yaw, roll] = current_camera.CFrame.ToOrientation();
		//takes the yaw rotation of the camera;
		const rotation_cframe = CFrame.fromAxisAngle(Vector3.yAxis, yaw);
		//rotates the vector around y axis;
		return rotation_cframe.PointToWorldSpace(input_vector);
	}

	function UpdateInput(delta_time: number) {
		//--fetching the delta from input
		last_zoom_delta = GetCameraInput().getZoomDelta();
		last_rotation = GetCameraInput().getRotation(delta_time);
		GetCameraInput().resetInputForFrameEnd();
	}

	let initialized = false;
	export function Initialize() {
		if (initialized) return;
		initialized = true;
		const player_scripts = local_player.WaitForChild("PlayerScripts") as Folder;
		const player_module_script = player_scripts.WaitForChild("PlayerModule") as ModuleScript;

		player_module = require(player_module_script) as IPlayerModule;
		control_module = player_module.GetControls();
		GetCameraInput().setInputEnabled(true);
		//starts update input cycle
		RunService.BindToRenderStep("FetchInput", Enum.RenderPriority.Input.Value + 1, UpdateInput);
	}
}
