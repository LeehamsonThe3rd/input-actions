--!native
--!optimize 2
-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local UserInputService = TS.import(script, TS.getModule(script, "@rbxts", "services")).UserInputService
local ActionResources = TS.import(script, script.Parent.Parent.Parent, "Resources", "ActionResources").ActionResources
local InputKeyCodeHelper = TS.import(script, script.Parent.Parent.Parent, "Utils", "InputKeyCodeHelper").InputKeyCodeHelper
local ActionsController = TS.import(script, script.Parent.Parent, "ActionsController").ActionsController
--[[
	*
	 * Represents an input event that can be handled by input processors
	 * Similar to Godot's InputEvent class
	 
]]
local InputEvent
do
	InputEvent = setmetatable({}, {
		__tostring = function()
			return "InputEvent"
		end,
	})
	InputEvent.__index = InputEvent
	function InputEvent.new(...)
		local self = setmetatable({}, InputEvent)
		return self:constructor(...) or self
	end
	function InputEvent:constructor(inputEventAction)
		--fetching data from the input event action
		self.InputKeyCode = inputEventAction.InputKeyCode
		self.Position = inputEventAction.Position
		self.Delta = inputEventAction.Delta
		self.PressStrength = inputEventAction.PressStrength
		self.UserInputType = inputEventAction.UserInputType
		self.Changed = inputEventAction.Changed
		self.Timestamp = os.clock()
		local action = inputEventAction.Action
		if action ~= ActionResources.NONE_ACTION then
			self.Actions = { action }
		else
			self.Actions = table.clone(ActionsController.GetActionsFromKeyCode(self.InputKeyCode))
		end
		table.freeze(self.Actions)
		return table.freeze(self)
	end
	function InputEvent:AsText()
		return InputKeyCodeHelper.GetInputKeyCodeName(self.InputKeyCode)
	end
	function InputEvent:IsAction(actionName)
		local _actions = self.Actions
		local _actionName = actionName
		return table.find(_actions, _actionName) ~= nil
	end
	function InputEvent:IsActionPressed(actionName)
		local _actions = self.Actions
		local _actionName = actionName
		if not (table.find(_actions, _actionName) ~= nil) then
			return false
		end
		return ActionsController.IsPressedThisFrame(actionName)
	end
	function InputEvent:IsActionJustPressed(actionName)
		local _actions = self.Actions
		local _actionName = actionName
		if not (table.find(_actions, _actionName) ~= nil) then
			return false
		end
		return ActionsController.IsJustPressedThisFrame(actionName)
	end
	function InputEvent:IsActionReleased(actionName)
		local _actions = self.Actions
		local _actionName = actionName
		if not (table.find(_actions, _actionName) ~= nil) then
			return false
		end
		return ActionsController.IsReleasedThisFrame(actionName)
	end
	function InputEvent:IsActionJustReleased(actionName)
		local _actions = self.Actions
		local _actionName = actionName
		if not (table.find(_actions, _actionName) ~= nil) then
			return false
		end
		return ActionsController.IsJustReleasedThisFrame(actionName)
	end
	function InputEvent:ContainsActions()
		return not (#self.Actions == 0)
	end
	function InputEvent:IsPressed(activationStrength)
		if activationStrength == nil then
			activationStrength = ActionResources.DEFAULT_MIN_PRESS_STRENGTH
		end
		return self.PressStrength >= activationStrength
	end
	function InputEvent:IsReleased(activationStrength)
		if activationStrength == nil then
			activationStrength = ActionResources.DEFAULT_MIN_PRESS_STRENGTH
		end
		return self.PressStrength < activationStrength
	end
	function InputEvent:IsKeyModifierPressed(modifier)
		if modifier == Enum.ModifierKey.Alt then
			return UserInputService:IsKeyDown(Enum.KeyCode.LeftAlt) or UserInputService:IsKeyDown(Enum.KeyCode.RightAlt)
		elseif modifier == Enum.ModifierKey.Ctrl then
			return UserInputService:IsKeyDown(Enum.KeyCode.LeftControl) or UserInputService:IsKeyDown(Enum.KeyCode.RightControl)
		elseif modifier == Enum.ModifierKey.Shift then
			return UserInputService:IsKeyDown(Enum.KeyCode.LeftShift) or UserInputService:IsKeyDown(Enum.KeyCode.RightShift)
		elseif modifier == Enum.ModifierKey.Meta then
			return UserInputService:IsKeyDown(Enum.KeyCode.LeftMeta) or UserInputService:IsKeyDown(Enum.KeyCode.RightMeta)
		end
		return false
	end
end
return {
	default = InputEvent,
}
