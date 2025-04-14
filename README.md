# Input Actions for Roblox-TS

A comprehensive input handling system for Roblox-TS, inspired by Godot's input system. This package provides a flexible, action-based approach to handling player input across multiple devices.

## Features

- **Action-based input handling** - Focus on what the player is doing, not which button they pressed
- **Multi-device support** - Seamlessly handle keyboard, mouse, touch, and gamepad input
- **Input mapping** - Easily remap controls at runtime
- **Analog input support** - Handle variable input strength (like gamepad triggers)
- **Custom input events** - Create and process virtual inputs
- **Device detection** - Automatically detect and adapt to the player's input device
- **Advanced mouse controls** - Lock, hide, or control mouse behavior

## Installation

```bash
npm install @rbxts/input-actions
```

## Basic Usage

```typescript
import { ActionsController, InputActionsInitializerTools } from "@rbxts/input-actions";

// Initialize the system
InputActionsInitializerTools.InitActionsAndInputManager();

// Create an action and bind keys to it
ActionsController.Add("Jump");
ActionsController.AddKeyCode("Jump", Enum.KeyCode.Space);
ActionsController.AddKeyCode("Jump", Enum.KeyCode.ButtonA); // For gamepad

// Use the action in your game code
RunService.RenderStepped.Connect(() => {
	if (ActionsController.IsJustPressed("Jump")) {
		character.Jump();
	}
});
```

## Advanced Example: Player Movement

```typescript
import {
	ActionsController,
	InputController,
	InputActionsInitializerTools,
} from "@rbxts/input-actions";

// Initialize needed controllers
InputActionsInitializerTools.InitAll();

// Create movement actions
ActionsController.Add("MoveForward");
ActionsController.Add("MoveBackward");
ActionsController.Add("MoveLeft");
ActionsController.Add("MoveRight");
ActionsController.Add("Sprint");

// Bind keys to actions
ActionsController.AddKeyCode("MoveForward", Enum.KeyCode.W);
ActionsController.AddKeyCode("MoveBackward", Enum.KeyCode.S);
ActionsController.AddKeyCode("MoveLeft", Enum.KeyCode.A);
ActionsController.AddKeyCode("MoveRight", Enum.KeyCode.D);
ActionsController.AddKeyCode("Sprint", Enum.KeyCode.LeftShift);

// Update character movement
RunService.RenderStepped.Connect((deltaTime) => {
	// Get movement vector relative to camera
	const moveVector = InputController.GetMoveVector(true, true);

	// Apply movement based on sprint state
	const speed = ActionsController.IsPressed("Sprint") ? SPRINT_SPEED : WALK_SPEED;

	character.ApplyMovement(moveVector.mul(speed * deltaTime));
});
```

## Documentation

For detailed documentation, see:

- [Getting Started](docs/GettingStarted.md)
- [Advanced Usage](docs/AdvancedUsage.md)
- [API Reference](docs/API.md)

## Comparison to Godot

This system is inspired by Godot's input handling, which uses actions as an abstraction layer between physical inputs and game logic. Key differences:

1. Adapted for Roblox's input system and devices
2. Added support for Roblox-specific input types
3. Enhanced with device detection for cross-platform games
4. Integrated with Roblox's camera system

## License

MIT License - see the [LICENSE](LICENSE) file for details.
