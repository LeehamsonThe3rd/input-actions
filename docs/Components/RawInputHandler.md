# RawInputHandler

The RawInputHandler provides direct access to player movement input and camera control, independent of the actions system.

## Overview

This utility gives you access to the raw movement vectors, camera rotation, and zoom input directly from Roblox's input system. It's particularly useful for character movement and camera control systems.

## Key Concepts

- **Move Vector**: The raw movement input from WASD/arrow keys or controller thumbstick
- **Camera Rotation**: The rotation input from mouse movement or right thumbstick
- **Camera Zoom**: The zoom input from mouse wheel or controller buttons

## Core Functionality

### Getting Movement Input

```ts
import { RawInputHandler } from "@rbxts/input-actions";

// Get raw movement vector (WASD/Arrow keys or left thumbstick)
const moveVector = RawInputHandler.GetMoveVector();

// Get movement vector relative to camera direction
const cameraMoveVector = RawInputHandler.GetMoveVector(true);

// Get normalized movement vector (unit length)
const normalizedMoveVector = RawInputHandler.GetMoveVector(false, true);

// Get movement vector that follows full camera rotation (including roll)
const fullRotationMoveVector = RawInputHandler.GetMoveVector(true, false, true);
```

### Getting Camera Input

```ts
// Get camera rotation input (mouse movement or right thumbstick)
const rotationDelta = RawInputHandler.GetRotation();
// rotationDelta.X = horizontal (yaw)
// rotationDelta.Y = vertical (pitch)

// Get camera zoom input (mouse wheel or controller buttons)
const zoomDelta = RawInputHandler.GetZoomDelta();
```

### Enabling/Disabling Input

```ts
// Enable or disable character movement controls
RawInputHandler.ControlSetEnabled(true); // Enable
RawInputHandler.ControlSetEnabled(false); // Disable

// Enable or disable mouse camera input
RawInputHandler.MouseInputSetEnabled(true); // Enable
RawInputHandler.MouseInputSetEnabled(false); // Disable
```

## Practical Examples

### Custom Character Controller

```ts
import { RawInputHandler } from "@rbxts/input-actions";
import { RunService } from "@rbxts/services";

function SetupCustomCharacterController(character: Model) {
	const humanoid = character.FindFirstChildOfClass("Humanoid");
	if (!humanoid) return;

	// Disable default controls and use our own
	humanoid.PlatformStand = true;

	// Connect to RenderStepped for smooth movement
	return RunService.RenderStepped.Connect((deltaTime) => {
		// Get camera-relative movement
		const moveVector = RawInputHandler.GetMoveVector(true, true);

		// Apply movement
		const walkSpeed = 16; // Standard walk speed
		const velocity = moveVector.mul(walkSpeed);

		// Apply to humanoid root part
		const rootPart = character.FindFirstChild("HumanoidRootPart") as BasePart;
		if (rootPart) {
			// Custom movement implementation
			rootPart.Velocity = new Vector3(
				velocity.X,
				rootPart.Velocity.Y, // Preserve Y velocity for gravity
				velocity.Z,
			);
		}
	});
}
```

### Custom Camera System

```ts
import { RawInputHandler } from "@rbxts/input-actions";
import { RunService, Workspace } from "@rbxts/services";

function SetupCustomCamera() {
	const camera = Workspace.CurrentCamera!;
	let cameraAngleX = 0;
	let cameraAngleY = 0;

	// Configure sensitivity
	const MOUSE_SENSITIVITY = 0.3;

	// Connect to RenderStepped for smooth camera updates
	RunService.RenderStepped.Connect((deltaTime) => {
		// Get rotation input
		const rotationDelta = RawInputHandler.GetRotation();

		// Update camera angles
		cameraAngleX -= rotationDelta.X * MOUSE_SENSITIVITY;
		cameraAngleY = math.clamp(
			cameraAngleY - rotationDelta.Y * MOUSE_SENSITIVITY,
			-80 * (math.pi / 180), // Limit looking up
			80 * (math.pi / 180), // Limit looking down
		);

		// Get character position
		const character = game.GetService("Players").LocalPlayer.Character;
		if (!character) return;

		const rootPart = character.FindFirstChild("HumanoidRootPart") as BasePart;
		if (!rootPart) return;

		// Set camera CFrame
		const cameraHeight = 1.5; // Eye height
		const cameraOffset = new Vector3(0, cameraHeight, 0);

		// Position camera at character
		camera.CFrame = new CFrame(rootPart.Position.add(cameraOffset))
			// Apply rotations
			.mul(CFrame.Angles(0, cameraAngleX, 0))
			.mul(CFrame.Angles(cameraAngleY, 0, 0));

		// Handle zoom
		const zoomDelta = RawInputHandler.GetZoomDelta();
		if (zoomDelta !== 0) {
			// Implement zoom functionality
			// ...
		}
	});
}
```

## Implementation Details

The RawInputHandler:

1. Interacts with Roblox's built-in PlayerModule to access movement input
2. Uses a custom camera input module to capture rotation and zoom input
3. Provides methods to transform raw input based on camera orientation
4. Enables enabling/disabling control aspects separately

## Usage Recommendations

- Use for custom character controllers or camera systems
- Combine with MouseController for complete camera control
- For most gameplay actions, use ActionsController instead
- Remember that RawInputHandler provides the raw input regardless of UI focus
- Use the camera-relative movement option (`GetMoveVector(true)`) for most games
- Normalize the movement vector when you need a consistent direction regardless of magnitude
- Consider adding your own deadzone and sensitivity
