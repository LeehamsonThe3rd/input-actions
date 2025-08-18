-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local ActionsController = TS.import(script, script.Parent.Parent, "Controllers", "ActionsController").ActionsController
local InputContextController = TS.import(script, script.Parent.Parent, "Controllers", "InputContextController").InputContextController
local InputEchoController = TS.import(script, script.Parent.Parent, "Controllers", "InputEchoController").InputEchoController
local InputManagerController = TS.import(script, script.Parent.Parent, "Controllers", "InputManagerController", "InputManagerController").InputManagerController
local KeyCombinationController = TS.import(script, script.Parent.Parent, "Controllers", "KeyCombinationController").KeyCombinationController
local MouseController = TS.import(script, script.Parent.Parent, "Controllers", "MouseController").MouseController
local DeviceTypeHandler = TS.import(script, script.Parent, "DeviceTypeHandler").DeviceTypeHandler
local RawInputHandler = TS.import(script, script.Parent, "RawInputHandler").RawInputHandler
local InputActionsInitializationHelper = {}
do
	local _container = InputActionsInitializationHelper
	local InitMouseController, InitDeviceTypeHandler, InitBasicInputControllers, InitRawInputHandler, InitAdvancedInputControllers
	local function InitAll()
		InitMouseController()
		InitDeviceTypeHandler()
		InitBasicInputControllers()
		InitRawInputHandler()
		InitAdvancedInputControllers()
	end
	_container.InitAll = InitAll
	function InitMouseController()
		MouseController.Initialize()
	end
	_container.InitMouseController = InitMouseController
	function InitDeviceTypeHandler()
		DeviceTypeHandler.Initialize()
	end
	_container.InitDeviceTypeHandler = InitDeviceTypeHandler
	function InitRawInputHandler()
		RawInputHandler.Initialize()
	end
	_container.InitRawInputHandler = InitRawInputHandler
	--[[
		*
			 * InputManagerController
			 * ActionsController
			 
	]]
	function InitBasicInputControllers()
		InputManagerController.Initialize()
		ActionsController.Initialize()
	end
	_container.InitBasicInputControllers = InitBasicInputControllers
	--[[
		*
			 * InputEchoController
			 * KeyCombinationController
			 * InputContextController
			 
	]]
	function InitAdvancedInputControllers()
		InputEchoController.Initialize()
		KeyCombinationController.Initialize()
		InputContextController.Initialize()
	end
	_container.InitAdvancedInputControllers = InitAdvancedInputControllers
	--[[
		*
			 * Apply default input maps for standard UI navigation
			 
	]]
	local function ApplyDefaultInputMaps()
		InputContextController.ApplyDefaultInputMaps()
	end
	_container.ApplyDefaultInputMaps = ApplyDefaultInputMaps
end
return {
	InputActionsInitializationHelper = InputActionsInitializationHelper,
}
