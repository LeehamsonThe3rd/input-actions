-- Compiled with roblox-ts v3.0.0
local ActionResources = {}
do
	local _container = ActionResources
	local NONE_ACTION = "*"
	_container.NONE_ACTION = NONE_ACTION
	local DEFAULT_MIN_PRESS_STRENGTH = 0.5
	_container.DEFAULT_MIN_PRESS_STRENGTH = DEFAULT_MIN_PRESS_STRENGTH
	local DEFAULT_THUMBSTICK_DEAD_ZONE = 0.2
	_container.DEFAULT_THUMBSTICK_DEAD_ZONE = DEFAULT_THUMBSTICK_DEAD_ZONE
	local DEFAULT_INPUT_PRIORITY = 99999
	_container.DEFAULT_INPUT_PRIORITY = DEFAULT_INPUT_PRIORITY
	local DEFAULT_ACTION_UPDATE_PRIORITY = Enum.RenderPriority.First.Value - 1
	_container.DEFAULT_ACTION_UPDATE_PRIORITY = DEFAULT_ACTION_UPDATE_PRIORITY
	local _array = {}
	local _length = #_array
	local _array_1 = Enum.KeyCode:GetEnumItems()
	local _Length = #_array_1
	table.move(_array_1, 1, _Length, _length + 1, _array)
	_length += _Length
	local _array_2 = Enum.UserInputType:GetEnumItems()
	local _Length_1 = #_array_2
	table.move(_array_2, 1, _Length_1, _length + 1, _array)
	_length += _Length_1
	local _array_3 = Enum.PlayerActions:GetEnumItems()
	table.move(_array_3, 1, #_array_3, _length + 1, _array)
	local ALL_KEYCODES = _array
	_container.ALL_KEYCODES = ALL_KEYCODES
end
return {
	ActionResources = ActionResources,
}
