# Quick Start Guide

## Installation

```bash
npm install @rbxts/input-actions
```

## Basic Concepts

Input Actions uses three key concepts:

1. **Actions**: Named abstractions that represent input intent (e.g., "Jump", "Move", "Shoot")
2. **Key Mappings**: Connect physical inputs (keyboard, mouse, gamepad) to actions
3. **Contexts**: Groups of input mappings that can be enabled/disabled together

## Initialization

First, initialize the system:

```ts
import { InputActionsInitializationHelper } from "@rbxts/input-actions";

// Initialize all controllers
InputActionsInitializationHelper.InitAll();

// Or initialize specific components as needed
InputActionsInitializationHelper.InitBasicInputControllers();
InputActionsInitializationHelper.InitDeviceTypeHandler();
InputActionsInitializationHelper.InitAdvancedInputControllers();
```

## Creating Actions and Binding Keys

Define actions and bind input keys to them:

```ts
import { ActionsController } from "@rbxts/input-actions";

// Create an action
ActionsController.Add("Jump");

// Bind keys to the action (cross-platform support)
ActionsController.AddKeyCode("Jump", Enum.KeyCode.Space); // Keyboard
ActionsController.AddKeyCode("Jump", Enum.KeyCode.ButtonA); // Gamepad
```

## Checking Action States

Check if actions are pressed in your game loop:

```ts
import { RunService } from "@rbxts/services";

RunService.Heartbeat.Connect(() => {
	// Check if action is currently pressed
	if (ActionsController.IsPressed("Jump")) {
		// Handle continuous jumping input
	}

	// Check if action was just pressed this frame
	if (ActionsController.IsJustPressed("Fire")) {
		FireWeapon();
	}

	// Check if action was just released this frame
	if (ActionsController.IsJustReleased("Crouch")) {
		StandUp();
	}

	// Get analog input strength (0-1) for triggers or analog buttons
	const accelerationAmount = ActionsController.GetPressStrength("Accelerate");
	ApplyAcceleration(accelerationAmount);
});
```

## Using Input Contexts

Organize inputs into contexts for different game states:

```ts
import { InputContextController } from "@rbxts/input-actions";

// Create contexts for different states
const gameplayContext = InputContextController.CreateContext("gameplay");
const menuContext = InputContextController.CreateContext("menu");

// Add input mappings to contexts
gameplayContext.Add("Jump", {
	KeyboardAndMouse: Enum.KeyCode.Space,
	Gamepad: Enum.KeyCode.ButtonA,
});

gameplayContext.Add("Fire", {
	KeyboardAndMouse: Enum.UserInputType.MouseButton1,
	Gamepad: Enum.KeyCode.ButtonR2,
});

menuContext.Add("Select", {
	KeyboardAndMouse: Enum.KeyCode.Return,
	Gamepad: Enum.KeyCode.ButtonA,
});

menuContext.Add("Back", {
	KeyboardAndMouse: Enum.KeyCode.Escape,
	Gamepad: Enum.KeyCode.ButtonB,
});

// Activate contexts based on game state
function EnterGameplay() {
	menuContext.Unassign();
	gameplayContext.Assign();
}

function OpenMenu() {
	gameplayContext.Unassign();
	menuContext.Assign();
}
```

## Device Type Detection

Adapt your game to different input devices:

```ts
import { DeviceTypeHandler, EInputType } from "@rbxts/input-actions";

// Set up device change detection
DeviceTypeHandler.OnInputTypeChanged.Connect((inputType) => {
	switch (inputType) {
		case EInputType.KeyboardAndMouse:
			ShowKeyboardControls();
			break;
		case EInputType.Gamepad:
			ShowGamepadControls();
			break;
		case EInputType.Touch:
			ShowTouchControls();
			break;
	}
});
```

## Raw Input Handling

For direct movement control:

```ts
import { RawInputHandler } from "@rbxts/input-actions";

RunService.RenderStepped.Connect((deltaTime) => {
	// Get movement direction relative to camera
	const moveVector = RawInputHandler.GetMoveVector(true);

	// Apply to character movement
	if (humanoid) {
		humanoid.Move(moveVector);
	}

	// Get camera rotation input
	const rotationDelta = RawInputHandler.GetRotation();
	UpdateCameraAngle(rotationDelta.X, rotationDelta.Y);
});
```

## Haptic Feedback

Provide controller vibration feedback:

```ts
import { HapticFeedbackController, EVibrationPreset } from "@rbxts/input-actions";

// Use predefined presets
function HitEnemy() {
	HapticFeedbackController.VibratePreset(EVibrationPreset.Medium);
}

// Or custom parameters
function Explosion() {
	HapticFeedbackController.Vibrate(0.8, 0.6, 0.5); // largeMotor, smallMotor, duration
}
```

## Common Troubleshooting

- **Actions not working**: Ensure `InputActionsInitializationHelper.InitAll()` was called
- **Wrong device detected**: Initialize `DeviceTypeHandler` explicitly
- **Conflicts between contexts**: Unassign existing contexts before assigning new ones
- **Performance issues**: Use `IsJustPressed()` for one-time actions

## Next Steps

For more advanced features, see:

- [Advanced Usage Guide](./Advanced.md) - Learn about InputEcho, KeyCombinations, and Input Contexts
- [API Reference](./API.md) - Complete API documentation

## Comparison with Roblox's Native Input System

The Input Actions package extends Roblox's native input system with several advantages:

| Feature               | Roblox Native                            | Input Actions Package                                          |
| --------------------- | ---------------------------------------- | -------------------------------------------------------------- |
| Input Abstraction     | Directly tied to physical inputs         | Abstract actions that can be triggered by multiple inputs      |
| Device Support        | Separate handling for different devices  | Unified system that automatically adapts to the current device |
| Context Switching     | Requires manual connection/disconnection | Built-in context system for easy switching between game states |
| Analog Input          | Basic support                            | Enhanced with deadzones, thresholds, and strength values       |
| Input Combinations    | Manual implementation                    | Built-in support for key combinations                          |
| Haptic Feedback       | Basic                                    | Enhanced with presets and custom patterns                      |
| Mouse Control         | Basic                                    | Advanced control with locking options and priority system      |
| Visual Representation | Limited                                  | Built-in system for displaying inputs with proper icons        |

### When to Use Native Roblox Input

While this package provides many advantages, there are still cases where you might want to use Roblox's native input directly:

- For extremely simple games with minimal input requirements
- When you need direct access to raw input events for specialized use cases
- If you're working with Roblox's built-in character controller exclusively
- For compatibility with other Roblox systems that expect direct input connections

### Using Both Systems Together

The Input Actions package works alongside Roblox's native input system, so you can:

1. Use Input Actions for most game controls
2. Connect directly to UserInputService for specialized cases
3. Mix and match as needed for your specific game requirements
