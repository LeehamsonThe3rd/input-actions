-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local ActionResources = TS.import(script, script.Parent.Parent, "Resources", "ActionResources").ActionResources
local ThumbstickHelper = {}
do
	local _container = ThumbstickHelper
	local DEFAULT_DEAD_ZONE = ActionResources.DEFAULT_THUMBSTICK_DEAD_ZONE
	_container.DEFAULT_DEAD_ZONE = DEFAULT_DEAD_ZONE
	local function ExtractDirectionalStrength(value, min, max, deadZone)
		if deadZone == nil then
			deadZone = DEFAULT_DEAD_ZONE
		end
		if math.abs(value) < deadZone then
			return 0
		end
		local adjustedValue = (math.abs(value) - deadZone) / (1 - deadZone)
		return math.abs(math.clamp(if value < 0 then min else max, 0, 1)) * adjustedValue
	end
	_container.ExtractDirectionalStrength = ExtractDirectionalStrength
	local function ProcessThumbstick(position, deadZone)
		if deadZone == nil then
			deadZone = DEFAULT_DEAD_ZONE
		end
		return {
			Left = ExtractDirectionalStrength(position.X, -1, 0, deadZone),
			Right = ExtractDirectionalStrength(position.X, 0, 1, deadZone),
			Up = ExtractDirectionalStrength(position.Y, 0, 1, deadZone),
			Down = ExtractDirectionalStrength(position.Y, -1, 0, deadZone),
		}
	end
	_container.ProcessThumbstick = ProcessThumbstick
end
return {
	ThumbstickHelper = ThumbstickHelper,
}
