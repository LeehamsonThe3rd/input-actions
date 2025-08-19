-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local HapticService = _services.HapticService
local UserInputService = _services.UserInputService
--[[
	*
	 * Controller for managing haptic feedback (vibration)
	 *
	 * Provides a simple API for triggering controller vibration
	 
]]
local HapticFeedbackController = {}
do
	local _container = HapticFeedbackController
	local DEFAULT_LARGE_MOTOR_STRENGTH = 0.5
	local DEFAULT_SMALL_MOTOR_STRENGTH = 0.5
	local DEFAULT_DURATION = 0.2
	local presets = {
		light = {
			LargeMotor = 0.2,
			SmallMotor = 0.3,
			Duration = 0.1,
		},
		medium = {
			LargeMotor = 0.5,
			SmallMotor = 0.5,
			Duration = 0.2,
		},
		heavy = {
			LargeMotor = 0.8,
			SmallMotor = 0.7,
			Duration = 0.3,
		},
		failure = {
			LargeMotor = 1.0,
			SmallMotor = 0.3,
			Duration = 0.5,
		},
		success = {
			LargeMotor = 0.4,
			SmallMotor = 0.8,
			Duration = 0.2,
		},
	}
	--[[
		*
			 * Triggers vibration with custom parameters
			 
	]]
	local function Vibrate(largeMotor, smallMotor, duration)
		if largeMotor == nil then
			largeMotor = DEFAULT_LARGE_MOTOR_STRENGTH
		end
		if smallMotor == nil then
			smallMotor = DEFAULT_SMALL_MOTOR_STRENGTH
		end
		if duration == nil then
			duration = DEFAULT_DURATION
		end
		if not UserInputService.GamepadEnabled then
			return nil
		end
		-- Get all connected gamepads
		for _, gamepad in UserInputService:GetConnectedGamepads() do
			-- Apply vibration to each motor separately
			HapticService:SetMotor(gamepad, Enum.VibrationMotor.LeftHand, largeMotor)
			HapticService:SetMotor(gamepad, Enum.VibrationMotor.RightHand, smallMotor)
			HapticService:SetMotor(gamepad, Enum.VibrationMotor.LeftTrigger, 0)
			HapticService:SetMotor(gamepad, Enum.VibrationMotor.RightTrigger, 0)
			-- Stop the vibration after duration
			task.delay(duration, function()
				HapticService:SetMotor(gamepad, Enum.VibrationMotor.LeftHand, 0)
				HapticService:SetMotor(gamepad, Enum.VibrationMotor.RightHand, 0)
				HapticService:SetMotor(gamepad, Enum.VibrationMotor.LeftTrigger, 0)
				HapticService:SetMotor(gamepad, Enum.VibrationMotor.RightTrigger, 0)
			end)
		end
	end
	_container.Vibrate = Vibrate
	--[[
		*
			 * Triggers vibration using a named preset
			 
	]]
	local function VibratePreset(presetName)
		local _presetName = presetName
		local _arg0 = if type(_presetName) == "string" then string.lower(presetName) else presetName
		local preset = presets[_arg0]
		if not preset then
			warn(`Vibration preset "{presetName}" not found`)
			return nil
		end
		Vibrate(preset.LargeMotor, preset.SmallMotor, preset.Duration)
	end
	_container.VibratePreset = VibratePreset
	--[[
		*
			 * Registers a custom vibration preset
			 
	]]
	local function RegisterPreset(name, largeMotor, smallMotor, duration)
		local _arg0 = string.lower(name)
		local _arg1 = {
			LargeMotor = largeMotor,
			SmallMotor = smallMotor,
			Duration = duration,
		}
		presets[_arg0] = _arg1
	end
	_container.RegisterPreset = RegisterPreset
	--[[
		*
			 * Stops all vibration
			 
	]]
	local function StopAll()
		if not UserInputService.GamepadEnabled then
			return nil
		end
		for _, gamepad in UserInputService:GetConnectedGamepads() do
			HapticService:SetMotor(gamepad, Enum.VibrationMotor.LeftHand, 0)
			HapticService:SetMotor(gamepad, Enum.VibrationMotor.RightHand, 0)
			HapticService:SetMotor(gamepad, Enum.VibrationMotor.LeftTrigger, 0)
			HapticService:SetMotor(gamepad, Enum.VibrationMotor.RightTrigger, 0)
		end
	end
	_container.StopAll = StopAll
end
return {
	HapticFeedbackController = HapticFeedbackController,
}
