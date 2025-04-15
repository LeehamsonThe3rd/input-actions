# InputManagerController

The InputManagerController is a low-level component that handles the conversion of Roblox's raw input events into the Input Actions system.

## Overview

This controller serves as the bridge between Roblox's UserInputService and the Input Actions system. It captures raw input events, processes them, and converts them into more useful forms that can be consumed by other parts of the system.

## Key Concepts

- **Input Events**: Representations of user input with additional context
- **Input Subscription**: A way to listen for and process input events
- **Custom Input Keys**: Special input keys that don't exist in Roblox's native input system

## Core Functionality

### Subscribing to Input Events

```ts
import { InputManagerController } from "@rbxts/input-actions";

// Basic subscription
const cleanup = InputManagerController.Subscribe((inputEvent) => {
	// Handle input event
	if (inputEvent.InputKeyCode === Enum.KeyCode.F) {
		print("F key was pressed or released!");
	}

	// Return Enum.ContextActionResult.Sink to prevent further processing
	// Return Enum.ContextActionResult.Pass or undefined to allow other handlers
});

// Later, when no longer needed:
cleanup();
```

### Advanced Subscription Options

```ts
import { InputManagerController, EInputEventSubscriptionType } from "@rbxts/input-actions";

// Subscribe with priority and event type filtering
const cleanup = InputManagerController.Subscribe(
	(inputEvent) => {
		// This will only be called for pressed/released events, not "changed" events
		// And it will run before handlers with lower priority
	},
	{
		Priority: 100, // Higher numbers run first
		SubscriptionType: EInputEventSubscriptionType.KeysOnly, // Only key press/release events
	},
);
```

### Available Subscription Types

```ts
// Different types of event subscriptions:
EInputEventSubscriptionType.All; // All input events
EInputEventSubscriptionType.AllWithNoCustomKeys; // All except custom key events
EInputEventSubscriptionType.KeysOnly; // Only key press/release events
EInputEventSubscriptionType.ChangedOnly; // Only continuous input events (e.g. mouse movement)
EInputEventSubscriptionType.CustomKeysOnly; // Only custom input keys
EInputEventSubscriptionType.KeysWithCustomKeysOnly; // Key events including custom keys
```

### Working with Input Events

```ts
// Properties and methods available on input events:
inputEvent.InputKeyCode; // The key code for this event
inputEvent.UserInputType; // The input type
inputEvent.Position; // Position of the input (for mouse/touch)
inputEvent.Delta; // Change in position since last event
inputEvent.PressStrength; // Strength of the press (0-1)
inputEvent.Actions; // Actions associated with this input
inputEvent.Changed; // Whether this is a "change" event

// Helpful methods:
inputEvent.IsPressed(); // Check if input is pressed
inputEvent.IsReleased(); // Check if input is released
inputEvent.IsAction("Jump"); // Check if event is for a specific action
inputEvent.AsText(); // Get text representation of input
```

## Custom Input Keys

The InputManagerController adds support for custom input keys that don't exist in Roblox's native system, such as:

- Directional inputs from thumbsticks (up/down/left/right)
- Mouse wheel directions (up/down)
- Mouse movement directions

These custom keys are automatically processed and made available to the rest of the system.

## Implementation Details

The InputManagerController:

1. Binds to Roblox's ContextActionService to receive raw input events
2. Processes these events to create InputEvent objects
3. Converts continuous inputs (like thumbsticks) into discrete directional inputs
4. Maps inputs to actions using the ActionsController
5. Distributes events to subscribers according to priority

## Usage Recommendations

- For most uses, you won't need to interact with InputManagerController directly
- Use ActionsController and InputContextController for game input handling
- Only subscribe directly to InputManagerController for advanced cases like:
  - Custom input processing
  - Input debugging/logging
  - Creating new input abstractions
- Be careful with subscription priorities to avoid conflicts
- Always clean up subscriptions when no longer needed
