# InputKeyCodeHelper

The InputKeyCodeHelper provides utilities for working with input key codes, including getting visual representations for UI display.

## Overview

When building input-related UI, you often need to show the user which keys are bound to which actions. InputKeyCodeHelper makes it easy to get consistent and platform-appropriate key names and icons for all types of inputs, including custom keys not supported by Roblox's native input system.

## Key Concepts

- **Visual Key Representation**: Consistent way to display keys in UI
- **Custom Keys Support**: Handles custom keys like thumbstick directions
- **Input Visualization**: Provides names and images for all input types

## Core Functionality

### Getting Visual Input Key Data

```ts
import { InputKeyCodeHelper } from "@rbxts/input-actions";

// Get visual data for a key (includes name and image)
const spaceKeyData = InputKeyCodeHelper.GetVisualInputKeyCodeData(Enum.KeyCode.Space);
print(`Key Name: ${spaceKeyData.Name}`); // "Space"
print(`Image ID: ${spaceKeyData.ImageId}`); // "rbxassetid://17164171928"

// Get data for a mouse button
const mouseButtonData = InputKeyCodeHelper.GetVisualInputKeyCodeData(
	Enum.UserInputType.MouseButton1,
);

// Get data for a gamepad button
const gamepadButtonData = InputKeyCodeHelper.GetVisualInputKeyCodeData(Enum.KeyCode.ButtonA);

// Get data for a custom key (thumbstick direction)
import { ECustomKey } from "@rbxts/input-actions";
const thumbstickUpData = InputKeyCodeHelper.GetVisualInputKeyCodeData(ECustomKey.Thumbstick1Up);
```

### Using Visual Data in UI

```ts
// Create an input prompt in UI
function CreateInputPrompt(action: string, keyCode: InputKeyCode): Frame {
	const frame = new Instance("Frame");

	// Create text label for action name
	const actionLabel = new Instance("TextLabel");
	actionLabel.Text = action;
	actionLabel.Parent = frame;

	// Get visual data for the key
	const keyVisual = InputKeyCodeHelper.GetVisualInputKeyCodeData(keyCode);

	// Create image label for key icon
	const keyIcon = new Instance("ImageLabel");
	keyIcon.Image = keyVisual.ImageId;
	keyIcon.Parent = frame;

	// Create text label for key name (as fallback or tooltip)
	const keyName = new Instance("TextLabel");
	keyName.Text = keyVisual.Name;
	keyName.Parent = frame;

	return frame;
}

// Usage
const jumpPrompt = CreateInputPrompt("Jump", Enum.KeyCode.Space);
jumpPrompt.Parent = playerGui;
```

### Working with Custom Keys

```ts
import { InputKeyCodeHelper, ECustomKey } from "@rbxts/input-actions";

// Check if a key is a custom key
if (InputKeyCodeHelper.IsCustomKey(ECustomKey.MouseWheelUp)) {
	// Handle custom key specially
}

// Get just the name of a key code
const keyName = InputKeyCodeHelper.GetInputKeyCodeName(Enum.KeyCode.LeftShift); // "LeftShift"
const customKeyName = InputKeyCodeHelper.GetInputKeyCodeName(ECustomKey.Thumbstick1Left); // "Thumbstick1Left"

// Get just the image for a key
const keyImage = InputKeyCodeHelper.GetImageForKey(Enum.KeyCode.W); // "rbxassetid://17164171052"
```

## Practical Examples

### Input Binding UI

```ts
import { InputKeyCodeHelper, InputContextController } from "@rbxts/input-actions";

function CreateKeyBindingUI(context: InputContext): ScrollingFrame {
	const bindingList = new Instance("ScrollingFrame");

	// Get all actions from the context
	const actions = context.GetAllMappedActions();

	// Create a row for each action
	let yOffset = 0;
	for (const action of actions) {
		// Create container for this binding
		const bindingRow = new Instance("Frame");
		bindingRow.Size = UDim2.fromOffset(300, 40);
		bindingRow.Position = UDim2.fromOffset(0, yOffset);
		bindingRow.Parent = bindingList;

		// Action name
		const actionLabel = new Instance("TextLabel");
		actionLabel.Text = action;
		actionLabel.Size = UDim2.fromOffset(150, 40);
		actionLabel.Parent = bindingRow;

		// Get current key for this action
		const keyCode = context.GetInputKeyForCurrentDevice(action);
		if (keyCode) {
			// Get visual data for the key
			const keyVisual = InputKeyCodeHelper.GetVisualInputKeyCodeData(keyCode);

			// Key icon
			const keyIcon = new Instance("ImageLabel");
			keyIcon.Image = keyVisual.ImageId;
			keyIcon.Size = UDim2.fromOffset(32, 32);
			keyIcon.Position = UDim2.fromOffset(160, 4);
			keyIcon.Parent = bindingRow;

			// Key name
			const keyName = new Instance("TextLabel");
			keyName.Text = keyVisual.Name;
			keyName.Size = UDim2.fromOffset(100, 40);
			keyName.Position = UDim2.fromOffset(200, 0);
			keyName.Parent = bindingRow;
		}

		yOffset += 45;
	}

	return bindingList;
}

// Usage
const gameplayBindings = CreateKeyBindingUI(InputContextController.GetContext("gameplay")!);
gameplayBindings.Parent = controlsMenu;
```

### Adaptive Input Prompts

```ts
import { InputKeyCodeHelper, DeviceTypeHandler, EInputType } from "@rbxts/input-actions";

// Create a helper to show the appropriate input prompt based on current device
class InputPrompt {
	private container: Frame;
	private icon: ImageLabel;
	private label: TextLabel;

	private keyboardKey?: InputKeyCode;
	private gamepadButton?: InputKeyCode;

	constructor(parent: Instance) {
		// Create UI elements
		this.container = new Instance("Frame");
		this.icon = new Instance("ImageLabel");
		this.label = new Instance("TextLabel");

		// Set up UI hierarchy
		this.icon.Parent = this.container;
		this.label.Parent = this.container;
		this.container.Parent = parent;

		// Listen for device type changes
		DeviceTypeHandler.OnInputTypeChanged.Connect(() => {
			this.updateVisual();
		});
	}

	public SetBindings(keyboardKey: InputKeyCode, gamepadButton: InputKeyCode): void {
		this.keyboardKey = keyboardKey;
		this.gamepadButton = gamepadButton;
		this.updateVisual();
	}

	private updateVisual(): void {
		// Get the appropriate key for the current input type
		const inputType = DeviceTypeHandler.GetMainInputType();
		let keyToShow: InputKeyCode | undefined;

		if (inputType === EInputType.KeyboardAndMouse) {
			keyToShow = this.keyboardKey;
		} else if (inputType === EInputType.Gamepad) {
			keyToShow = this.gamepadButton;
		}

		if (keyToShow) {
			// Get visual data for the key
			const visual = InputKeyCodeHelper.GetVisualInputKeyCodeData(keyToShow);

			// Update UI
			this.icon.Image = visual.ImageId;
			this.label.Text = visual.Name;
			this.container.Visible = true;
		} else {
			// No key to show for current device
			this.container.Visible = false;
		}
	}
}

// Usage
const jumpPrompt = new InputPrompt(hudGui);
jumpPrompt.SetBindings(Enum.KeyCode.Space, Enum.KeyCode.ButtonA);
```

## Implementation Details

The InputKeyCodeHelper:

1. Maintains a map of all key codes to their image IDs
2. Provides utility functions to check if an input is a custom key
3. Handles the special case of UserInputType vs KeyCode
4. Returns appropriate visual data for any type of input key

## Usage Recommendations

- Use for consistent input visualization across your game
- Combine with DeviceTypeHandler to show appropriate keys for the current device
- Include both icon and text representations for accessibility
- Consider adding your own custom key images for specific game controls
- Use in rebinding UI to show users which keys they're configuring
