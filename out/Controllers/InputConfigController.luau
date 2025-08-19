-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local ActionResources = TS.import(script, script.Parent.Parent, "Resources", "ActionResources").ActionResources
--[[
	*
	 * Controller for configuring input behavior settings
	 
]]
local InputConfigController = {}
do
	local _container = InputConfigController
	local DEFAULT_MIN_PRESS_STRENGTH = ActionResources.DEFAULT_MIN_PRESS_STRENGTH
	-- Per-action activation thresholds
	local actionActivationThresholds = {}
	-- Per-input deadzone settings
	local inputDeadzones = {}
	--[[
		*
			 * Sets the activation threshold for a specific action
			 * @param actionName The name of the action
			 * @param threshold Value between 0 and 1
			 
	]]
	local function SetActionActivationThreshold(actionName, threshold)
		local _actionName = actionName
		local _arg1 = math.clamp(threshold, 0, 1)
		actionActivationThresholds[_actionName] = _arg1
	end
	_container.SetActionActivationThreshold = SetActionActivationThreshold
	--[[
		*
			 * Gets the activation threshold for a specific action
			 
	]]
	local function GetActionActivationThreshold(actionName)
		local _actionName = actionName
		local _condition = actionActivationThresholds[_actionName]
		if _condition == nil then
			_condition = DEFAULT_MIN_PRESS_STRENGTH
		end
		return _condition
	end
	_container.GetActionActivationThreshold = GetActionActivationThreshold
	--[[
		*
			 * Sets the deadzone for an analog input
			 * @param inputKey The input key (typically a thumbstick or trigger)
			 * @param deadzone Value between 0 and 1
			 
	]]
	local function SetInputDeadzone(inputKey, deadzone)
		local _inputKey = inputKey
		local _arg1 = math.clamp(deadzone, 0, 1)
		inputDeadzones[_inputKey] = _arg1
	end
	_container.SetInputDeadzone = SetInputDeadzone
	--[[
		*
			 * Gets the deadzone for a specific input
			 
	]]
	local IsThumbstickInput
	local function GetInputDeadzone(inputKey)
		local _inputKey = inputKey
		local _condition = inputDeadzones[_inputKey]
		if _condition == nil then
			_condition = (if IsThumbstickInput(inputKey) then ActionResources.DEFAULT_THUMBSTICK_DEAD_ZONE else 0)
		end
		return _condition
	end
	_container.GetInputDeadzone = GetInputDeadzone
	-- Check custom thumbstick keys
	local thumbstickCustomKeys = { "Thumbstick1Up", "Thumbstick1Down", "Thumbstick1Left", "Thumbstick1Right", "Thumbstick2Up", "Thumbstick2Down", "Thumbstick2Left", "Thumbstick2Right" }
	--[[
		*
			 * Checks if an input is a thumbstick-related input
			 
	]]
	function IsThumbstickInput(inputKey)
		if inputKey == Enum.KeyCode.Thumbstick1 or inputKey == Enum.KeyCode.Thumbstick2 then
			return true
		end
		local _inputKey = inputKey
		return table.find(thumbstickCustomKeys, _inputKey) ~= nil
	end
end
return {
	InputConfigController = InputConfigController,
}
