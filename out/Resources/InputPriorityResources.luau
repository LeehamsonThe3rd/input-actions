-- Compiled with roblox-ts v3.0.0
--[[
	*
	 * Defines priority constants for various input operations
	 
]]
local InputPriorityResources = {}
do
	local _container = InputPriorityResources
	--[[
		*
			 * Priority for key combination handlers (higher than normal input)
			 
	]]
	local KEY_COMBINATION_PRIORITY = 1000
	_container.KEY_COMBINATION_PRIORITY = KEY_COMBINATION_PRIORITY
	--[[
		*
			 * Default delay for auto-repeat in seconds
			 
	]]
	local DEFAULT_KEY_REPEAT_DELAY = 0.1
	_container.DEFAULT_KEY_REPEAT_DELAY = DEFAULT_KEY_REPEAT_DELAY
	--[[
		*
			 * Default release delay for key combinations
			 
	]]
	local KEY_COMBINATION_RELEASE_DELAY = 0.1
	_container.KEY_COMBINATION_RELEASE_DELAY = KEY_COMBINATION_RELEASE_DELAY
end
return {
	InputPriorityResources = InputPriorityResources,
}
