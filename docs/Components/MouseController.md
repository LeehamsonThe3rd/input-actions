# MouseController

The MouseController provides advanced control over mouse behavior, including locking the mouse cursor and managing mouse visibility.

## Overview

This controller allows you to create custom camera systems and gameplay mechanics that require specific mouse behavior. It provides a priority-based system for controlling the mouse cursor state, making it easier to handle transitions between different game states.

## Key Concepts

- **Mouse Lock Actions**: Different ways to control the mouse (locked center, locked position, unlocked)
- **Action Priorities**: System to determine which mouse behavior has precedence
- **Strict Mode**: Ensures consistent mouse behavior during transitions

## Core Functionality

### Mouse Lock Actions

The MouseController supports three primary mouse behaviors:

```ts
import { MouseController, EMouseLockAction } from "@rbxts/input-actions";

// Create mouse lock actions with optional priorities
const freeLookAction = new MouseController.MouseLockAction(EMouseLockAction.LockMouseCenter);
const aimingAction = new MouseController.MouseLockAction(EMouseLockAction.LockMouseCenter, 10); // Higher priority
const menuAction = new MouseController.MouseLockAction(EMouseLockAction.UnlockMouse, 20); // Highest priority
```

### Activating Mouse Behaviors

```ts
// Activate a mouse lock action
freeLookAction.SetActive(true); // Lock mouse to center for camera control

// Later, when entering aiming mode (has higher priority)
aimingAction.SetActive(true); // Takes precedence over freeLookAction

// Later, when opening a menu (highest priority)
menuAction.SetActive(true); // Takes precedence over both actions

// When closing the menu
menuAction.SetActive(false); // Returns to aimingAction behavior

// When exiting aiming mode
aimingAction.SetActive(false); // Returns to freeLookAction behavior

// When exiting free look mode
freeLookAction.SetActive(false); // Mouse returns to default behavior
```

### Setting Strict Mode

For cases where you need to ensure consistent behavior:

```ts
// Enable strict mode for a specific action
MouseController.SetMouseLockActionStrictMode(EMouseLockAction.LockMouseCenter, true);

// This ensures that when LockMouseCenter is active, it will continuously
// enforce the mouse center-locked state, even if something else temporarily
// changes it
```

### Enabling/Disabling the Controller

```ts
// Temporarily disable all mouse controller behavior
MouseController.SetEnabled(false);

// Re-enable mouse controller
MouseController.SetEnabled(true);
```

## Practical Examples

### First-Person Camera System

```ts
// Set up a first-person camera system
function SetupFirstPersonCamera() {
	// Create a mouse lock action for camera control
	const cameraMouseLock = new MouseController.MouseLockAction(EMouseLockAction.LockMouseCenter);

	// Activate the mouse lock
	cameraMouseLock.SetActive(true);

	// Connect to player input for camera rotation
	RunService.RenderStepped.Connect((deltaTime) => {
		if (cameraMouseLock.IsActive()) {
			// Get mouse delta from RawInputHandler or directly
			const mouseDelta = UserInputService.GetMouseDelta();

			// Apply to camera rotation
			UpdateCameraRotation(mouseDelta.X, mouseDelta.Y, deltaTime);
		}
	});

	return cameraMouseLock; // Return for later reference
}

// Usage in game
const fpsCameraControl = SetupFirstPersonCamera();

// When opening a menu, temporarily release mouse control
function OpenInventoryMenu() {
	const menuMouseAction = new MouseController.MouseLockAction(
		EMouseLockAction.UnlockMouse,
		100, // Higher priority than camera
	);

	menuMouseAction.SetActive(true);
	// Show menu UI...

	return () => {
		// Return a cleanup function
		menuMouseAction.SetActive(false);
		// Hide menu UI...
	};
}
```

### Aiming System with Mouse Position Lock

```ts
// Create a system for a game where aiming locks the mouse at its current position
function SetupAimingSystem() {
	// Default free look behavior
	const freeLookAction = new MouseController.MouseLockAction(EMouseLockAction.LockMouseCenter);
	freeLookAction.SetActive(true);

	// Aiming behavior - lock at current position
	const aimingAction = new MouseController.MouseLockAction(
		EMouseLockAction.LockMouseAtPosition,
		10, // Higher priority than free look
	);

	// Toggle aiming when right mouse button is pressed
	UserInputService.InputBegan.Connect((input, gameProcessed) => {
		if (gameProcessed) return;

		if (input.UserInputType === Enum.UserInputType.MouseButton2) {
			aimingAction.SetActive(true);
			// Additional aiming logic...
		}
	});

	UserInputService.InputEnded.Connect((input, gameProcessed) => {
		if (input.UserInputType === Enum.UserInputType.MouseButton2) {
			aimingAction.SetActive(false);
			// Additional logic for exiting aim mode...
		}
	});
}
```

## Mouse Lock Actions and Priorities

The MouseController maintains separate priority stacks for each mouse behavior:

1. **UnlockMouse**: Shows the cursor and allows free movement
2. **LockMouseCenter**: Hides the cursor and locks it to the center of the screen (for camera control)
3. **LockMouseAtPosition**: Keeps the cursor visible but locked to its current position

The highest priority action in each stack is considered, and then the highest priority among these winning actions is applied.

## Implementation Details

The MouseController:

1. Maintains separate priority stacks for each mouse lock action type
2. Compares the highest priority from each stack to determine which action to apply
3. Updates the UserInputService properties (MouseBehavior and MouseIconEnabled)
4. Provides special debug mode support (MouseDebugMode action)
5. Can enforce strict behavior when needed

## Usage Recommendations

- Use appropriate priority values to create a predictable hierarchy of mouse behaviors
- Create and store MouseLockAction instances rather than creating new ones repeatedly
- Enable strict mode when you need guaranteed behavior (e.g., for critical gameplay mechanics)
- Consider using MouseLockAction with InputContext for different game states
- Clean up (deactivate) mouse actions when they're no longer needed
- When implementing custom camera systems, combine with RawInputHandler for complete control
