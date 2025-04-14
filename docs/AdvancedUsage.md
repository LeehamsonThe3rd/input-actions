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
import { InputManagerController, EInputEventSubscribtionType } from "@rbxts/input-actions";

// High priority input handler (100) that only processes key presses (not changes)
const cleanup = InputManagerController.Subscribe(
	(inputEvent) => {
		// Handle critical inputs here
		return Enum.ContextActionResult.Sink; // Prevent other handlers from processing
	},
	{
		Priority: 100,
		SubscriptionType: EInputEventSubscribtionType.KeysOnly,
	},
);
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
