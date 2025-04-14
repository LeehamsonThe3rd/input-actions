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
const gameplayContext = InputContextController.CreateContext("gameplay");
gameplayContext.Add("Jump", { KeyboardAndMouse: Enum.KeyCode.Space });
gameplayContext.Add("Shoot", { KeyboardAndMouse: Enum.UserInputType.MouseButton1 });

const menuContext = InputContextController.CreateContext("menu");
menuContext.Add("Accept", { KeyboardAndMouse: Enum.KeyCode.Return });
menuContext.Add("Back", { KeyboardAndMouse: Enum.KeyCode.Escape });

// Switch between contexts based on game state
function OpenMenu() {
	menuContext.Assign();
	gameplayContext.Unassign();
}

function CloseMenu() {
	gameplayContext.Assign();
	menuContext.Unassign();
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

// No special check needed - ActionsController.IsJustPressed handles it automatically
RunService.Heartbeat.Connect(() => {
	if (ActionsController.IsJustPressed("MenuDown")) {
		// This will trigger repeatedly when MenuDown is held down
		MoveSelectionDown();
	}
});
```

## Advanced Context Usage

You can organize your game's input handling into multiple contexts that are activated for different game states:

```ts
// Create contexts for different game states
const globalContext = InputContextController.GetGlobalContext();
const combatContext = InputContextController.CreateContext("combat");
const vehicleContext = InputContextController.CreateContext("vehicle");
const menuContext = InputContextController.CreateContext("menu");

// Global controls (always active)
globalContext.Add("Pause", {
	KeyboardAndMouse: Enum.KeyCode.Tab,
	Gamepad: Enum.KeyCode.ButtonStart,
});

// Combat controls
combatContext.Add("Attack", {
	KeyboardAndMouse: Enum.UserInputType.MouseButton1,
	Gamepad: Enum.KeyCode.ButtonR2,
});
combatContext.Add("Block", {
	KeyboardAndMouse: Enum.UserInputType.MouseButton2,
	Gamepad: Enum.KeyCode.ButtonL2,
});

// Vehicle controls
vehicleContext.Add("Accelerate", {
	KeyboardAndMouse: Enum.KeyCode.W,
	Gamepad: Enum.KeyCode.ButtonR2,
});
vehicleContext.Add("Brake", {
	KeyboardAndMouse: Enum.KeyCode.S,
	Gamepad: Enum.KeyCode.ButtonL2,
});

// Initialize the global context
globalContext.Assign();

// Switch to combat mode
function EnterCombatMode() {
	vehicleContext.Unassign();
	combatContext.Assign();
}

// Switch to vehicle mode
function EnterVehicleMode() {
	combatContext.Unassign();
	vehicleContext.Assign();
}
```

## Key Combinations

Register key combinations like Ctrl+S or Shift+R:

```ts
import { KeyCombinationController } from "@rbxts/input-actions";

// Register Ctrl+S for saving
KeyCombinationController.RegisterCombination("Save", Enum.KeyCode.S, [Enum.KeyCode.LeftControl]);

// Check for the action like any other action
if (ActionsController.IsJustPressed("Save")) {
	SaveGame();
}
```

## Haptic Feedback

Trigger controller vibration for immersive feedback:

```ts
import { HapticFeedbackController, EVibrationPreset } from "@rbxts/input-actions";

// Use a preset vibration pattern with type safety
HapticFeedbackController.VibratePreset(EVibrationPreset.Success);

// Or create a custom vibration
HapticFeedbackController.Vibrate(
	0.8, // Large motor (left) strength (0-1)
	0.4, // Small motor (right) strength (0-1)
	0.3, // Duration in seconds
);

// Using the convenience helper from InputActionsInitializationHelper
import { InputActionsInitializationHelper } from "@rbxts/input-actions";

// Pass a preset enum
InputActionsInitializationHelper.TriggerHapticFeedback(EVibrationPreset.Medium);

// Or pass a custom preset object
InputActionsInitializationHelper.TriggerHapticFeedback({
	LargeMotor: 0.6,
	SmallMotor: 0.3,
	Duration: 0.25,
});

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
import { DeviceTypeHandler, EInputType, EDeviceType } from "@rbxts/input-actions";

// Listen for input type changes
DeviceTypeHandler.OnInputTypeChanged.Connect((inputType: EInputType) => {
	switch (inputType) {
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

// Check the current input type
const currentInputType = DeviceTypeHandler.GetMainInputType();

// Get the device type (PC, Phone, Tablet, Console, VR)
const deviceType = DeviceTypeHandler.GetMainDeviceType();
```

## Creating Custom Visual Indicators

You can display key bindings to players with proper icons:

```ts
import { InputContextController, InputKeyCodeHelper } from "@rbxts/input-actions";

// Get the context containing the action
const gameplayContext = InputContextController.GetContext("gameplay")!;

// Get visual data for displaying the "Jump" action input
const jumpVisualData = gameplayContext.GetVisualData("Jump");

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
import { InputContextController, EDefaultInputAction } from "@rbxts/input-actions";

// Access the UI control context
const uiContext = InputContextController.UIControlContext;

// Update a UI navigation action
uiContext.UpdateKey(EDefaultInputAction.UiGoUp, "KeyboardAndMouse", Enum.KeyCode.W);
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
