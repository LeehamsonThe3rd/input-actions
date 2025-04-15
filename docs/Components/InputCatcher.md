# InputCatcher

The InputCatcher provides a way to completely block all user input when needed.

## Overview

Sometimes you need to temporarily prevent all input from reaching your game, such as during cutscenes, loading screens, or when a modal dialog is open. The InputCatcher makes this easy by creating a high-priority input sink that captures and blocks all user input.

## Key Concepts

- **Input Blocking**: Preventing input events from reaching other parts of the game
- **Priority-Based**: Uses priority system to ensure input is blocked regardless of other handlers
- **Temporary Control**: Easily grab and release input as needed

## Core Functionality

### Creating an InputCatcher

```ts
import { InputCatcher } from "@rbxts/input-actions";

// Create a new input catcher with high priority (higher numbers have higher priority)
const modalDialogInputCatcher = new InputCatcher(1000);

// Create one with even higher priority
const cutsceneInputCatcher = new InputCatcher(2000);
```

### Blocking and Releasing Input

```ts
// Start blocking all input
modalDialogInputCatcher.GrabInput();

// Later, when done, restore normal input handling
modalDialogInputCatcher.ReleaseInput();

// Check if the catcher is currently active
if (modalDialogInputCatcher.IsActive()) {
	// Input is currently being blocked
}
```

## Practical Examples

### Modal Dialog System

```ts
import { InputCatcher } from "@rbxts/input-actions";

class ModalDialog {
	private inputCatcher = new InputCatcher(1000);
	private dialogGui: ScreenGui;

	constructor(title: string, message: string) {
		// Create dialog GUI
		this.dialogGui = new Instance("ScreenGui");
		// Set up GUI elements...

		// Block all input when dialog is shown
		this.inputCatcher.GrabInput();
	}

	public Close(): void {
		// Release input when dialog is closed
		this.inputCatcher.ReleaseInput();

		// Remove dialog GUI
		this.dialogGui.Destroy();
	}
}

// Usage
function ShowErrorDialog(message: string) {
	const dialog = new ModalDialog("Error", message);

	// Create close button functionality
	const closeButton = dialog.GetCloseButton();
	closeButton.Activated.Connect(() => {
		dialog.Close();
	});

	return dialog;
}
```

### Cutscene System

```ts
import { InputCatcher } from "@rbxts/input-actions";

class CutsceneManager {
	private inputCatcher = new InputCatcher(2000);
	private isPlaying = false;

	public PlayCutscene(cutsceneId: string): Promise<void> {
		if (this.isPlaying) return Promise.reject("Cutscene already playing");

		this.isPlaying = true;
		this.inputCatcher.GrabInput();

		// Return a promise that resolves when cutscene finishes
		return new Promise((resolve) => {
			// Cutscene playing logic...

			// When cutscene finishes:
			const finishCutscene = () => {
				this.inputCatcher.ReleaseInput();
				this.isPlaying = false;
				resolve();
			};

			// Set up completion trigger or skip handler
			// ...

			// Example: Allow skipping with ESC key while still blocking all other input
			UserInputService.InputEnded.Connect((input) => {
				if (input.KeyCode === Enum.KeyCode.Escape && this.isPlaying) {
					finishCutscene();
				}
			});
		});
	}

	public SkipCurrentCutscene(): void {
		if (!this.isPlaying) return;

		// Skip cutscene logic...
		this.inputCatcher.ReleaseInput();
		this.isPlaying = false;
	}
}
```

### Loading Screen

```ts
import { InputCatcher } from "@rbxts/input-actions";

class LoadingScreen {
	private static instance: LoadingScreen;
	private inputCatcher = new InputCatcher(3000); // Very high priority
	private loadingGui: ScreenGui;

	private constructor() {
		// Create loading screen GUI
		this.loadingGui = new Instance("ScreenGui");
		// Set up GUI elements...

		// Initially invisible
		this.loadingGui.Enabled = false;
	}

	public static GetInstance(): LoadingScreen {
		if (!LoadingScreen.instance) {
			LoadingScreen.instance = new LoadingScreen();
		}
		return LoadingScreen.instance;
	}

	public Show(): void {
		// Block all input while loading
		this.inputCatcher.GrabInput();

		// Show loading screen
		this.loadingGui.Enabled = true;
	}

	public Hide(): void {
		// Restore normal input handling
		this.inputCatcher.ReleaseInput();

		// Hide loading screen
		this.loadingGui.Enabled = false;
	}
}

// Usage
async function LoadLevel(levelId: string) {
	const loadingScreen = LoadingScreen.GetInstance();
	loadingScreen.Show();

	try {
		await LoadLevelAssets(levelId);
		// Level loaded successfully
	} catch (error) {
		// Handle error
	} finally {
		// Always hide loading screen when done
		loadingScreen.Hide();
	}
}
```

## Implementation Details

The InputCatcher:

1. Creates a unique identifier for each catcher instance
2. Uses ContextActionService.BindActionAtPriority to create a high-priority input sink
3. Captures all key codes to ensure complete input blocking
4. Returns Enum.ContextActionResult.Sink to prevent input propagation
5. Tracks its active state for easy reference

## Usage Recommendations

- Use InputCatcher for temporary input blocking, not for permanent input management
- Remember to release input when done to prevent permanently blocking user input
- Create catchers with different priorities for nested UI elements
- For more selective input management, use InputContextController instead
- Always store a reference to your InputCatcher so you can release it later
