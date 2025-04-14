# Getting Started with Input Actions

## Installation

```
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

## Initialization

Before using any functionality, you need to initialize the controllers:

```ts
import { InputActionsInitializerTools } from "@rbxts/input-actions";

// Initialize all controllers (including advanced controllers)
InputActionsInitializerTools.InitAll();

// Or initialize specific controllers
InputActionsInitializerTools.InitActionsAndInputManager();
InputActionsInitializerTools.InitAdvancedControllers(); // For key combinations, contexts, etc.
```

## Type Safety

The package is designed with TypeScript best practices in mind, providing enums and constants for improved type safety and code organization:

```ts
import { EVibrationPreset, EInputType, ECustomKey } from "@rbxts/input-actions";

// Use enum values for type-safe code
HapticFeedbackController.VibratePreset(EVibrationPreset.Success);

// Check input type with proper enums
if (InputTypeController.GetMainInputType() === EInputType.Gamepad) {
	// Show gamepad controls
}
```

## Creating and Using Actions

### Creating a simple action

```ts
import { ActionsController } from "@rbxts/input-actions";

// Create an action named "Jump"
ActionsController.Add("Jump");

// Bind the space key to the Jump action
ActionsController.AddKeyCode("Jump", Enum.KeyCode.Space);
```

### Checking action state

```ts
// Check if the Jump action is currently pressed
if (ActionsController.IsPressed("Jump")) {
	// Make the character jump
}

// Check if the Jump action was just pressed this frame
if (ActionsController.IsJustPressed("Jump")) {
	// Play jump sound
}

// Check if the Jump action was just released
if (ActionsController.IsJustReleased("Jump")) {
	// Do something when player releases jump
}
```

### Using press strength

Some inputs, like gamepad triggers, can have variable press strength. You can access this:

```ts
// Get the strength of the "Accelerate" action (0 to 1)
const accelerationAmount = ActionsController.GetPressStrength("Accelerate");

// Apply acceleration based on input strength
vehicle.ApplyAcceleration(accelerationAmount * maxAcceleration);
```

## Handling Input Events

You can subscribe to input events to get more control:

```ts
import { InputManagerController } from "@rbxts/input-actions";

// Subscribe to input events
const cleanup = InputManagerController.Subscribe((inputEvent) => {
	// Check if this event is for our action
	if (inputEvent.IsAction("Shoot")) {
		if (inputEvent.IsPressed()) {
			// Player is shooting
			startShooting();
		} else {
			// Player stopped shooting
			stopShooting();
		}
	}

	// Return Enum.ContextActionResult.Sink to prevent other handlers from processing this input
	return Enum.ContextActionResult.Pass;
});

// Later, clean up the subscription
cleanup();
```

## Supporting Multiple Input Devices

```ts
import { InputMapController, IInputMap } from "@rbxts/input-actions";

// Define an input map for an action
const jumpMap: IInputMap = {
	KeyboardAndMouse: Enum.KeyCode.Space,
	Gamepad: Enum.KeyCode.ButtonA,
};

// Add the input map to the Jump action
InputMapController.Add("Jump", jumpMap);
```

## Advanced Usage

For more complex scenarios, refer to the [advanced documentation](./AdvancedUsage.md).
