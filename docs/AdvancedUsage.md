# Advanced Usage

## Custom Input Keys

The package supports custom input keys for complex inputs like thumbstick directions:

```ts
import { ECustomKey } from "@rbxts/input-actions";

// Bind thumbstick up movement to an action
ActionsController.AddKeyCode("MoveForward", ECustomKey.Thumbstick1Up);
```

Available custom keys include:

- Thumbstick directions (Up, Down, Left, Right for both thumbsticks)
- Mouse wheel movements
- Mouse directional movement

## Input Priority

You can set priority for input subscriptions to control which handlers process input first:

```ts
import { InputManagerController, EInputEventSubscriptionType } from "@rbxts/input-actions";

// High priority input handler (100) that only processes key presses (not changes)
const cleanup = InputManagerController.Subscribe(
	(inputEvent) => {
		// Handle critical inputs here
		return Enum.ContextActionResult.Sink; // Prevent other handlers from processing
	},
	{
		Priority: 100,
		SubscriptionType: EInputEventSubscriptionType.KeysOnly,
	},
);
```

## Input Contexts

You can create different input mappings for different game states (like gameplay, menu, vehicle control):

```ts
import { InputContextController } from "@rbxts/input-actions";

// Create different contexts
InputContextController.CreateContext("gameplay");
InputContextController.AddActionToContext("gameplay", "Jump", Enum.KeyCode.Space);
InputContextController.AddActionToContext("gameplay", "Shoot", Enum.KeyCode.MouseButton1);

InputContextController.CreateContext("menu");
InputContextController.AddActionToContext("menu", "Accept", Enum.KeyCode.Return);
InputContextController.AddActionToContext("menu", "Back", Enum.KeyCode.Escape);

// Switch between contexts based on game state
function openMenu() {
	InputContextController.SetActiveContext("menu");
}

function closeMenu() {
	InputContextController.SetActiveContext("gameplay");
}
```

## Input Echo (Key Repeat)

For menus and text input, you may want to repeat an action when a key is held down:

```ts
import { InputEchoController } from "@rbxts/input-actions";

// Configure menu navigation to repeat after 0.4s initial delay, then every 0.1s
InputEchoController.ConfigureActionEcho("MenuUp", 0.4, 0.1);
InputEchoController.ConfigureActionEcho("MenuDown", 0.4, 0.1);

// Later, disable echo if needed
InputEchoController.DisableActionEcho("MenuUp");
```

## Key Combinations

Register key combinations like Ctrl+S or Shift+R:

```ts
import { KeyCombinationController } from "@rbxts/input-actions";

// Register Ctrl+S for saving
KeyCombinationController.RegisterCombination("Save", Enum.KeyCode.S, [Enum.KeyCode.LeftControl]);

// Check for the action like any other action
if (ActionsController.IsJustPressed("Save")) {
	saveGame();
}
```

## Haptic Feedback

Trigger controller vibration for immersive feedback:

```ts
import { HapticFeedbackController } from "@rbxts/input-actions";

// Use a preset vibration pattern
HapticFeedbackController.VibratePreset("success");

// Or create a custom vibration
HapticFeedbackController.Vibrate(
	0.8, // Large motor (left) strength (0-1)
	0.4, // Small motor (right) strength (0-1)
	0.3, // Duration in seconds
);

// Register your own presets
HapticFeedbackController.RegisterPreset("pickupItem", 0.3, 0.6, 0.15);

// Stop all vibration immediately
HapticFeedbackController.StopAll();
```

## Input Configuration

Fine-tune input sensitivity and deadzones:

```ts
import { InputConfigController, ECustomKey } from "@rbxts/input-actions";

// Set thumbstick deadzone (eliminates drift)
InputConfigController.SetInputDeadzone(Enum.KeyCode.Thumbstick1, 0.2);

// Require a stronger press for an action (like aiming)
InputConfigController.SetActionActivationThreshold("Aim", 0.7);

// Different deadzones for different directions
InputConfigController.SetInputDeadzone(ECustomKey.Thumbstick1Up, 0.15);
InputConfigController.SetInputDeadzone(ECustomKey.Thumbstick1Down, 0.25);
```

## Mouse Control

The MouseController provides advanced mouse control:

```ts
import { MouseController, EMouseLockAction } from "@rbxts/input-actions";

// Create a mouse lock action to lock the mouse to screen center
const mouseLock = new MouseController.MouseLockAction(EMouseLockAction.LockMouseCenter);

// Activate the mouse lock
mouseLock.SetActive(true);

// Later, deactivate it
mouseLock.SetActive(false);
```

## Detecting Input Device Changes

You can respond to changes in the player's input device:

```ts
import { InputTypeController, EInputType, EDeviceType } from "@rbxts/input-actions";

// Listen for input type changes
InputTypeController.OnInputTypeChanged.Connect((inputType: EInputType) => {
	switch (inputType) {
		case EInputType.KeyboardAndMouse:
			showKeyboardControls();
			break;
		case EInputType.Gamepad:
			showGamepadControls();
			break;
		case EInputType.Touch:
			showTouchControls();
			break;
	}
});

// Check the current input type
const currentInputType = InputTypeController.GetMainInputType();

// Get the device type (PC, Phone, Tablet, Console, VR)
const deviceType = InputTypeController.GetMainDeviceType();
```

## Creating Custom Visual Indicators

You can display key bindings to players with proper icons:

```ts
import { InputMapController } from "@rbxts/input-actions";

// Get visual data for displaying the "Jump" action input
const jumpVisualData = InputMapController.GetVisualData("Jump");

// Create a UI element to show the key/button
const keyImage = new Instance("ImageLabel");
keyImage.Image = jumpVisualData.ImageId;
keyImage.Parent = playerGui;

// Add text fallback
const keyText = new Instance("TextLabel");
keyText.Text = jumpVisualData.Name;
keyText.Parent = playerGui;
```

## Modifying Default Actions

The package comes with default actions for UI navigation:

```ts
import { InputMapController, EDefaultInputAction } from "@rbxts/input-actions";

// Change the UI navigation actions
InputMapController.Delete(EDefaultInputAction.UiGoUp);
InputMapController.Add(EDefaultInputAction.UiGoUp, {
	KeyboardAndMouse: Enum.KeyCode.W,
	Gamepad: Enum.KeyCode.DPadUp,
});
```

## Creating a Custom Input Catcher

Sometimes you need to temporarily capture all inputs:

```ts
import { InputCatcher } from "@rbxts/input-actions";

// Create an input catcher with a high priority
const inputCatcher = new InputCatcher(100);

// Grab all inputs (e.g., during a cutscene)
inputCatcher.GrabInput();

// Later, release inputs back to normal handling
inputCatcher.ReleaseInput();
```
