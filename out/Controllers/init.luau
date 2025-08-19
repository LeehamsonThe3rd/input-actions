-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local exports = {}
for _k, _v in TS.import(script, script, "ActionsController") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, script, "InputManagerController") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, script.Parent, "Utils", "DeviceTypeHandler") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, script, "InputContextController") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, script, "MouseController") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, script, "InputEchoController") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, script, "KeyCombinationController") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, script, "HapticFeedbackController") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, script, "InputConfigController") or {} do
	exports[_k] = _v
end
return exports
