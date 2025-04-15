# Advanced Usage Guide

This guide covers the advanced features of the Input Actions system, with a focus on InputEcho, KeyCombination, and InputContext.

## Input Context System

The Input Context system is a powerful way to organize and manage inputs for different game states or scenarios.

### Creating and Managing Contexts

```ts
import { InputContextController } from "@rbxts/input-actions";

// Create different contexts
const globalContext = InputContextController.GetGlobalContext(); // Always active
const gameplayContext = InputContextController.CreateContext("gameplay");
const vehicleContext = InputContextController.CreateContext("vehicle");
const menuContext = InputContextController.CreateContext("menu");

// Add input mappings with device-specific controls
gameplayContext.Add("Jump", {
	KeyboardAndMouse: Enum.KeyCode.Space,
	Gamepad: Enum.KeyCode.ButtonA,
});

vehicleContext.Add("Accelerate", {
	KeyboardAndMouse: Enum.KeyCode.W,
	Gamepad: Enum.KeyCode.ButtonR2,
});

// Manage context activation
function EnterVehicle() {
	gameplayContext.Unassign();
	vehicleContext.Assign();
}

function ExitVehicle() {
	vehicleContext.Unassign();
	gameplayContext.Assign();
}
```

### Context Hierarchies

You can create hierarchies of contexts:

```ts
// Base context with common controls
const baseContext = InputContextController.CreateContext("base");
baseContext.Add("Pause", {
	KeyboardAndMouse: Enum.KeyCode.Escape,
	Gamepad: Enum.KeyCode.ButtonStart,
});

// Always keep the base context assigned
baseContext.Assign();

// Specialized contexts can be assigned/unassigned as needed
function TransitionToGameplay() {
	menuContext.Unassign();
	gameplayContext.Assign();
	// base context remains active
}
```

### Updating Mappings at Runtime

```ts
// Support for input rebinding
function RebindJumpKey(newKey: Enum.KeyCode) {
	gameplayContext.UpdateKey("Jump", "KeyboardAndMouse", newKey);
}

// Get the current key for displaying in UI
function GetCurrentJumpKey() {
	return gameplayContext.GetInputKeyForCurrentDevice("Jump");
}

// Get visual data for displaying the key
function GetJumpKeyVisual() {
	return gameplayContext.GetVisualData("Jump");
}
```

## Key Combinations

The KeyCombinationController allows detecting and handling keyboard shortcuts and multi-key combinations.

### Registering Combinations

```ts
import { KeyCombinationController } from "@rbxts/input-actions";

// Register keyboard shortcuts
KeyCombinationController.RegisterCombination("Save", Enum.KeyCode.S, [Enum.KeyCode.LeftControl]);
KeyCombinationController.RegisterCombination("Undo", Enum.KeyCode.Z, [Enum.KeyCode.LeftControl]);
KeyCombinationController.RegisterCombination("Redo", Enum.KeyCode.Y, [Enum.KeyCode.LeftControl]);

// Register single-key shortcuts
KeyCombinationController.RegisterCombination("Screenshot", Enum.KeyCode.F12);

// Register multiple modifier keys
KeyCombinationController.RegisterCombination("SaveAs", Enum.KeyCode.S, [
	Enum.KeyCode.LeftControl,
	Enum.KeyCode.LeftShift,
]);
```

### Using Key Combinations

Key combinations work like any other action:

```ts
// Check if a key combination was triggered
if (ActionsController.IsJustPressed("Save")) {
	SaveGame();
}

if (ActionsController.IsJustPressed("Undo")) {
	UndoLastAction();
}
```

### Implementation Details

- Key combinations have higher priority than regular inputs
- Modifiers must be pressed before the main key
- Combinations use the action name system, so they work with all action APIs

## Input Echo

The InputEchoController enables repeating input events when keys are held down, which is ideal for UI navigation and text input.

### Configuring Action Echo

```ts
import { InputEchoController } from "@rbxts/input-actions";

// Configure input echo with initial delay and repeat interval (in seconds)
InputEchoController.ConfigureActionEcho("UIUp", 0.4, 0.1); // Wait 0.4s, then repeat every 0.1s
InputEchoController.ConfigureActionEcho("UIDown", 0.4, 0.1);
InputEchoController.ConfigureActionEcho("UILeft", 0.4, 0.1);
InputEchoController.ConfigureActionEcho("UIRight", 0.4, 0.1);
```

### Using Echoed Actions

Once configured, echoed actions can be used like normal actions:

```ts
// Check for input including echoed repeats
if (ActionsController.IsJustPressed("UIDown")) {
	// This will trigger initially when pressed, then repeatedly based on echo settings
	SelectNextMenuItem();
}

// No special handling required - the system automatically includes echoed inputs
```

### Disabling Action Echo

When input echo is no longer needed, disable it:

```ts
function ExitMenu() {
	// Disable menu navigation echo
	InputEchoController.DisableActionEcho("UIUp");
	InputEchoController.DisableActionEcho("UIDown");
	InputEchoController.DisableActionEcho("UILeft");
	InputEchoController.DisableActionEcho("UIRight");

	// Switch context
	menuContext.Unassign();
	gameplayContext.Assign();
}
```

## Integrated Example

Here's how these advanced features work together:

```ts
import {
	InputActionsInitializationHelper,
	InputContextController,
	KeyCombinationController,
	InputEchoController,
	ActionsController,
} from "@rbxts/input-actions";

// Initialize the system
InputActionsInitializationHelper.InitAll();

// Create contexts
const menuContext = InputContextController.CreateContext("menu");
const editorContext = InputContextController.CreateContext("editor");

// Set up menu navigation with echo
menuContext.Add("MenuUp", {
	KeyboardAndMouse: Enum.KeyCode.Up,
	Gamepad: Enum.KeyCode.DPadUp,
});
menuContext.Add("MenuDown", {
	KeyboardAndMouse: Enum.KeyCode.Down,
	Gamepad: Enum.KeyCode.DPadDown,
});
menuContext.Add("MenuSelect", {
	KeyboardAndMouse: Enum.KeyCode.Return,
	Gamepad: Enum.KeyCode.ButtonA,
});
menuContext.Add("MenuBack", {
	KeyboardAndMouse: Enum.KeyCode.Escape,
	Gamepad: Enum.KeyCode.ButtonB,
});

// Configure echo for menu navigation
InputEchoController.ConfigureActionEcho("MenuUp", 0.4, 0.1);
InputEchoController.ConfigureActionEcho("MenuDown", 0.4, 0.1);

// Set up editor controls with key combinations
editorContext.Add("PlaceObject", {
	KeyboardAndMouse: Enum.UserInputType.MouseButton1,
	Gamepad: Enum.KeyCode.ButtonA,
});
editorContext.Add("SelectObject", {
	KeyboardAndMouse: Enum.UserInputType.MouseButton2,
	Gamepad: Enum.KeyCode.ButtonX,
});

// Register editor shortcuts
KeyCombinationController.RegisterCombination("Save", Enum.KeyCode.S, [Enum.KeyCode.LeftControl]);
KeyCombinationController.RegisterCombination("Copy", Enum.KeyCode.C, [Enum.KeyCode.LeftControl]);
KeyCombinationController.RegisterCombination("Paste", Enum.KeyCode.V, [Enum.KeyCode.LeftControl]);

// Game loop
RunService.Heartbeat.Connect(() => {
	// Menu navigation handling
	if (menuContext.IsAssigned()) {
		if (ActionsController.IsJustPressed("MenuUp")) {
			SelectPreviousMenuItem();
		}
		if (ActionsController.IsJustPressed("MenuDown")) {
			SelectNextMenuItem();
		}
		if (ActionsController.IsJustPressed("MenuSelect")) {
			ActivateSelectedMenuItem();
		}
		if (ActionsController.IsJustPressed("MenuBack")) {
			CloseMenu();
		}
	}

	// Editor handling
	if (editorContext.IsAssigned()) {
		if (ActionsController.IsJustPressed("Save")) {
			SaveProject();
		}
		if (ActionsController.IsJustPressed("Copy")) {
			CopySelectedObjects();
		}
		if (ActionsController.IsJustPressed("Paste")) {
			PasteObjects();
		}
	}
});

// Context switching
function OpenMenu() {
	editorContext.Unassign();
	menuContext.Assign();
}

function CloseMenu() {
	menuContext.Unassign();
	editorContext.Assign();

	// Clean up menu-specific echo handling
	InputEchoController.DisableActionEcho("MenuUp");
	InputEchoController.DisableActionEcho("MenuDown");
}
```

## Performance Considerations

These advanced features add power but can impact performance if not used carefully:

1. **Limit Active Contexts**: Only keep necessary contexts assigned
2. **Clean Up Echoes**: Disable InputEcho for actions when not needed
3. **Prefer Context Switching**: Use context switching instead of constantly checking game state
4. **Watch Combination Count**: Each key combination adds processing overhead

## Next Steps

Now that you understand the advanced features, you might want to:

1. Review the [API Reference](./API.md) for complete documentation
2. Implement a dynamic input rebinding system for your game
3. Create specialized contexts for different game mechanics
4. Explore haptic feedback with custom vibration patterns
