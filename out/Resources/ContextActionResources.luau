-- Compiled with roblox-ts v3.0.0
--[[
	*
	 * Constants for context action names
	 
]]
local ContextActionResources = {}
do
	local _container = ContextActionResources
	--[[
		*
			 * Name for the main input actions reader
			 
	]]
	local ACTIONS_READER_NAME = "ActionsReader"
	_container.ACTIONS_READER_NAME = ACTIONS_READER_NAME
	--[[
		*
			 * Name for the input echo handler
			 
	]]
	local INPUT_ECHO_HANDLER_NAME = "InputEchoHandler"
	_container.INPUT_ECHO_HANDLER_NAME = INPUT_ECHO_HANDLER_NAME
	--[[
		*
			 * Name for the mouse controller update
			 
	]]
	local MOUSE_CONTROLLER_UPDATE = "MouseControllerUpdate"
	_container.MOUSE_CONTROLLER_UPDATE = MOUSE_CONTROLLER_UPDATE
	--[[
		*
			 * Name for the input controller update
			 
	]]
	local INPUT_CONTROLLER_UPDATE = "FetchInput"
	_container.INPUT_CONTROLLER_UPDATE = INPUT_CONTROLLER_UPDATE
end
return {
	ContextActionResources = ContextActionResources,
}
