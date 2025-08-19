-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local Players = _services.Players
local RunService = _services.RunService
local Workspace = _services.Workspace
local RawInputHandler = {}
do
	local _container = RawInputHandler
	local cameraInput
	local function GetCameraInput()
		if cameraInput ~= nil then
			return cameraInput
		end
		cameraInput = TS.Promise.new(function(resolve)
			resolve(TS.import(script, script.Parent, "CameraInput"))
		end):expect()
		return cameraInput
	end
	local localPlayer = Players.LocalPlayer
	local playerModule
	local controlModule
	local lastZoomDelta = 0
	local lastRotation = Vector2.zero
	local function GetRawInputVector()
		return controlModule:GetMoveVector()
	end
	local function ControlSetEnabled(value)
		playerModule:GetControls():Enable(value)
	end
	_container.ControlSetEnabled = ControlSetEnabled
	local function MouseInputSetEnabled(value)
		GetCameraInput().setInputEnabled(value)
	end
	_container.MouseInputSetEnabled = MouseInputSetEnabled
	local function GetRotation()
		return lastRotation
	end
	_container.GetRotation = GetRotation
	local function GetZoomDelta()
		return lastZoomDelta
	end
	_container.GetZoomDelta = GetZoomDelta
	--normalized will return input.Unit
	--follow_full_rotation will apply pitch and roll of the camera cframe
	local function GetMoveVector(relativeCamera, normalized, followFullRotation)
		local inputVector = GetRawInputVector()
		--skips the calculation if input vector is Vector3.zero;
		if inputVector == Vector3.zero then
			return inputVector
		end
		--normalized vector;
		inputVector = if normalized then inputVector.Unit else inputVector
		if not relativeCamera then
			return inputVector
		end
		local currentCamera = Workspace.CurrentCamera
		--follows the pitch and roll of the camera as well
		if followFullRotation then
			return currentCamera.CFrame.Rotation:PointToWorldSpace(inputVector)
		end
		local pitch, yaw, roll = currentCamera.CFrame:ToOrientation()
		--takes the yaw rotation of the camera;
		local rotationCframe = CFrame.fromAxisAngle(Vector3.yAxis, yaw)
		--rotates the vector around y axis;
		return rotationCframe:PointToWorldSpace(inputVector)
	end
	_container.GetMoveVector = GetMoveVector
	local function UpdateInput(deltaTime)
		----fetching the delta from input
		lastZoomDelta = GetCameraInput().getZoomDelta()
		lastRotation = GetCameraInput().getRotation(deltaTime)
		GetCameraInput().resetInputForFrameEnd()
	end
	local initialized = false
	local function Initialize()
		if initialized then
			return nil
		end
		initialized = true
		local playerScripts = localPlayer:WaitForChild("PlayerScripts")
		local playerModuleScript = playerScripts:WaitForChild("PlayerModule")
		playerModule = require(playerModuleScript)
		controlModule = playerModule:GetControls()
		GetCameraInput().setInputEnabled(true)
		--starts update input cycle
		RunService:BindToRenderStep("FetchInput", Enum.RenderPriority.Input.Value + 1, UpdateInput)
	end
	_container.Initialize = Initialize
end
return {
	RawInputHandler = RawInputHandler,
}
