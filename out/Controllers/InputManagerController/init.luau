-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local exports = {}
exports.InputEventData = TS.import(script, script, "InputEventData").default
for _k, _v in TS.import(script, script, "InputManagerController") or {} do
	exports[_k] = _v
end
exports.InputSignal = TS.import(script, script, "InputSignal").default
return exports
