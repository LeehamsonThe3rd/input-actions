# ActionsController

The ActionsController is the core component of the Input Actions system, responsible for managing input actions and their states.

## Overview

ActionsController handles the registration, state tracking, and triggering of named actions that can be bound to various input keys. It provides an abstraction layer over raw input, allowing you to define logical "actions" that can be triggered by different physical inputs.

## Key Concepts

- **Actions**: Named abstractions that represent an input intent (e.g., "Jump", "Fire", "MoveForward")
- **Key Bindings**: Associations between physical input keys and actions
- **Activation Strength**: Threshold for considering an action as pressed (especially for analog inputs)

## Core Functionality

### Registering Actions

```ts
// Add a simple action
ActionsController.Add("Jump");

// Add an action with custom activation threshold
ActionsController.Add("Accelerate", 0.2); // More sensitive trigger

// Add an action with pre-defined key bindings
ActionsController.Add("Fire", 0.5, [Enum.UserInputType.MouseButton1, Enum.KeyCode.ButtonR2]);
```

### Binding Keys to Actions

```ts
// Bind a keyboard key
ActionsController.AddKeyCode("Jump", Enum.KeyCode.Space);

// Bind a gamepad button to the same action
ActionsController.AddKeyCode("Jump", Enum.KeyCode.ButtonA);

// Bind a mouse button
ActionsController.AddKeyCode("Fire", Enum.UserInputType.MouseButton1);
```

### Checking Action States

```ts
// Check if an action is currently pressed
if (ActionsController.IsPressed("Jump")) {
	// Character is jumping
}

// Check if an action was just pressed this frame
if (ActionsController.IsJustPressed("Fire")) {
	FireWeapon();
}

// Check if an action was just released this frame
if (ActionsController.IsJustReleased("Crouch")) {
	StandUpFromCrouch();
}

// Get analog input strength (0-1) for actions
const accelerationAmount = ActionsController.GetPressStrength("Accelerate");
```

### Modifying Actions

```ts
// Remove a key binding
ActionsController.EraseKeyCode("Fire", Enum.UserInputType.MouseButton1);

// Remove all key bindings
ActionsController.EraseAllKeyCodes("Jump");

// Change activation threshold
ActionsController.SetActivationStrength("Accelerate", 0.3);

// Remove an action completely
ActionsController.Erase("OldAction");
```

## Manual Control

You can also manually control action states, which is useful for scripted sequences or testing:

```ts
// Force an action to be pressed
ActionsController.Press("Jump");

// Force an action release
ActionsController.Release("Jump");

// Set analog strength
ActionsController.Press("Accelerate", 0.75); // 75% strength
```

## Implementation Details

The ActionsController maintains several mappings internally:

1. A map from action names to their data (keycodes, state buffers, thresholds)
2. A reverse map from input keycodes to the actions they trigger

For each action, it stores:

- The list of keycodes that can trigger it
- A key buffer that tracks the action's state across three frames (current, previous, pre-previous)
- The activation strength threshold

This architecture allows efficient lookup of actions by name or by input key, and provides the state tracking needed to detect just-pressed and just-released conditions.

## Usage Recommendations

- Create actions with meaningful names that represent the intent, not the input device
- Take advantage of binding multiple keys to the same action for cross-platform support
- Use appropriate activation thresholds for analog inputs like triggers and thumbsticks
- Check for `IsJustPressed()` rather than `IsPressed()` for one-time actions like shooting
