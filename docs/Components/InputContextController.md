# InputContextController

The InputContextController provides a higher-level management system for organizing input mappings into "contexts" that can be enabled and disabled as groups.

## Overview

Input contexts allow you to organize your input mappings into logical groups that can be switched between different game states, such as gameplay, menus, vehicles, or cutscenes. Each context contains a set of action mappings that can be assigned or unassigned as a unit.

## Key Concepts

- **Input Context**: A named collection of input mappings that can be enabled/disabled as a group
- **Input Maps**: Configurations that define which keys trigger which actions for different device types
- **Context Assignment**: The process of activating or deactivating a context's input mappings

## Core Functionality

### Creating Contexts

```ts
// Create a named context
const gameplayContext = InputContextController.CreateContext("gameplay");
const menuContext = InputContextController.CreateContext("menu");
const vehicleContext = InputContextController.CreateContext("vehicle");

// Get the global context (always available)
const globalContext = InputContextController.GetGlobalContext();
```

### Defining Input Maps

```ts
// Add mappings to a context with different keys for different platforms
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

vehicleContext.Add("Accelerate", {
	KeyboardAndMouse: Enum.KeyCode.W,
	Gamepad: Enum.KeyCode.ButtonR2,
});
```

### Activating/Deactivating Contexts

```ts
// Activate a context (enable all its input mappings)
gameplayContext.Assign();

// Deactivate a context (disable all its input mappings)
menuContext.Unassign();

// Toggle a context's state
vehicleContext.ToggleAssignment();

// Check if a context is active
if (gameplayContext.IsAssigned()) {
	// Gameplay controls are active
}
```

### Switching Between Contexts

```ts
function EnterMenu() {
	// Disable gameplay controls and enable menu controls
	gameplayContext.Unassign();
	menuContext.Assign();
}

function ExitMenu() {
	// Disable menu controls and enable gameplay controls
	menuContext.Unassign();
	gameplayContext.Assign();
}

function EnterVehicle() {
	// Switch from on-foot to vehicle controls
	gameplayContext.Unassign();
	vehicleContext.Assign();
}
```

### Updating Mappings at Runtime

```ts
// Update a specific input mapping (useful for key rebinding)
gameplayContext.UpdateKey("Jump", "KeyboardAndMouse", Enum.KeyCode.LeftShift);

// Get the current key for the active device
const currentJumpKey = gameplayContext.GetInputKeyForCurrentDevice("Jump");

// Get data for displaying the key in UI
const jumpKeyVisual = gameplayContext.GetVisualData("Jump");
```

## Default UI Controls

The InputContextController comes with a pre-defined UIControlContext that includes standard input mappings for UI navigation:

```ts
// Use the built-in UI control mappings
InputContextController.ApplyDefaultInputMaps();

// These mappings include:
// - UiGoUp, UiGoDown, UiGoLeft, UiGoRight
// - UiAccept, UiCancel
// - UiScrollUp, UiScrollDown
// - UiNextPage, UiPreviousPage
```

## Implementation Details

Each InputContext maintains:

- A map of action names to input mappings
- An assignment state (active or inactive)
- Methods to manipulate these mappings

When a context is assigned, it registers all its mappings with the ActionsController. When unassigned, it removes these mappings, effectively disabling those inputs.

## Usage Recommendations

- Create different contexts for distinct gameplay modes (e.g., on-foot, driving, flying)
- Use the global context for actions that should always be available (e.g., pause, screenshot)
- Keep your menu navigation controls in a separate context from gameplay
- When switching contexts, always unassign the old context before assigning the new one to avoid conflicts
- Consider creating hierarchies of contexts (base controls + specialized controls)
