# Input Actions for Roblox-TS

A comprehensive input handling system for Roblox-TS inspired by Godot's input management approach. This package provides a flexible, action-based approach to handling player input across multiple platforms.

## Features

- **Action-Based Input System**: Define abstract actions like "Jump" or "Fire" instead of directly handling key presses
- **Device Adaptability**: Automatically adapts to different input devices (keyboard/mouse, gamepad, touch)
- **Context Management**: Easily switch between different input contexts (gameplay, menu, vehicle)
- **Enhanced Control**: Support for analog input with thresholds, deadzones, and modifiers
- **Advanced Features**: Key combinations, input echoing, haptic feedback, and more
- **Cross-Platform**: Works seamlessly across PC, mobile, console, and VR
- **Visual Input Display**: Built-in utilities for displaying input keys/buttons in UI

## Installation

```bash
npm install @rbxts/input-actions
```

## Basic Usage

```typescript
import { ActionsController, InputActionsInitializationHelper } from "@rbxts/input-actions";
import { RunService } from "@rbxts/services";

// Initialize the system
InputActionsInitializationHelper.InitAll();

// Create an action and bind keys to it
ActionsController.Add("Jump");
ActionsController.AddKeyCode("Jump", Enum.KeyCode.Space);
ActionsController.AddKeyCode("Jump", Enum.KeyCode.ButtonA); // For gamepad

// Use the action in your game code
RunService.Heartbeat.Connect(() => {
	if (ActionsController.IsJustPressed("Jump")) {
		character.Jump();
	}
});
```

## Using Input Contexts

```typescript
import { InputContextController } from "@rbxts/input-actions";

// Create contexts for different game states
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

## Advanced Example: Character Movement

```typescript
import { RawInputHandler, InputActionsInitializationHelper } from "@rbxts/input-actions";
import { RunService } from "@rbxts/services";

// Initialize needed controllers
InputActionsInitializationHelper.InitAll();

RunService.RenderStepped.Connect((deltaTime) => {
	// Get movement vector relative to camera
	const moveVector = RawInputHandler.GetMoveVector(true, true);

	if (humanoid) {
		// Apply movement
		const walkSpeed = 16; // Standard walk speed
		humanoid.Move(moveVector.mul(walkSpeed));
	}

	// Get camera rotation input
	const rotationDelta = RawInputHandler.GetRotation();
	UpdateCameraAngle(rotationDelta.X, rotationDelta.Y);
});
```

## Documentation

For detailed documentation, see:

- [Introduction](docs/Introduction.md) - Overview of the system
- [Quick Start Guide](docs/QuickStart.md) - Getting started with basic usage
- [Advanced Usage](docs/Advanced.md) - Advanced features like contexts, key combinations, and input echo
- [Component References](docs/Components/) - Detailed documentation for each component
- [API Reference](docs/API.md) - Complete API documentation

## Comparison to Godot

This system is inspired by Godot's input handling, which uses actions as an abstraction layer between physical inputs and game logic. Key differences:

1. Adapted for Roblox's input system and device capabilities
2. Added support for Roblox-specific input types and scenarios
3. Enhanced with device detection for cross-platform Roblox games
4. Integrated with Roblox's input architecture
5. Added features like input contexts and haptic feedback

## License

MIT License - see the [LICENSE](LICENSE) file for details.
