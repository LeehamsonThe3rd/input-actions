--!native
--!optimize 2
-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local RunService = TS.import(script, TS.getModule(script, "@rbxts", "services")).RunService
local _tool_pack = TS.import(script, TS.getModule(script, "@rbxts", "tool_pack"))
local ArrayTools = _tool_pack.ArrayTools
local TableTools = _tool_pack.TableTools
local ActionResources = TS.import(script, script.Parent.Parent, "Resources", "ActionResources").ActionResources
local InputConfigController = TS.import(script, script.Parent, "InputConfigController").InputConfigController
local InputEchoController = TS.import(script, script.Parent, "InputEchoController").InputEchoController
--[[
	*
	 * Controller for managing input actions
	 *
	 * The ActionsController handles the registration, triggering, and state tracking
	 * of named actions that can be bound to input keys.
	 
]]
local ActionsController = {}
do
	local _container = ActionsController
	-- Maps action names to their data
	local actionsMap = {}
	-- Maps input key codes to the actions they trigger
	local keyCodeToActionsReferences = {}
	local initialized = false
	--[[
		*
			 * Initialize the actions controller
			 * Must be called before using any other functionality
			 
	]]
	local Update
	local function Initialize()
		if initialized then
			return nil
		end
		initialized = true
		RunService:BindToRenderStep("_ActionsUpdate_", ActionResources.DEFAULT_ACTION_UPDATE_PRIORITY, Update)
	end
	_container.Initialize = Initialize
	--[[
		*
			 * Executes a callback with the action data for a given action name
			 * Warns if the action doesn't exist
			 
	]]
	local GetActionData
	local function ExecuteWithActionData(actionName, callback)
		local actionData = GetActionData(actionName)
		if actionData ~= nil then
			callback(actionData)
			return nil
		end
		warn(`Tries to execute with non-existent action: {actionName}`)
	end
	--[[
		*
			 * Gets the action data for a given action name
			 * Warns if the action doesn't exist
			 
	]]
	function GetActionData(actionName)
		local _actionName = actionName
		local actionData = actionsMap[_actionName]
		if actionData == nil then
			warn(`Action: {actionName} doesn't exist`)
		end
		return actionData
	end
	--[[
		*
			 * Sets an action as pressed with the given strength
			 
	]]
	local function Press(actionName, strength)
		if strength == nil then
			strength = 1
		end
		ExecuteWithActionData(actionName, function(actionTable)
			actionTable.KeyBuffer[1] = strength
		end)
	end
	_container.Press = Press
	--[[
		*
			 * Gets the current press strength of an action
			 * @returns Press strength between 0 and 1, or 0 if action doesn't exist
			 
	]]
	local function GetPressStrength(actionName)
		local actionData = GetActionData(actionName)
		if actionData == nil then
			return 0
		end
		return actionData.KeyBuffer[2]
	end
	_container.GetPressStrength = GetPressStrength
	local function Release(actionName)
		ExecuteWithActionData(actionName, function(action_table)
			-- Sets the current status to release
			action_table.KeyBuffer[1] = 0
		end)
	end
	_container.Release = Release
	local function IsPressed(actionName)
		local actionData = GetActionData(actionName)
		if actionData == nil then
			return false
		end
		-- Use InputConfigController for activation threshold if available
		local threshold = InputConfigController.GetActionActivationThreshold(actionName)
		return actionData.KeyBuffer[2] >= threshold
	end
	_container.IsPressed = IsPressed
	--*NOT RECOMMENDED TO USE (InternalOnly) Low level of checking if the action is pressed in this frame 
	local function IsPressedThisFrame(actionName)
		local actionData = GetActionData(actionName)
		if actionData == nil then
			return false
		end
		return actionData.KeyBuffer[1] >= actionData.ActivationStrength
	end
	_container.IsPressedThisFrame = IsPressedThisFrame
	--*NOT RECOMMENDED TO USE (InternalOnly) Low level of checking if the action is just pressed in this frame 
	local function IsJustPressedThisFrame(actionName)
		local actionData = GetActionData(actionName)
		if actionData == nil then
			return false
		end
		return actionData.KeyBuffer[1] >= actionData.ActivationStrength and actionData.KeyBuffer[2] < actionData.ActivationStrength
	end
	_container.IsJustPressedThisFrame = IsJustPressedThisFrame
	local function IsReleased(actionName)
		return not IsPressed(actionName)
	end
	_container.IsReleased = IsReleased
	--*Low level of checking if the action is released in this frame 
	local function IsReleasedThisFrame(actionName)
		local actionData = GetActionData(actionName)
		if actionData == nil then
			return false
		end
		return actionData.KeyBuffer[1] < actionData.ActivationStrength
	end
	_container.IsReleasedThisFrame = IsReleasedThisFrame
	--*Low level of checking if the action is just released in this frame 
	local function IsJustReleasedThisFrame(actionName)
		local actionData = GetActionData(actionName)
		if actionData == nil then
			return false
		end
		return actionData.KeyBuffer[1] < actionData.ActivationStrength and actionData.KeyBuffer[2] >= actionData.ActivationStrength
	end
	_container.IsJustReleasedThisFrame = IsJustReleasedThisFrame
	local function IsJustPressed(actionName)
		local actionData = GetActionData(actionName)
		if actionData == nil then
			return false
		end
		-- Check for regular just-pressed status
		local justPressed = actionData.KeyBuffer[2] >= actionData.ActivationStrength and actionData.KeyBuffer[3] < actionData.ActivationStrength
		-- Also return true if an echo was triggered for this action
		return justPressed or InputEchoController.WasEchoTriggered(actionName)
	end
	_container.IsJustPressed = IsJustPressed
	local function IsJustReleased(actionName)
		local actionData = GetActionData(actionName)
		if actionData == nil then
			return false
		end
		--was released in the previous frame, but was pressed in the pre-previos
		return actionData.KeyBuffer[2] < actionData.ActivationStrength and actionData.KeyBuffer[3] >= actionData.ActivationStrength
	end
	_container.IsJustReleased = IsJustReleased
	--[[
		*
			 * Updates the input buffer for all actions
			 * Called once per frame
			 
	]]
	function Update()
		for _, action_table in actionsMap do
			-- Shift values in the key buffer:
			-- 0 - current input
			-- 1 - previous input
			-- 2 - pre-previous input
			local _exp = action_table.KeyBuffer
			local _exp_1 = action_table.KeyBuffer
			_exp[3], _exp_1[2] = action_table.KeyBuffer[2], action_table.KeyBuffer[1]
		end
	end
	local AddKeyCode
	local function Add(actionName, activationStrength, keyCodes)
		if activationStrength == nil then
			activationStrength = ActionResources.DEFAULT_MIN_PRESS_STRENGTH
		end
		if keyCodes == nil then
			keyCodes = {}
		end
		local _actionName = actionName
		if actionsMap[_actionName] ~= nil then
			warn(`Action {actionName} already exists`)
			return nil
		end
		local _arg0 = {
			Keycodes = {},
			KeyBuffer = { 0, 0, 0 },
			ActivationStrength = activationStrength,
		}
		local actionData = _arg0
		local _actionName_1 = actionName
		actionsMap[_actionName_1] = actionData
		-- Register with InputConfigController
		InputConfigController.SetActionActivationThreshold(actionName, activationStrength)
		for _, keyCode in keyCodes do
			AddKeyCode(actionName, keyCode)
		end
	end
	_container.Add = Add
	local function AddKeyCodeToActionReference(keyCode, actionName)
		local _exp = TableTools.GetOrCreate(keyCodeToActionsReferences, keyCode, function()
			return {}
		end)
		local _actionName = actionName
		table.insert(_exp, _actionName)
	end
	local function EraseKeyCodeToActionReference(keyCode, actionName)
		local _keyCode = keyCode
		local keyCode_to_actions_reference = keyCodeToActionsReferences[_keyCode]
		if keyCode_to_actions_reference == nil then
			return nil
		end
		ArrayTools.RemoveElementFromArray(keyCode_to_actions_reference, actionName)
		if not (#keyCode_to_actions_reference == 0) then
			return nil
		end
		local _keyCode_1 = keyCode
		keyCodeToActionsReferences[_keyCode_1] = nil
	end
	function AddKeyCode(actionName, keyCode)
		ExecuteWithActionData(actionName, function(actionData)
			local _keycodes = actionData.Keycodes
			local _keyCode = keyCode
			if table.find(_keycodes, _keyCode) ~= nil then
				warn(`Action {actionName} already includes keycode {keyCode}`)
				return nil
			end
			local _keycodes_1 = actionData.Keycodes
			local _keyCode_1 = keyCode
			table.insert(_keycodes_1, _keyCode_1)
			AddKeyCodeToActionReference(keyCode, actionName)
		end)
	end
	_container.AddKeyCode = AddKeyCode
	local function EraseKeyCode(actionName, keyCode)
		ExecuteWithActionData(actionName, function(actionData)
			local _keycodes = actionData.Keycodes
			local _keyCode = keyCode
			if not (table.find(_keycodes, _keyCode) ~= nil) then
				return nil
			end
			ArrayTools.RemoveElementFromArray(actionData.Keycodes, keyCode)
			EraseKeyCodeToActionReference(keyCode, actionName)
		end)
	end
	_container.EraseKeyCode = EraseKeyCode
	local function EraseAllKeyCodes(actionName)
		ExecuteWithActionData(actionName, function(actionData)
			for _, keyCode in actionData.Keycodes do
				EraseKeyCodeToActionReference(keyCode, actionName)
			end
			actionData.Keycodes = {}
		end)
	end
	_container.EraseAllKeyCodes = EraseAllKeyCodes
	local function GetKeyCodes(actionName)
		local _result = GetActionData(actionName)
		if _result ~= nil then
			_result = _result.Keycodes
		end
		local _condition = _result
		if _condition == nil then
			_condition = {}
		end
		return _condition
	end
	_container.GetKeyCodes = GetKeyCodes
	local function HasKeyCode(actionName, keyCode)
		local _actionName = actionName
		local _result = actionsMap[_actionName]
		if _result ~= nil then
			local _keycodes = _result.Keycodes
			local _keyCode = keyCode
			_result = table.find(_keycodes, _keyCode) ~= nil
		end
		return _result
	end
	_container.HasKeyCode = HasKeyCode
	local function IsExisting(actionName)
		local _actionName = actionName
		return actionsMap[_actionName] ~= nil
	end
	_container.IsExisting = IsExisting
	local function GetActionsFromKeyCode(keyCode)
		local _keyCode = keyCode
		local _condition = keyCodeToActionsReferences[_keyCode]
		if _condition == nil then
			_condition = {}
		end
		return _condition
	end
	_container.GetActionsFromKeyCode = GetActionsFromKeyCode
	local function SetActivationStrength(actionName, activationStrength)
		local actionData = GetActionData(actionName)
		if actionData == nil then
			return nil
		end
		actionData.ActivationStrength = activationStrength
	end
	_container.SetActivationStrength = SetActivationStrength
	local function Erase(actionName)
		EraseAllKeyCodes(actionName)
		local _actionName = actionName
		actionsMap[_actionName] = nil
	end
	_container.Erase = Erase
	local function GetActions()
		return TableTools.GetKeys(actionsMap)
	end
	_container.GetActions = GetActions
end
return {
	ActionsController = ActionsController,
}
