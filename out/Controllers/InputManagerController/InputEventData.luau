--!native
--!optimize 2
-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local ActionResources = TS.import(script, script.Parent.Parent.Parent, "Resources", "ActionResources").ActionResources
local InputEventData
do
	InputEventData = setmetatable({}, {
		__tostring = function()
			return "InputEventData"
		end,
	})
	InputEventData.__index = InputEventData
	function InputEventData.new(...)
		local self = setmetatable({}, InputEventData)
		return self:constructor(...) or self
	end
	function InputEventData:constructor(keycode, action, userInputType)
		self.InputKeyCode = Enum.UserInputType.None
		self.UserInputType = Enum.UserInputType.None
		self.Action = ActionResources.NONE_ACTION
		self.Changed = false
		self.PressStrength = 0
		self.Position = Vector3.zero
		self.Delta = Vector3.zero
		self.InputKeyCode = keycode or self.InputKeyCode
		local _condition = action
		if _condition == nil then
			_condition = self.Action
		end
		self.Action = _condition
		self.UserInputType = userInputType or self.UserInputType
	end
	function InputEventData:FromInputKeyCode(inputKeyCode, userInputType)
		return self.new(inputKeyCode, nil, userInputType)
	end
	function InputEventData:FromAction(actionName)
		return self.new(nil, actionName)
	end
end
return {
	default = InputEventData,
}
