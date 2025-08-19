-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local RunService = _services.RunService
local UserInputService = _services.UserInputService
local ArrayTools = TS.import(script, TS.getModule(script, "@rbxts", "tool_pack")).ArrayTools
local ActionsController = TS.import(script, script.Parent, "ActionsController").ActionsController
local MouseController = {}
do
	local _container = MouseController
	--the stacks should be sorted by priority all the time
	local lockedCenterPrioritiesStack = {}
	local unlockedStack = {}
	local lockedAtPositionStack = {}
	local DEFAULT_MOUSE_LOCK_ACTION_PRIORITIES = {
		[2] = 300,
		[1] = 200,
		[0] = 100,
	}
	local mouseLockActionStacks = {
		[2] = unlockedStack,
		[1] = lockedCenterPrioritiesStack,
		[0] = lockedAtPositionStack,
	}
	local MouseLockAction
	do
		MouseLockAction = setmetatable({}, {
			__tostring = function()
				return "MouseLockAction"
			end,
		})
		MouseLockAction.__index = MouseLockAction
		function MouseLockAction.new(...)
			local self = setmetatable({}, MouseLockAction)
			return self:constructor(...) or self
		end
		function MouseLockAction:constructor(action_, priority_)
			if priority_ == nil then
				priority_ = DEFAULT_MOUSE_LOCK_ACTION_PRIORITIES[action_]
			end
			self.action_ = action_
			self.priority_ = priority_
			self.active_ = false
		end
		function MouseLockAction:SetActive(active)
			if self.active_ == active then
				return nil
			end
			self.active_ = active
			local stack = mouseLockActionStacks[self.action_]
			if active then
				ArrayTools.SortedInsert(stack, self.priority_, function(currentValue, b)
					return currentValue >= b
				end)
				return nil
			end
			ArrayTools.RemoveElementFromArray(stack, self.priority_)
		end
	end
	_container.MouseLockAction = MouseLockAction
	--[[
		*during the strict mode the mouse e.g if mouse should be visible and unlocked, it will ensure that it will be unlocked all the time
			 * without it, mouse behaviour and visibility can be changed during the process and action like unlock the mouse will be applied only at change
			 
	]]
	local StrictMode = {
		[0] = false,
		[1] = false,
		[2] = false,
	}
	local function SetMouseLockActionStrictMode(action, value)
		StrictMode[action] = value
	end
	_container.SetMouseLockActionStrictMode = SetMouseLockActionStrictMode
	local function GetCurrentMouseLockAction()
		if ActionsController.IsExisting("MouseDebugMode") and ActionsController.IsPressed("MouseDebugMode") then
			return 2
		end
		--sets unlock mouse on top
		local _condition = unlockedStack[1]
		if _condition == nil then
			_condition = 0
		end
		local unlockMouseMaxPriority = _condition
		local _condition_1 = lockedCenterPrioritiesStack[1]
		if _condition_1 == nil then
			_condition_1 = -1
		end
		local lockedCenterMaxPriority = _condition_1
		local _condition_2 = lockedAtPositionStack[1]
		if _condition_2 == nil then
			_condition_2 = -1
		end
		local lockedAtPositionMaxPriority = _condition_2
		if unlockMouseMaxPriority >= lockedAtPositionMaxPriority and unlockMouseMaxPriority >= lockedCenterMaxPriority then
			return 2
		end
		if lockedCenterMaxPriority >= lockedAtPositionMaxPriority then
			return 1
		end
		return 0
	end
	local function ApplyAction(action)
		if action == 2 then
			UserInputService.MouseBehavior = Enum.MouseBehavior.Default
			UserInputService.MouseIconEnabled = true
		elseif action == 1 then
			UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter
			UserInputService.MouseIconEnabled = false
		elseif action == 0 then
			UserInputService.MouseBehavior = Enum.MouseBehavior.LockCurrentPosition
			UserInputService.MouseIconEnabled = true
		end
	end
	local currentAction
	local function SetMouseLockAction(mouseLockAction)
		local isStrictMode = StrictMode[mouseLockAction]
		--dont apply changes if strict mode is not enabled
		if not isStrictMode and currentAction == mouseLockAction then
			return nil
		end
		currentAction = mouseLockAction
		ApplyAction(mouseLockAction)
	end
	local enabled = true
	local function Update()
		if not enabled then
			return nil
		end
		SetMouseLockAction(GetCurrentMouseLockAction())
	end
	local function SetEnabled(value)
		enabled = value
	end
	_container.SetEnabled = SetEnabled
	local initialized = false
	local function Initialize()
		if initialized then
			return nil
		end
		initialized = true
		RunService.RenderStepped:Connect(Update)
	end
	_container.Initialize = Initialize
end
return {
	MouseController = MouseController,
}
