--!native
--!optimize 2
-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local ArrayTools = TS.import(script, TS.getModule(script, "@rbxts", "tool_pack")).ArrayTools
local DEFAULT_SUBSCRIPTION_PRIORITY = 1
local notSkipStrategies = {
	[0] = function()
		return true
	end,
	[1] = function(inputEvent)
		local _inputKeyCode = inputEvent.InputKeyCode
		return typeof(_inputKeyCode) ~= "string"
	end,
	[2] = function(inputEvent)
		return not inputEvent.Changed
	end,
	[3] = function(inputEvent)
		return inputEvent.Changed
	end,
	[4] = function(inputEvent)
		local _inputKeyCode = inputEvent.InputKeyCode
		return typeof(_inputKeyCode) == "string"
	end,
	[5] = function(inputEvent)
		local _condition = not inputEvent.Changed
		if not _condition then
			local _inputKeyCode = inputEvent.InputKeyCode
			_condition = typeof(_inputKeyCode) == "string"
		end
		return _condition
	end,
}
local InputSignal
do
	InputSignal = setmetatable({}, {
		__tostring = function()
			return "InputSignal"
		end,
	})
	InputSignal.__index = InputSignal
	function InputSignal.new(...)
		local self = setmetatable({}, InputSignal)
		return self:constructor(...) or self
	end
	function InputSignal:constructor()
		self.subscriptions = {}
	end
	function InputSignal:Subscribe(callback, priority, subscriptionType)
		if priority == nil then
			priority = DEFAULT_SUBSCRIPTION_PRIORITY
		end
		if subscriptionType == nil then
			subscriptionType = 2
		end
		local value = { callback, subscriptionType, priority }
		ArrayTools.SortedInsert(self.subscriptions, value, function(currentValue, b)
			return currentValue[3] > b[3]
		end)
		return function()
			return ArrayTools.RemoveElementFromArray(self.subscriptions, value)
		end
	end
	function InputSignal:Fire(inputEvent)
		for _, _binding in table.clone(self.subscriptions) do
			local callback = _binding[1]
			local subscriptionType = _binding[2]
			local notSkipStrategy = notSkipStrategies[subscriptionType]
			if not notSkipStrategy(inputEvent) then
				continue
			end
			local success, result = pcall(callback, inputEvent)
			if not success then
				warn(result)
				continue
			end
			if result == Enum.ContextActionResult.Sink then
				return result
			end
		end
		return Enum.ContextActionResult.Pass
	end
end
return {
	default = InputSignal,
}
