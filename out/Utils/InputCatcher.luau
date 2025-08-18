-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local ContextActionService = _services.ContextActionService
local HttpService = _services.HttpService
local ActionResources = TS.import(script, script.Parent.Parent, "Resources", "ActionResources").ActionResources
local function SinkKey()
	return Enum.ContextActionResult.Sink
end
local InputCatcher
do
	InputCatcher = setmetatable({}, {
		__tostring = function()
			return "InputCatcher"
		end,
	})
	InputCatcher.__index = InputCatcher
	function InputCatcher.new(...)
		local self = setmetatable({}, InputCatcher)
		return self:constructor(...) or self
	end
	function InputCatcher:constructor(priority)
		self._uuid = HttpService:GenerateGUID()
		self._isActive = false
		self._priority = priority
	end
	function InputCatcher:GrabInput()
		ContextActionService:BindActionAtPriority(self._uuid, SinkKey, false, self._priority, unpack(ActionResources.ALL_KEYCODES))
		self._isActive = true
	end
	function InputCatcher:ReleaseInput()
		ContextActionService:UnbindAction(self._uuid)
		self._isActive = false
	end
	function InputCatcher:IsActive()
		return self._isActive
	end
end
return {
	default = InputCatcher,
}
