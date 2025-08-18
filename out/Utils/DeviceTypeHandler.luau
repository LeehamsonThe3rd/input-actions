-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local Players = _services.Players
local UserInputService = _services.UserInputService
local VRService = _services.VRService
local DeviceTypeHandler = {}
do
	local _container = DeviceTypeHandler
	local TOUCH_GUI_WAIT_TIMEOUT = 20
	local INITIAL_WAIT_TIME = 1
	local INPUT_POLL_INTERVAL = 0.1
	local inputTypeChangedEvent = Instance.new("BindableEvent")
	local OnInputTypeChanged = inputTypeChangedEvent.Event
	_container.OnInputTypeChanged = OnInputTypeChanged
	local deviceTypeChangedEvent = Instance.new("BindableEvent")
	local OnDeviceTypeChanged = deviceTypeChangedEvent.Event
	_container.OnDeviceTypeChanged = OnDeviceTypeChanged
	--TODO switch to the latest input type?
	local function GetMainInputType()
		--touch is prioritased
		if UserInputService.TouchEnabled then
			return 1
		elseif UserInputService.GamepadEnabled then
			return 0
		end
		--keyboard and mouse are 3ed
		return 2
	end
	_container.GetMainInputType = GetMainInputType
	local vrEnabled, touchEnabled, jumpButtonHasTabletSize, gamepadEnabled
	local function GetMainDeviceType()
		--vr is prioritased
		if vrEnabled then
			return 3
		elseif touchEnabled then
			--checks whether the jump button has the tablet size(120x120);
			--phone has button size(70x70);
			return if jumpButtonHasTabletSize then 1 else 0
		elseif gamepadEnabled then
			return 2
		end
		--pc is 4th
		return 4
	end
	_container.GetMainDeviceType = GetMainDeviceType
	--*fires the new input type 
	local AsignValues
	local function FireOnInputChangedEvent()
		--gets new values
		AsignValues()
		inputTypeChangedEvent:Fire(GetMainInputType())
		deviceTypeChangedEvent:Fire(GetMainDeviceType())
	end
	local function ExecuteOnChanged(newValue, previousValue, callback)
		--calls the function if different
		if newValue == previousValue then
			return nil
		end
		callback()
		--tells that value changed, so it will tell only once
		return true
	end
	--will try to get the jump button
	local jumpButton
	local mouseEnabled = false
	local keyboardEnabled = false
	gamepadEnabled = false
	touchEnabled = false
	vrEnabled = false
	--[[
		* https://devforum.roblox.com/t/how-can-i-tell-the-difference-between-a-mobile-and-tablet-player/1455628/8
			 *  will be true if the jump button is 120 x 120
			 
	]]
	jumpButtonHasTabletSize = false
	local TryGetJumpButtonSize = TS.async(function()
		local localPlayer = Players.LocalPlayer
		local playerGui = localPlayer:WaitForChild("PlayerGui")
		--waits for touch gui for 20 seconds
		--gui exist even if the character didnt spawn
		local touchGui = playerGui:WaitForChild("TouchGui", TOUCH_GUI_WAIT_TIMEOUT)
		if touchGui == nil then
			return nil
		end
		local touchControlFrame = touchGui:WaitForChild("TouchControlFrame")
		--jump button will always exist;
		jumpButton = touchControlFrame:WaitForChild("JumpButton")
	end)
	--*will return true if the jump button is 120x120;
	local function CheckJumpButtonHasTabletSize()
		if jumpButton == nil then
			return false
		end
		return jumpButton.Size == UDim2.fromOffset(120, 120)
	end
	--compares the old to the new ones
	local function CheckValues()
		--if gets true means input type changed, will stop the function to execute only once
		if ExecuteOnChanged(jumpButtonHasTabletSize, CheckJumpButtonHasTabletSize(), FireOnInputChangedEvent) then
			return nil
		end
		if ExecuteOnChanged(vrEnabled, VRService.VREnabled, FireOnInputChangedEvent) then
			return nil
		end
		if ExecuteOnChanged(mouseEnabled, UserInputService.MouseEnabled, FireOnInputChangedEvent) then
			return nil
		end
		if ExecuteOnChanged(keyboardEnabled, UserInputService.KeyboardEnabled, FireOnInputChangedEvent) then
			return nil
		end
		if ExecuteOnChanged(gamepadEnabled, UserInputService.GamepadEnabled, FireOnInputChangedEvent) then
			return nil
		end
		if ExecuteOnChanged(touchEnabled, UserInputService.TouchEnabled, FireOnInputChangedEvent) then
			return nil
		end
	end
	function AsignValues()
		jumpButtonHasTabletSize = CheckJumpButtonHasTabletSize()
		vrEnabled = VRService.VREnabled
		mouseEnabled = UserInputService.MouseEnabled
		keyboardEnabled = UserInputService.KeyboardEnabled
		gamepadEnabled = UserInputService.GamepadEnabled
		touchEnabled = UserInputService.TouchEnabled
	end
	local initialized = false
	local Initialize = TS.async(function()
		if initialized then
			return nil
		end
		initialized = true
		--to set the value
		task.wait(INITIAL_WAIT_TIME)
		TryGetJumpButtonSize()
		--makes in the slow loop
		while true do
			local _value = task.wait(INPUT_POLL_INTERVAL)
			if not (_value ~= 0 and _value == _value and _value) then
				break
			end
			CheckValues()
			AsignValues()
		end
	end)
	_container.Initialize = Initialize
end
return {
	DeviceTypeHandler = DeviceTypeHandler,
}
