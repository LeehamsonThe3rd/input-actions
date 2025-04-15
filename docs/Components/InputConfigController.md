# InputConfigController

The InputConfigController manages configuration settings for input sensitivity, deadzones, and activation thresholds.

## Overview

This controller allows you to fine-tune how input is processed, especially for analog inputs like thumbsticks, triggers, and mouse movement. It provides a way to set and retrieve configuration values that affect the feel and responsiveness of controls.

## Key Concepts

- **Activation Threshold**: Minimum strength required for an action to be considered "pressed"
- **Deadzone**: Region near the center of analog inputs that is ignored to prevent drift
- **Input Sensitivity**: Controls how raw input values are mapped to action strengths

## Core Functionality

### Setting Action Activation Thresholds

```ts
import { InputConfigController } from "@rbxts/input-actions";

// Set the activation threshold for an action (0-1)
// Lower values make the action more sensitive
InputConfigController.SetActionActivationThreshold("Jump", 0.5); // Default
InputConfigController.SetActionActivationThreshold("Crouch", 0.2); // More sensitive
InputConfigController.SetActionActivationThreshold("Fire", 0.8); // Less sensitive
```

### Getting Action Activation Thresholds

```ts
// Get the activation threshold for an action
const jumpThreshold = InputConfigController.GetActionActivationThreshold("Jump");
print(`Jump activates at: ${jumpThreshold * 100}%`); // e.g., "Jump activates at: 50%"
```

### Setting Input Deadzones

```ts
import { InputConfigController } from "@rbxts/input-actions";
import { ECustomKey } from "@rbxts/input-actions";

// Set deadzone for thumbsticks
InputConfigController.SetInputDeadzone(Enum.KeyCode.Thumbstick1, 0.15); // 15% deadzone
InputConfigController.SetInputDeadzone(Enum.KeyCode.Thumbstick2, 0.1); // 10% deadzone

// Set deadzone for individual thumbstick directions
InputConfigController.SetInputDeadzone(ECustomKey.Thumbstick1Up, 0.12);
InputConfigController.SetInputDeadzone(ECustomKey.Thumbstick1Down, 0.12);

// Set deadzone for triggers
InputConfigController.SetInputDeadzone(Enum.KeyCode.ButtonR2, 0.05);
InputConfigController.SetInputDeadzone(Enum.KeyCode.ButtonL2, 0.05);
```

### Getting Input Deadzones

```ts
// Get the deadzone for a specific input
const thumbstickDeadzone = InputConfigController.GetInputDeadzone(Enum.KeyCode.Thumbstick1);
print(`Thumbstick deadzone: ${thumbstickDeadzone * 100}%`); // e.g., "Thumbstick deadzone: 15%"
```

## Practical Examples

### Configurable Control Sensitivity

```ts
// Create a settings menu for control sensitivity
function CreateSensitivitySettings() {
	// Set up UI sliders for each setting
	const thumbstickDeadzoneSlider = new Slider(0, 0.5, 0.01);
	const triggerSensitivitySlider = new Slider(0.1, 1, 0.05);
	const aimSensitivitySlider = new Slider(0.1, 2, 0.1);

	// Initialize with current values
	thumbstickDeadzoneSlider.Value = InputConfigController.GetInputDeadzone(Enum.KeyCode.Thumbstick1);
	triggerSensitivitySlider.Value = 1 - InputConfigController.GetActionActivationThreshold("Fire");
	aimSensitivitySlider.Value = GetAimSensitivityMultiplier();

	// Connect slider changes to config updates
	thumbstickDeadzoneSlider.OnValueChanged.Connect((value) => {
		InputConfigController.SetInputDeadzone(Enum.KeyCode.Thumbstick1, value);
		InputConfigController.SetInputDeadzone(Enum.KeyCode.Thumbstick2, value);
		SaveSettings();
	});

	triggerSensitivitySlider.OnValueChanged.Connect((value) => {
		// Convert sensitivity to threshold (higher sensitivity = lower threshold)
		const threshold = 1 - value;
		InputConfigController.SetActionActivationThreshold("Fire", threshold);
		SaveSettings();
	});

	aimSensitivitySlider.OnValueChanged.Connect((value) => {
		SetAimSensitivityMultiplier(value);
		SaveSettings();
	});

	// Load settings function
	function LoadSettings() {
		const settings = GetSavedSettings();
		if (settings) {
			thumbstickDeadzoneSlider.Value = settings.thumbstickDeadzone;
			triggerSensitivitySlider.Value = settings.triggerSensitivity;
			aimSensitivitySlider.Value = settings.aimSensitivity;

			// Apply loaded settings
			InputConfigController.SetInputDeadzone(Enum.KeyCode.Thumbstick1, settings.thumbstickDeadzone);
			InputConfigController.SetInputDeadzone(Enum.KeyCode.Thumbstick2, settings.thumbstickDeadzone);
			InputConfigController.SetActionActivationThreshold("Fire", 1 - settings.triggerSensitivity);
			SetAimSensitivityMultiplier(settings.aimSensitivity);
		}
	}

	// Initial load
	LoadSettings();

	return {
		panel: sensitivityPanel,
		loadSettings: LoadSettings,
	};
}
```

### Adaptive Deadzones for Different Controllers

```ts
// Adjust deadzones based on controller type
function ConfigureControllerSettings(controllerType: string) {
	switch (controllerType) {
		case "Xbox":
			// Xbox controllers often need slightly higher deadzones
			InputConfigController.SetInputDeadzone(Enum.KeyCode.Thumbstick1, 0.12);
			InputConfigController.SetInputDeadzone(Enum.KeyCode.Thumbstick2, 0.12);
			break;

		case "PlayStation":
			// PlayStation controllers can use lower deadzones
			InputConfigController.SetInputDeadzone(Enum.KeyCode.Thumbstick1, 0.08);
			InputConfigController.SetInputDeadzone(Enum.KeyCode.Thumbstick2, 0.08);
			break;

		case "Switch":
			// Nintendo Switch Joy-Cons might need higher deadzones
			InputConfigController.SetInputDeadzone(Enum.KeyCode.Thumbstick1, 0.15);
			InputConfigController.SetInputDeadzone(Enum.KeyCode.Thumbstick2, 0.15);
			break;

		case "Generic":
		default:
			// Default values for other controllers
			InputConfigController.SetInputDeadzone(Enum.KeyCode.Thumbstick1, 0.1);
			InputConfigController.SetInputDeadzone(Enum.KeyCode.Thumbstick2, 0.1);
			break;
	}
}

// Detect controller type and configure
function DetectAndConfigureController() {
	// This would use a controller detection method
	const controllerType = DetectControllerType();
	ConfigureControllerSettings(controllerType);
}
```

## Implementation Details

The InputConfigController maintains:

- A map of action names to their activation thresholds
- A map of input keys to their deadzone values
- Default values for common scenarios

It provides these values to other controllers (like InputManagerController) when they process raw input values.

## Usage Recommendations

- Provide reasonable defaults for casual players
- Allow players to customize sensitivity settings
- Use lower deadzones (0.05-0.1) for high-quality controllers
- Use higher deadzones (0.1-0.2) for entry-level or worn controllers
- Consider different thresholds for different actions:
  - Lower thresholds (more sensitive) for critical actions like firing
  - Higher thresholds (less sensitive) for actions with consequences like using special abilities
- For fine-grained control, configure individual thumbstick directions separately
- Save and restore user preferences between play sessions
