# Getting Started with Input Actions

## Installation

```bash
npm install @rbxts/input-actions
```

## Basic Concepts

The Input Actions package replicates Godot's input handling system for Roblox using TypeScript. Here are the key concepts:

### Actions

Actions are named abstractions that represent an input intent (like "Jump", "Move", or "Shoot"). Instead of directly handling key presses, you define actions and respond to them.

### Input Maps

Input maps connect physical inputs (keyboard, mouse, gamepad) to actions. This allows you to easily support multiple input devices without changing your game logic.

### Input Events

When a player presses a key or moves the mouse, the system creates input events that are processed and can trigger actions.

## Quick Start Guide

### Initialization

Before using any functionality, you need to initialize the controllers:

```ts
import { InputActionsInitializationHelper } from "@rbxts/input-actions";

// Initialize all controllers (including advanced controllers)
InputActionsInitializationHelper.InitAll();

// Or initialize specific controllers
InputActionsInitializationHelper.InitActionsAndInputManager();
InputActionsInitializationHelper.InitAdvancedControllers(); // For key combinations, contexts, etc.
```

### Creating and Using Actions

```ts
import { ActionsController } from "@rbxts/input-actions";

// Create a new action and bind keys to it
ActionsController.Add("Jump");
ActionsController.AddKeyCode("Jump", Enum.KeyCode.Space); // For keyboard
ActionsController.AddKeyCode("Jump", Enum.KeyCode.ButtonA); // For gamepad

// Check if the action is currently pressed
function Update() {
	if (ActionsController.IsPressed("Jump")) {
		// Handle jump action
	}

	// Check for just pressed (first frame of press)
	if (ActionsController.IsJustPressed("Jump")) {
		// Handle jump start
	}

	// Check for just released
	if (ActionsController.IsJustReleased("Jump")) {
		// Handle jump end
	}
}
```

### Using Input Contexts

Input contexts help you organize inputs for different game states:

```ts
import { InputContextController } from "@rbxts/input-actions";

// Create contexts for different game states
const gameplayContext = InputContextController.CreateContext("gameplay");

// Add input mappings
gameplayContext.Add("Jump", {
	KeyboardAndMouse: Enum.KeyCode.Space,
	Gamepad: Enum.KeyCode.ButtonA,
});

gameplayContext.Add("Fire", {
	KeyboardAndMouse: Enum.UserInputType.MouseButton1,
	Gamepad: Enum.KeyCode.ButtonR2,
});

// Activate the context
gameplayContext.Assign();
```

### Handling Different Input Devices

```ts
import { DeviceTypeHandler, EInputType } from "@rbxts/input-actions";

// Set up device change detection
DeviceTypeHandler.OnInputTypeChanged.Connect((inputType) => {
	switch (inputType) {
		case EInputType.KeyboardAndMouse:
			print("Player is using keyboard/mouse");
			break;
		case EInputType.Gamepad:
			print("Player is using gamepad");
			break;
		case EInputType.Touch:
			print("Player is using touch controls");
			break;
	}
});
```

## Troubleshooting Common Issues

### Actions Not Registering

If your actions aren't responding to input:

1. Ensure you've initialized the system with `InputActionsInitializationHelper.InitAll()`
2. Check that your action names match exactly (case-sensitive)
3. Verify the action has key bindings with `ActionsController.GetKeyCodes("YourAction")`
4. Make sure the appropriate context is assigned when checking for the action

### Multiple Contexts Conflict

If you have issues with multiple contexts:

1. Only one context should handle a particular input responsibility
2. Use `context.Unassign()` before assigning a new context that uses the same keys
3. Check which context is active with `context.IsAssigned()`

### Device Not Detected Correctly

If the wrong input device is being detected:

1. Make sure `DeviceTypeHandler.Initialize()` has been called
2. Listen to device changes with `DeviceTypeHandler.OnInputTypeChanged`
3. Your context should include mappings for both keyboard/mouse and gamepad

### Performance Considerations

For optimal performance:

1. Avoid creating/destroying actions frequently - reuse them when possible
2. Use `ActionsController.IsJustPressed()` for one-time actions instead of tracking state yourself
3. Keep the number of active contexts to a minimum
4. For complex games, consider cleaning up unused actions when switching game states

## Next Steps

Once you're comfortable with the basics, explore more advanced features:

- [Component Guides](./ComponentGuides.md) - Detailed guides for each component
- [Advanced Usage](./AdvancedUsage.md) - Advanced techniques and patterns
- [API Reference](./API.md) - Complete API documentation
- [Examples](./Examples.md) - Practical examples for different game systems
