# KeyCombinationController

The KeyCombinationController enables detection and handling of key combinations (keyboard shortcuts) such as Ctrl+S or Shift+Tab.

## Overview

Key combinations are powerful tools for providing shortcuts to users, especially in editing tools, developer consoles, or PC-focused games. This controller provides an easy way to define and detect these combinations.

## Key Concepts

- **Main Key**: The primary key in a combination (e.g., the "S" in Ctrl+S)
- **Modifier Keys**: Additional keys that must be held (e.g., Ctrl, Shift, Alt)
- **Combination Action**: The action triggered when the combination is detected

## Core Functionality

### Registering Key Combinations

```ts
import { KeyCombinationController } from "@rbxts/input-actions";

// Register a basic keyboard shortcut (Ctrl+S)
KeyCombinationController.RegisterCombination(
	"Save", // Action name
	Enum.KeyCode.S, // Main key
	[Enum.KeyCode.LeftControl], // Modifier keys
);

// Register a key combination with multiple modifiers (Ctrl+Shift+Z)
KeyCombinationController.RegisterCombination("Redo", Enum.KeyCode.Z, [
	Enum.KeyCode.LeftControl,
	Enum.KeyCode.LeftShift,
]);

// Register a simple key without modifiers
KeyCombinationController.RegisterCombination("Screenshot", Enum.KeyCode.F12);
```

### Detecting Key Combinations

Once registered, key combinations automatically create actions that can be checked using the standard ActionsController methods:

```ts
import { ActionsController } from "@rbxts/input-actions";

// Check if the Save combination was triggered
if (ActionsController.IsJustPressed("Save")) {
	SaveDocument();
}

// Check if the Redo combination was triggered
if (ActionsController.IsJustPressed("Redo")) {
	RedoLastAction();
}
```

### Practical Examples

#### Editor Shortcuts

```ts
// Set up standard editor shortcuts
function SetupEditorShortcuts() {
	// File operations
	KeyCombinationController.RegisterCombination("Save", Enum.KeyCode.S, [Enum.KeyCode.LeftControl]);
	KeyCombinationController.RegisterCombination("Open", Enum.KeyCode.O, [Enum.KeyCode.LeftControl]);
	KeyCombinationController.RegisterCombination("New", Enum.KeyCode.N, [Enum.KeyCode.LeftControl]);

	// Edit operations
	KeyCombinationController.RegisterCombination("Cut", Enum.KeyCode.X, [Enum.KeyCode.LeftControl]);
	KeyCombinationController.RegisterCombination("Copy", Enum.KeyCode.C, [Enum.KeyCode.LeftControl]);
	KeyCombinationController.RegisterCombination("Paste", Enum.KeyCode.V, [Enum.KeyCode.LeftControl]);

	// Undo/Redo
	KeyCombinationController.RegisterCombination("Undo", Enum.KeyCode.Z, [Enum.KeyCode.LeftControl]);
	KeyCombinationController.RegisterCombination("Redo", Enum.KeyCode.Y, [Enum.KeyCode.LeftControl]);
}

// Check for triggered shortcuts
RunService.Heartbeat.Connect(() => {
	if (ActionsController.IsJustPressed("Save")) SaveProject();
	if (ActionsController.IsJustPressed("Open")) OpenProject();
	if (ActionsController.IsJustPressed("New")) NewProject();
	if (ActionsController.IsJustPressed("Cut")) CutSelection();
	if (ActionsController.IsJustPressed("Copy")) CopySelection();
	if (ActionsController.IsJustPressed("Paste")) PasteContent();
	if (ActionsController.IsJustPressed("Undo")) UndoLastAction();
	if (ActionsController.IsJustPressed("Redo")) RedoLastAction();
});
```

#### Game Development Console

```ts
// Set up developer console shortcuts
KeyCombinationController.RegisterCombination("ToggleConsole", Enum.KeyCode.F1);
KeyCombinationController.RegisterCombination("ClearConsole", Enum.KeyCode.K, [
	Enum.KeyCode.LeftControl,
]);
KeyCombinationController.RegisterCombination("RunCommand", Enum.KeyCode.Return);

// Handle developer console controls
RunService.Heartbeat.Connect(() => {
	if (ActionsController.IsJustPressed("ToggleConsole")) {
		ToggleDeveloperConsole();
	}

	if (consoleVisible) {
		if (ActionsController.IsJustPressed("ClearConsole")) {
			ClearConsoleOutput();
		}

		if (ActionsController.IsJustPressed("RunCommand")) {
			ExecuteCurrentCommand();
		}
	}
});
```

## Implementation Details

The KeyCombinationController:

1. Maintains a list of registered key combinations
2. Subscribes to input events with high priority to detect combinations
3. Checks if modifier keys are pressed when main keys are detected
4. Triggers actions via ActionsController when combinations are detected
5. Sinks the input to prevent the main key from triggering its regular action

## Usage Recommendations

- Use for keyboard shortcuts in PC-focused games and tools
- Provide visual indications of available shortcuts in your UI
- Be mindful of standard shortcuts users might expect (Ctrl+S for save, etc.)
- Consider platform differences when using modifiers (Ctrl vs Cmd on Mac)
- Keep combinations simple and intuitive
- For complex games, document the available shortcuts
- Don't overuse - focus on the most common operations
