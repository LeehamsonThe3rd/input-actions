-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local UserInputService = TS.import(script, TS.getModule(script, "@rbxts", "services")).UserInputService
local InputPriorityResources = TS.import(script, script.Parent.Parent, "Resources", "InputPriorityResources").InputPriorityResources
local ActionsController = TS.import(script, script.Parent, "ActionsController").ActionsController
local InputManagerController = TS.import(script, script.Parent, "InputManagerController", "InputManagerController").InputManagerController
--[[
	*
	 * Controller for handling key combinations/chords
	 
]]
local KeyCombinationController = {}
do
	local _container = KeyCombinationController
	local keyCombinations = {}
	local initialized = false
	--[[
		*
			 * Initializes the key combination controller
			 
	]]
	local HandleKeyInput
	local function Initialize()
		if initialized then
			return nil
		end
		initialized = true
		-- Subscribe to input events with high priority
		InputManagerController.Subscribe(HandleKeyInput, {
			Priority = InputPriorityResources.KEY_COMBINATION_PRIORITY,
		})
	end
	_container.Initialize = Initialize
	--[[
		*
			 * Registers a new key combination
			 
	]]
	local function RegisterCombination(actionName, mainKey, modifiers)
		if modifiers == nil then
			modifiers = {}
		end
		-- Create the action if it doesn't exist
		if not ActionsController.IsExisting(actionName) then
			ActionsController.Add(actionName)
		end
		-- Register the combination
		local _arg0 = {
			MainKey = mainKey,
			Modifiers = modifiers,
			ActionName = actionName,
		}
		table.insert(keyCombinations, _arg0)
	end
	_container.RegisterCombination = RegisterCombination
	--[[
		*
			 * Checks if all modifiers for a combination are currently pressed
			 
	]]
	local function AreModifiersPressed(modifiers)
		for _, modifier in modifiers do
			if not UserInputService:IsKeyDown(modifier) then
				return false
			end
		end
		return true
	end
	--[[
		*
			 * Handles input events to detect key combinations
			 
	]]
	function HandleKeyInput(inputEvent)
		-- Only process key presses, not releases
		if not inputEvent:IsPressed() then
			return nil
		end
		-- Check each registered combination
		for _, combo in keyCombinations do
			if inputEvent.InputKeyCode == combo.MainKey then
				if AreModifiersPressed(combo.Modifiers) then
					-- Combination detected, trigger the action
					ActionsController.Press(combo.ActionName)
					-- Release it after a brief delay to simulate a press
					task.delay(InputPriorityResources.KEY_COMBINATION_RELEASE_DELAY, function()
						ActionsController.Release(combo.ActionName)
					end)
					-- Sink the input to prevent the main key from triggering its normal action
					return Enum.ContextActionResult.Sink
				end
			end
		end
	end
end
return {
	KeyCombinationController = KeyCombinationController,
}
