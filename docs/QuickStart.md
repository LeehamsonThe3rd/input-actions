# Quick Start Guide

This guide will help you quickly get up and running with the Input Actions package.

## Installation

```bash
npm install @rbxts/input-actions
```

## Basic Setup

First, you need to initialize the input system. The easiest way is to use the `InputActionsInitializationHelper`:

```ts
import { InputActionsInitializationHelper } from "@rbxts/input-actions";

// Initialize all components of the system
InputActionsInitializationHelper.InitAll();

// Alternatively, initialize only what you need:
// InputActionsInitializationHelper.InitMouseController();
// InputActionsInitializationHelper.InitDeviceTypeHandler();
// InputActionsInitializationHelper.InitActionsAndInputManager();
// InputActionsInitializationHelper.InitRawInputHandler();
// InputActionsInitializationHelper.InitAdvancedControllers();
```

## Creating and Using Actions

Actions are named input events that can be triggered by one or more input methods:

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

## Using Input Contexts

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

// Check actions like normal
function Update() {
	if (ActionsController.IsPressed("Jump")) {
		// Handle jump
	}
}
```

## Handling Different Input Devices

The system automatically handles different input devices:

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

## Raw Input for Movement

For character movement, use the RawInputHandler:

```ts
import { RawInputHandler } from "@rbxts/input-actions";
import { RunService } from "@rbxts/services";

// Set up movement processing
RunService.RenderStepped.Connect((deltaTime) => {
	// Get move vector relative to camera (true parameter)
	const moveVector = RawInputHandler.GetMoveVector(true);

	// Apply to character
	if (character && character.Humanoid) {
		character.Humanoid.Move(moveVector);
	}
});
```

## Next Steps

Once you're comfortable with the basics, explore more advanced features:

- [Component Guides](./ComponentGuides.md) - Detailed guides for each component
- [Advanced Usage](./AdvancedUsage.md) - Advanced techniques and patterns
