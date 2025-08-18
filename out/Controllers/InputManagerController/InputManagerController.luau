--!native
--!optimize 2
-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local ContextActionService = TS.import(script, TS.getModule(script, "@rbxts", "services")).ContextActionService
local ActionResources = TS.import(script, script.Parent.Parent.Parent, "Resources", "ActionResources").ActionResources
local ContextActionResources = TS.import(script, script.Parent.Parent.Parent, "Resources", "ContextActionResources").ContextActionResources
local ThumbstickHelper = TS.import(script, script.Parent.Parent.Parent, "InternalUtils", "ThumbstickHelper").ThumbstickHelper
local ActionsController = TS.import(script, script.Parent.Parent, "ActionsController").ActionsController
local InputConfigController = TS.import(script, script.Parent.Parent, "InputConfigController").InputConfigController
local InputEvent = TS.import(script, script.Parent, "InputEvent").default
local InputEventData = TS.import(script, script.Parent, "InputEventData").default
local InputSignal = TS.import(script, script.Parent, "InputSignal").default
--[[
	*
	 * Controller for managing and processing input events
	 *
	 * Handles the conversion of Roblox input events to our custom input system,
	 * including custom key processing for thumbsticks and mouse movement.
	 
]]
local InputManagerController = {}
do
	local _container = InputManagerController
	local inputSignal = InputSignal.new()
	--[[
		*
			 * Configuration options for input subscription
			 
	]]
	--[[
		*
			 * Subscribe to input events with optional configuration
			 * @param callback Function to call when input is received
			 * @param config Optional configuration for the subscription
			 * @returns Cleanup function to remove the subscription
			 
	]]
	local function Subscribe(callback, config)
		local _exp = callback
		local _result = config
		if _result ~= nil then
			_result = _result.Priority
		end
		local _result_1 = config
		if _result_1 ~= nil then
			_result_1 = _result_1.SubscriptionType
		end
		return inputSignal:Subscribe(_exp, _result, _result_1)
	end
	_container.Subscribe = Subscribe
	--[[
		*
			 * Gets the appropriate key code from an input object
			 
	]]
	local function GetInputKeyCode(input)
		return if input.KeyCode == Enum.KeyCode.Unknown then input.UserInputType else input.KeyCode
	end
	--[[
		*
			 * Updates action press states based on an input event
			 
	]]
	local function PressActionsFromInputEvent(inputEvent)
		for _, actionName in inputEvent.Actions do
			ActionsController.Press(actionName, inputEvent.PressStrength)
		end
	end
	--[[
		*
			 * Parse and process an input event
			 * @param inputEventData The raw input event data
			 * @returns The result of processing the event
			 
	]]
	local function ParseInputEvent(inputEventData)
		local inputEvent = InputEvent.new(inputEventData)
		PressActionsFromInputEvent(inputEvent)
		return inputSignal:Fire(inputEvent)
	end
	_container.ParseInputEvent = ParseInputEvent
	--[[
		*
			 * Sets the press strength for a custom key and creates an input event
			 
	]]
	local CustomKeyPressStrengths
	local function SetCustomKeyStrength(input, customKey, strength, force)
		if force == nil then
			force = false
		end
		if not force and CustomKeyPressStrengths[customKey] == strength then
			return nil
		end
		CustomKeyPressStrengths[customKey] = strength
		local inputEventData = InputEventData:FromInputKeyCode(customKey, input.UserInputType)
		inputEventData.Position = input.Position
		inputEventData.Delta = input.Delta
		inputEventData.PressStrength = strength
		inputEventData.Changed = true
		ParseInputEvent(inputEventData)
	end
	--[[
		*
			 * Extracts a normalized press strength from a raw input value
			 
	]]
	local function ExtractPressStrength(value, min, max)
		return math.abs(math.clamp(value, min, max))
	end
	-- Tracks the current press strength of all custom keys
	CustomKeyPressStrengths = {
		Thumbstick1Left = 0,
		Thumbstick1Right = 0,
		Thumbstick1Up = 0,
		Thumbstick1Down = 0,
		Thumbstick2Left = 0,
		Thumbstick2Right = 0,
		Thumbstick2Up = 0,
		Thumbstick2Down = 0,
		MouseWheelUp = 0,
		MouseWheelDown = 0,
		MouseLeft = 0,
		MouseRight = 0,
		MouseDown = 0,
		MouseUp = 0,
	}
	local savedMousePosition = Vector3.zero
	-- Strategies for processing different types of custom input
	local CustomKeyStrategies = {
		[Enum.KeyCode.Thumbstick1] = function(input)
			local keyCode = Enum.KeyCode.Thumbstick1
			local position = Vector2.new(input.Position.X, input.Position.Y)
			local deadzone = InputConfigController.GetInputDeadzone(keyCode)
			local directions = ThumbstickHelper.ProcessThumbstick(position, deadzone)
			SetCustomKeyStrength(input, "Thumbstick1Left", directions.Left)
			SetCustomKeyStrength(input, "Thumbstick1Right", directions.Right)
			SetCustomKeyStrength(input, "Thumbstick1Up", directions.Up)
			SetCustomKeyStrength(input, "Thumbstick1Down", directions.Down)
		end,
		[Enum.KeyCode.Thumbstick2] = function(input)
			local keyCode = Enum.KeyCode.Thumbstick2
			local position = Vector2.new(input.Position.X, input.Position.Y)
			local deadzone = InputConfigController.GetInputDeadzone(keyCode)
			local directions = ThumbstickHelper.ProcessThumbstick(position, deadzone)
			SetCustomKeyStrength(input, "Thumbstick2Left", directions.Left)
			SetCustomKeyStrength(input, "Thumbstick2Right", directions.Right)
			SetCustomKeyStrength(input, "Thumbstick2Up", directions.Up)
			SetCustomKeyStrength(input, "Thumbstick2Down", directions.Down)
		end,
		[Enum.UserInputType.MouseWheel] = function(input)
			local downStrength = ExtractPressStrength(input.Position.Z, -1, 0)
			local upStrength = ExtractPressStrength(input.Position.Z, 0, 1)
			if downStrength ~= 0 then
				SetCustomKeyStrength(input, "MouseWheelDown", downStrength, true)
			end
			if upStrength ~= 0 then
				SetCustomKeyStrength(input, "MouseWheelUp", upStrength, true)
			end
		end,
		[Enum.UserInputType.MouseMovement] = function(input)
			local _position = input.Position
			local _savedMousePosition = savedMousePosition
			local positionDelta = _position - _savedMousePosition
			savedMousePosition = input.Position
			local _delta = input.Delta
			local totalDelta = positionDelta + _delta
			local leftStrength = math.abs(math.min(totalDelta.X, 0))
			local rightStrength = math.abs(math.max(totalDelta.X, 0))
			local upStrength = math.abs(math.min(totalDelta.Y, 0))
			local downStrength = math.abs(math.max(totalDelta.Y, 0))
			SetCustomKeyStrength(input, "MouseLeft", leftStrength)
			SetCustomKeyStrength(input, "MouseRight", rightStrength)
			SetCustomKeyStrength(input, "MouseDown", downStrength)
			SetCustomKeyStrength(input, "MouseUp", upStrength)
		end,
	}
	--[[
		*
			 * Checks if the input requires custom key processing and handles it
			 
	]]
	local function CheckAndParseIfCustomInputKeyCode(input)
		if input.UserInputState ~= Enum.UserInputState.Change then
			return nil
		end
		local inputKeyCode = GetInputKeyCode(input)
		local strategy = CustomKeyStrategies[inputKeyCode]
		local _result = strategy
		if _result ~= nil then
			_result(input)
		end
	end
	--[[
		*
			 * Main input handler function called by ContextActionService
			 
	]]
	local function OnInput(_, state, input)
		if state == Enum.UserInputState.None then
			return nil
		end
		if state == Enum.UserInputState.Cancel then
			return nil
		end
		local pressStrength = if state == Enum.UserInputState.Begin then 1 else 0
		local inputKeyCode = GetInputKeyCode(input)
		local inputEventAction = InputEventData:FromInputKeyCode(inputKeyCode, input.UserInputType)
		inputEventAction.Position = input.Position
		inputEventAction.Changed = state == Enum.UserInputState.Change
		inputEventAction.Delta = input.Delta
		inputEventAction.PressStrength = pressStrength
		CheckAndParseIfCustomInputKeyCode(input)
		return ParseInputEvent(inputEventAction)
	end
	local initialized = false
	--[[
		*
			 * Initialize the input manager system
			 * Must be called before using any other functionality
			 
	]]
	local function Initialize()
		if initialized then
			return nil
		end
		initialized = true
		ContextActionService:BindActionAtPriority(ContextActionResources.ACTIONS_READER_NAME, OnInput, false, ActionResources.DEFAULT_INPUT_PRIORITY, unpack(ActionResources.ALL_KEYCODES))
	end
	_container.Initialize = Initialize
end
return {
	InputManagerController = InputManagerController,
}
