-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local TableTools = TS.import(script, TS.getModule(script, "@rbxts", "tool_pack")).TableTools
local DeviceTypeHandler = TS.import(script, script.Parent.Parent, "Utils", "DeviceTypeHandler").DeviceTypeHandler
local InputKeyCodeHelper = TS.import(script, script.Parent.Parent, "Utils", "InputKeyCodeHelper").InputKeyCodeHelper
local ActionsController = TS.import(script, script.Parent, "ActionsController").ActionsController
--[[
	*
	 * A collection of input maps that can be assigned/unassigned as a group
	 
]]
local InputContext
do
	InputContext = setmetatable({}, {
		__tostring = function()
			return "InputContext"
		end,
	})
	InputContext.__index = InputContext
	function InputContext.new(...)
		local self = setmetatable({}, InputContext)
		return self:constructor(...) or self
	end
	function InputContext:constructor(_name)
		self._name = _name
		self._maps = {}
		self._assigned = false
	end
	function InputContext:Add(actionName, map)
		local __maps = self._maps
		local _actionName = actionName
		local _map = map
		__maps[_actionName] = _map
		if self._assigned then
			self:AssignSingleMap(actionName, map)
		end
		return self
	end
	function InputContext:UpdateKeys(actionName, inputType, keyCodes)
		local __maps = self._maps
		local _actionName = actionName
		local map = __maps[_actionName]
		if not map then
			warn(`Cannot update key for non-existent map: {actionName}`)
			return self
		end
		-- If the action is currently assigned, remove the old key
		if self._assigned then
			local oldKey = map[inputType]
			if oldKey ~= nil then
				-- ▼ ReadonlyArray.forEach ▼
				local _callback = function(key)
					ActionsController.EraseKeyCode(actionName, key)
				end
				for _k, _v in oldKey do
					_callback(_v, _k - 1, oldKey)
				end
				-- ▲ ReadonlyArray.forEach ▲
			end
		end
		-- Create a new map with the updated key
		local _object = table.clone(map)
		setmetatable(_object, nil)
		_object[inputType] = keyCodes
		local newMap = _object
		local __maps_1 = self._maps
		local _actionName_1 = actionName
		__maps_1[_actionName_1] = newMap
		-- If assigned, bind the new key
		if self._assigned and keyCodes ~= nil then
			-- ▼ ReadonlyArray.forEach ▼
			local _callback = function(keyCode)
				ActionsController.AddKeyCode(actionName, keyCode)
			end
			for _k, _v in keyCodes do
				_callback(_v, _k - 1, keyCodes)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end
		return self
	end
	function InputContext:GetInputKeysForCurrentDevice(actionName)
		local map = self:GetMap(actionName)
		if map == nil then
			return nil
		end
		local currentInputType = DeviceTypeHandler.GetMainInputType()
		if currentInputType == 0 then
			return map.Gamepad
		end
		if currentInputType == 2 then
			return map.KeyboardAndMouse
		end
		return nil
	end
	function InputContext:GetVisualData(actionName, useCustomImages)
		if useCustomImages == nil then
			useCustomImages = true
		end
		local _result = self:GetInputKeysForCurrentDevice(actionName)
		if _result ~= nil then
			-- ▼ ReadonlyArray.map ▼
			local _newValue = table.create(#_result)
			local _callback = function(key)
				return InputKeyCodeHelper.GetVisualInputKeyCodeData(key, useCustomImages)
			end
			for _k, _v in _result do
				_newValue[_k] = _callback(_v, _k - 1, _result)
			end
			-- ▲ ReadonlyArray.map ▲
			_result = _newValue
		end
		return _result
	end
	function InputContext:HasAction(actionName)
		local __maps = self._maps
		local _actionName = actionName
		return __maps[_actionName] ~= nil
	end
	function InputContext:ToggleAssignment()
		if self._assigned then
			self:Unassign()
		else
			self:Assign()
		end
		return self._assigned
	end
	function InputContext:IsAnyActionPressed(deviceType)
		for actionName in self._maps do
			if ActionsController.IsPressed(actionName) then
				return true
			end
		end
		return false
	end
	function InputContext:GetDeviceKey(actionName, deviceType)
		local map = self:GetMap(actionName)
		if not map then
			return nil
		end
		return map[deviceType]
	end
	function InputContext:Remove(actionName)
		local _condition = self._assigned
		if _condition then
			local __maps = self._maps
			local _actionName = actionName
			_condition = __maps[_actionName] ~= nil
		end
		if _condition then
			self:UnassignSingleMap(actionName)
		end
		local __maps = self._maps
		local _actionName = actionName
		__maps[_actionName] = nil
		return self
	end
	function InputContext:Assign()
		if self._assigned then
			return self
		end
		for actionName, map in self._maps do
			self:AssignSingleMap(actionName, map)
		end
		self._assigned = true
		return self
	end
	function InputContext:Unassign()
		if not self._assigned then
			return self
		end
		for actionName in self._maps do
			self:UnassignSingleMap(actionName)
		end
		self._assigned = false
		return self
	end
	function InputContext:IsAssigned()
		return self._assigned
	end
	function InputContext:GetMaps()
		return self._maps
	end
	function InputContext:GetMap(actionName)
		local __maps = self._maps
		local _actionName = actionName
		return __maps[_actionName]
	end
	function InputContext:GetName()
		return self._name
	end
	function InputContext:GetAllMappedActions()
		return TableTools.GetKeys(self._maps)
	end
	function InputContext:AssignSingleMap(actionName, map)
		if not ActionsController.IsExisting(actionName) then
			ActionsController.Add(actionName)
		end
		if map.KeyboardAndMouse ~= nil then
			local _exp = map.KeyboardAndMouse
			-- ▼ ReadonlyArray.forEach ▼
			local _callback = function(keyCode)
				ActionsController.AddKeyCode(actionName, keyCode)
			end
			for _k, _v in _exp do
				_callback(_v, _k - 1, _exp)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end
		if map.Gamepad ~= nil then
			local _exp = map.Gamepad
			-- ▼ ReadonlyArray.forEach ▼
			local _callback = function(keyCode)
				ActionsController.AddKeyCode(actionName, keyCode)
			end
			for _k, _v in _exp do
				_callback(_v, _k - 1, _exp)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end
	end
	function InputContext:UnassignSingleMap(actionName)
		local __maps = self._maps
		local _actionName = actionName
		local map = __maps[_actionName]
		if not map then
			return nil
		end
		if map.KeyboardAndMouse ~= nil then
			local _exp = map.KeyboardAndMouse
			-- ▼ ReadonlyArray.forEach ▼
			local _callback = function(keyCode)
				ActionsController.EraseKeyCode(actionName, keyCode)
			end
			for _k, _v in _exp do
				_callback(_v, _k - 1, _exp)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end
		if map.Gamepad ~= nil then
			local _exp = map.Gamepad
			-- ▼ ReadonlyArray.forEach ▼
			local _callback = function(keyCode)
				ActionsController.EraseKeyCode(actionName, keyCode)
			end
			for _k, _v in _exp do
				_callback(_v, _k - 1, _exp)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end
	end
end
--[[
	*
	 * Manages multiple input contexts and provides a global context
	 
]]
local InputContextController = {}
do
	local _container = InputContextController
	local contexts = {}
	local GlobalContext = InputContext.new("Global")
	_container.GlobalContext = GlobalContext
	GlobalContext:Assign()
	-- Combined UI context instead of separate contexts
	local UiControlContext = InputContext.new("UIControls")
	_container.UiControlContext = UiControlContext
	-- Setup navigation controls
	UiControlContext:Add("UiGoUp", {
		Gamepad = { Enum.KeyCode.DPadUp },
		KeyboardAndMouse = { Enum.KeyCode.Up },
	})
	UiControlContext:Add("UiGoDown", {
		Gamepad = { Enum.KeyCode.DPadDown },
		KeyboardAndMouse = { Enum.KeyCode.Down },
	})
	UiControlContext:Add("UiGoLeft", {
		Gamepad = { Enum.KeyCode.DPadLeft },
		KeyboardAndMouse = { Enum.KeyCode.Left },
	})
	UiControlContext:Add("UiGoRight", {
		Gamepad = { Enum.KeyCode.DPadRight },
		KeyboardAndMouse = { Enum.KeyCode.Right },
	})
	-- Setup action controls
	UiControlContext:Add("UiAccept", {
		Gamepad = { Enum.KeyCode.ButtonA },
		KeyboardAndMouse = { Enum.KeyCode.Return },
	})
	UiControlContext:Add("UiCancel", {
		Gamepad = { Enum.KeyCode.ButtonB },
		KeyboardAndMouse = { Enum.KeyCode.B },
	})
	-- Setup scrolling controls
	UiControlContext:Add("UiScrollUp", {
		Gamepad = { "Thumbstick2Up" },
		KeyboardAndMouse = { Enum.KeyCode.W },
	})
	UiControlContext:Add("UiScrollDown", {
		Gamepad = { "Thumbstick2Down" },
		KeyboardAndMouse = { Enum.KeyCode.S },
	})
	UiControlContext:Add("UiNextPage", {
		Gamepad = { Enum.KeyCode.ButtonR1 },
		KeyboardAndMouse = { Enum.KeyCode.E },
	})
	UiControlContext:Add("UiPreviousPage", {
		Gamepad = { Enum.KeyCode.ButtonL1 },
		KeyboardAndMouse = { Enum.KeyCode.Q },
	})
	-- Setup debug controls
	UiControlContext:Add("MouseDebugMode", {
		KeyboardAndMouse = { Enum.KeyCode.LeftAlt },
	})
	--[[
		*
			 * Apply the default UI control mappings
			 
	]]
	local function ApplyDefaultInputMaps()
		UiControlContext:Assign()
	end
	_container.ApplyDefaultInputMaps = ApplyDefaultInputMaps
	--[[
		*
			 * Create a new named input context
			 
	]]
	local function CreateContext(name)
		local _name = name
		if contexts[_name] ~= nil then
			warn(`Context '{name}' already exists, returning existing one.`)
			local _name_1 = name
			return contexts[_name_1]
		end
		local context = InputContext.new(name)
		local _name_1 = name
		contexts[_name_1] = context
		return context
	end
	_container.CreateContext = CreateContext
	--[[
		*
			 * Get an existing context by name
			 
	]]
	local function GetContext(name)
		local _name = name
		return contexts[_name]
	end
	_container.GetContext = GetContext
	--[[
		*
			 * Get the global input context
			 
	]]
	local function GetGlobalContext()
		return GlobalContext
	end
	_container.GetGlobalContext = GetGlobalContext
	--[[
		*
			 * Get all registered contexts
			 
	]]
	local function GetAllContexts()
		return contexts
	end
	_container.GetAllContexts = GetAllContexts
	--[[
		*
			 * Assign a context by name
			 
	]]
	local function AssignContext(name)
		local _name = name
		local context = contexts[_name]
		if not context then
			warn(`Context '{name}' does not exist.`)
			return false
		end
		context:Assign()
		return true
	end
	_container.AssignContext = AssignContext
	--[[
		*
			 * Unassign a context by name
			 
	]]
	local function UnassignContext(name)
		local _name = name
		local context = contexts[_name]
		if not context then
			warn(`Context '{name}' does not exist.`)
			return false
		end
		context:Unassign()
		return true
	end
	_container.UnassignContext = UnassignContext
	--[[
		*
			 * Initialize the input context controller
			 
	]]
	local function Initialize()
		-- Nothing to initialize currently
	end
	_container.Initialize = Initialize
end
return {
	InputContext = InputContext,
	InputContextController = InputContextController,
}
