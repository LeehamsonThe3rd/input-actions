# DeviceTypeHandler

The DeviceTypeHandler detects and manages information about the current input device being used by the player, allowing your game to adapt to different platforms.

## Overview

This utility enables your game to respond appropriately to different input devices and screen types. It automatically detects when the player switches input methods (e.g., from keyboard to gamepad) and notifies your code so you can update UI and controls accordingly.

## Key Concepts

- **Input Type**: The type of input method being used (keyboard/mouse, gamepad, touch)
- **Device Type**: The physical device type (PC, phone, tablet, console, VR)
- **Input Change Detection**: Detecting when a player switches input methods

## Core Functionality

### Getting Current Device Information

```ts
import { DeviceTypeHandler, EInputType, EDeviceType } from "@rbxts/input-actions";

// Get the primary input method being used
const currentInputType = DeviceTypeHandler.GetMainInputType();
if (currentInputType === EInputType.KeyboardAndMouse) {
	// Player is using keyboard and mouse
} else if (currentInputType === EInputType.Gamepad) {
	// Player is using a gamepad/controller
} else if (currentInputType === EInputType.Touch) {
	// Player is using touch input
}

// Get the specific device type
const deviceType = DeviceTypeHandler.GetMainDeviceType();
if (deviceType === EDeviceType.Pc) {
	// Player is on a PC
} else if (deviceType === EDeviceType.Phone) {
	// Player is on a phone
} else if (deviceType === EDeviceType.Tablet) {
	// Player is on a tablet
} else if (deviceType === EDeviceType.Console) {
	// Player is on a console
} else if (deviceType === EDeviceType.Vr) {
	// Player is using VR
}
```

### Detecting Input Type Changes

```ts
// Listen for input type changes
DeviceTypeHandler.OnInputTypeChanged.Connect((newInputType) => {
	// Update UI to match the new input type
	switch (newInputType) {
		case EInputType.KeyboardAndMouse:
			ShowKeyboardControls();
			break;
		case EInputType.Gamepad:
			ShowGamepadControls();
			break;
		case EInputType.Touch:
			ShowTouchControls();
			break;
	}
});

// Listen for device type changes
DeviceTypeHandler.OnDeviceTypeChanged.Connect((newDeviceType) => {
	// Adjust UI layout for the device type
	switch (newDeviceType) {
		case EDeviceType.Phone:
			SetCompactLayout();
			break;
		case EDeviceType.Tablet:
			SetMediumLayout();
			break;
		case EDeviceType.Pc:
		case EDeviceType.Console:
			SetFullLayout();
			break;
		case EDeviceType.Vr:
			SetVrLayout();
			break;
	}
});
```

### Practical Examples

#### Adaptive Control Prompts

```ts
// Update control prompts based on input type
function UpdateControlPrompts() {
	const inputType = DeviceTypeHandler.GetMainInputType();

	// Get the appropriate key/button for the "Jump" action
	if (inputType === EInputType.KeyboardAndMouse) {
		jumpPrompt.Text = "Press [Space] to Jump";
		interactPrompt.Text = "Press [E] to Interact";
	} else if (inputType === EInputType.Gamepad) {
		jumpPrompt.Text = "Press [A] to Jump";
		interactPrompt.Text = "Press [X] to Interact";
	} else if (inputType === EInputType.Touch) {
		// For touch, prompts might be different or unnecessary
		jumpPrompt.Visible = false;
		interactPrompt.Visible = false;
	}
}

// Connect to input type changes
DeviceTypeHandler.OnInputTypeChanged.Connect(() => {
	UpdateControlPrompts();
});

// Initial setup
UpdateControlPrompts();
```

#### Responsive UI Layout

```ts
// Adjust UI based on device type
function SetupResponsiveUI() {
	const deviceType = DeviceTypeHandler.GetMainDeviceType();

	// Adjust UI scale and layout
	switch (deviceType) {
		case EDeviceType.Phone:
			uiRoot.Size = UDim2.fromScale(1, 1);
			buttonSize = UDim2.fromOffset(70, 70);
			fontSize = 14;
			break;
		case EDeviceType.Tablet:
			uiRoot.Size = UDim2.fromScale(0.8, 0.8);
			buttonSize = UDim2.fromOffset(100, 100);
			fontSize = 18;
			break;
		case EDeviceType.Pc:
		case EDeviceType.Console:
			uiRoot.Size = UDim2.fromScale(0.6, 0.6);
			buttonSize = UDim2.fromOffset(50, 50);
			fontSize = 16;
			break;
		case EDeviceType.Vr:
			// VR-specific layout
			setupVRInterface();
			break;
	}

	// Apply changes to all UI elements
	UpdateAllUIElements(buttonSize, fontSize);
}

// Update when device changes
DeviceTypeHandler.OnDeviceTypeChanged.Connect(() => {
	SetupResponsiveUI();
});

// Initial setup
SetupResponsiveUI();
```

## Implementation Details

The DeviceTypeHandler:

1. Monitors the UserInputService for changes in available input methods
2. Checks the TouchGui's JumpButton size to distinguish between phones and tablets
3. Polls regularly to detect changes in the input environment
4. Fires events when input or device types change

## Usage Recommendations

- Connect to the change events early in your game's lifecycle
- Use input type to show appropriate control prompts
- Use device type to adjust UI layout and scale
- For more detailed input handling, combine with InputContextController to load different control schemes
- Consider that players may switch input methods during gameplay (e.g., picking up a controller after using keyboard)
- Maintain consistent functionality across all input types when possible
