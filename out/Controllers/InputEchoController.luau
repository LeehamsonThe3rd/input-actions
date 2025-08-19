-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local RunService = TS.import(script, TS.getModule(script, "@rbxts", "services")).RunService
--[[
	*
	 * Controller for handling input echo/repeat
	 *
	 * Provides functionality to trigger repeated input events when keys are held down
	 
]]
local InputEchoController = {}
do
	local _container = InputEchoController
	local DEFAULT_INITIAL_DELAY = 0.5
	local DEFAULT_REPEAT_INTERVAL = 0.1
	-- Store echo configurations
	local actionEchoConfigs = {}
	-- Track which actions had echoes triggered this frame
	local echoTriggeredActions = {}
	local initialized = false
	local actionsController
	--[[
		*
			 * Initializes the echo controller
			 
	]]
	local Update
	local function Initialize()
		if initialized then
			return nil
		end
		initialized = true
		actionsController = TS.Promise.new(function(resolve)
			resolve(TS.import(script, script.Parent, "ActionsController"))
		end):timeout(10):expect().ActionsController
		RunService.Heartbeat:Connect(Update)
	end
	_container.Initialize = Initialize
	--[[
		*
			 * Configures echo behavior for an action
			 
	]]
	local function ConfigureActionEcho(actionName, initialDelay, repeatInterval)
		if initialDelay == nil then
			initialDelay = DEFAULT_INITIAL_DELAY
		end
		if repeatInterval == nil then
			repeatInterval = DEFAULT_REPEAT_INTERVAL
		end
		local _actionName = actionName
		local _arg1 = {
			InitialDelay = initialDelay,
			RepeatInterval = repeatInterval,
			HeldTime = 0,
			IsHeld = false,
			LastEchoTime = 0,
		}
		actionEchoConfigs[_actionName] = _arg1
	end
	_container.ConfigureActionEcho = ConfigureActionEcho
	--[[
		*
			 * Disables echo for an action
			 
	]]
	local function DisableActionEcho(actionName)
		local _actionName = actionName
		actionEchoConfigs[_actionName] = nil
		local _actionName_1 = actionName
		echoTriggeredActions[_actionName_1] = nil
	end
	_container.DisableActionEcho = DisableActionEcho
	--[[
		*
			 * Checks if an echo was triggered for the action this frame
			 
	]]
	local function WasEchoTriggered(actionName)
		local _actionName = actionName
		return echoTriggeredActions[_actionName] ~= nil
	end
	_container.WasEchoTriggered = WasEchoTriggered
	--[[
		*
			 * Updates all registered echo actions
			 
	]]
	function Update(deltaTime)
		local now = os.clock()
		-- Clear the echo triggered set at the start of each frame
		table.clear(echoTriggeredActions)
		for actionName, config in actionEchoConfigs do
			local pressed = actionsController.IsPressed(actionName)
			if pressed then
				if not config.IsHeld then
					-- Key just pressed, start tracking
					config.IsHeld = true
					config.HeldTime = 0
					config.LastEchoTime = now
				else
					-- Key held down
					config.HeldTime += deltaTime
					-- Check if it's time to echo
					if config.HeldTime >= config.InitialDelay then
						local timeSinceLastEcho = now - config.LastEchoTime
						if timeSinceLastEcho >= config.RepeatInterval then
							-- Mark this action as echo-triggered this frame
							echoTriggeredActions[actionName] = true
							config.LastEchoTime = now
						end
					end
				end
			else
				-- Key released
				config.IsHeld = false
				config.HeldTime = 0
			end
		end
	end
end
return {
	InputEchoController = InputEchoController,
}
