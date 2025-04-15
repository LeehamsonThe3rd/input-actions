# InputEchoController

The InputEchoController provides functionality for making input repeat automatically when keys are held down, similar to how keyboard keys repeat when held in text editors.

## Overview

Input echo (or key repeat) is particularly useful for UI navigation, allowing users to scroll through menus or lists by holding down a directional key. This controller enables configuring which actions should echo and at what rate.

## Key Concepts

- **Initial Delay**: The time to wait before starting to repeat input
- **Repeat Interval**: The time between repeated inputs once repeating starts
- **Echo Triggering**: Making an action register as "just pressed" repeatedly

## Core Functionality

### Configuring Action Echo

```ts
import { InputEchoController } from "@rbxts/input-actions";

// Configure an action to echo when held
// Parameters: (actionName, initialDelaySeconds, repeatIntervalSeconds)
InputEchoController.ConfigureActionEcho("UIUp", 0.4, 0.1);
InputEchoController.ConfigureActionEcho("UIDown", 0.4, 0.1);
InputEchoController.ConfigureActionEcho("UILeft", 0.4, 0.1);
InputEchoController.ConfigureActionEcho("UIRight", 0.4, 0.1);
```

### Using Echo-Enabled Actions

Once an action is configured for echo, you can use it exactly like any other action:

```ts
import { ActionsController } from "@rbxts/input-actions";

// This will trigger both on initial press AND repeatedly when held
if (ActionsController.IsJustPressed("UIDown")) {
	SelectNextMenuItem();
}

// No special handling is needed - ActionsController.IsJustPressed
// automatically accounts for echoed inputs
```

### Disabling Action Echo

When you no longer need echo for an action (for example, when leaving a menu):

```ts
// Stop the echo effect for an action
InputEchoController.DisableActionEcho("UIUp");
InputEchoController.DisableActionEcho("UIDown");
InputEchoController.DisableActionEcho("UILeft");
InputEchoController.DisableActionEcho("UIRight");
```

### Checking Echo Status (Advanced)

For advanced use cases, you can directly check if an echo was triggered:

```ts
// Check if an echo was triggered this frame for an action
if (InputEchoController.WasEchoTriggered("UIDown")) {
	// This was an echo, not the initial press
}

// Note: You rarely need to use this directly, as ActionsController.IsJustPressed
// will handle both initial presses and echoes
```

## Practical Examples

### Menu Navigation

```ts
// Setup menu navigation with echo
function SetupMenuNavigation() {
	// Configure UI navigation actions with echo
	InputEchoController.ConfigureActionEcho("MenuUp", 0.4, 0.1);
	InputEchoController.ConfigureActionEcho("MenuDown", 0.4, 0.1);

	// Connect to Heartbeat to check inputs
	RunService.Heartbeat.Connect(() => {
		if (ActionsController.IsJustPressed("MenuUp")) {
			SelectPreviousItem();
		}
		if (ActionsController.IsJustPressed("MenuDown")) {
			SelectNextItem();
		}
	});
}

// Clean up when leaving menu
function CleanupMenuNavigation() {
	InputEchoController.DisableActionEcho("MenuUp");
	InputEchoController.DisableActionEcho("MenuDown");
}
```

### Text Input

```ts
// Configure backspace key to repeat for text deletion
InputEchoController.ConfigureActionEcho("Backspace", 0.5, 0.05);

// In your text input handler
if (ActionsController.IsJustPressed("Backspace")) {
	DeleteCharacter();
}
```

## Implementation Details

The InputEchoController maintains:

- A map of configured actions with their timing parameters
- State tracking for each action (whether it's held and for how long)
- A set of actions that had echoes triggered in the current frame

It updates on each frame to check for held inputs and trigger echoes based on the configured timing.

## Usage Recommendations

- Use input echo primarily for UI navigation and text input
- Configure appropriate delays based on your UI design:
  - Longer initial delays (0.4-0.5s) feel more intentional
  - Shorter repeat intervals (0.05-0.1s) feel more responsive
- Always clean up echo configurations when leaving UI screens
- Be consistent with echo behavior across your game
- For gameplay actions, input echo is usually not appropriate
