# Component Guides

This document provides detailed guides for each major component of the Input Actions system.

## Table of Contents

- [ActionsController](#actionscontroller)
- [InputManagerController](#inputmanagercontroller)
- [InputContextController](#inputcontextcontroller)
- [DeviceTypeHandler](#devicetypehandler)
- [MouseController](#mousecontroller)
- [KeyCombinationController](#keycombinationcontroller)
- [InputEchoController](#inputechocontroller)
- [HapticFeedbackController](#hapticfeedbackcontroller)
- [InputConfigController](#inputconfigcontroller)
- [RawInputHandler](#rawinputhandler)
- [InputKeyCodeHelper](#inputkeycodehelper)
- [Mouse Lock Action Priorities](#mouse-lock-action-priorities)
- [InputCatcher](#inputcatcher)
- [InputActionsInitializationHelper](#inputactionsinitializationhelper)

## ActionsController

The ActionsController is the core component for managing input actions. It handles registering actions, binding keys to actions, and tracking action states.

### Basic Usage

```ts
// Create a new action
ActionsController.Add("Jump");

// Bind keys to the action
ActionsController.AddKeyCode("Jump", Enum.KeyCode.Space);
ActionsController.AddKeyCode("Jump", Enum.KeyCode.ButtonA); // Gamepad support

// Check action state
if (ActionsController.IsPressed("Jump")) {
	// Action is currently pressed
}

if (ActionsController.IsJustPressed("Jump")) {
	// Action was just pressed this frame
}

if (ActionsController.IsJustReleased("Jump")) {
	// Action was just released this frame
}
```

### Advanced Usage

```ts
// Create an action with custom activation threshold
ActionsController.Add("Aim", 0.7); // Requires 70% press strength to activate

// Get analog input strength (for triggers, thumbsticks, etc.)
const accelerationAmount = ActionsController.GetPressStrength("Accelerate");

// Get all actions mapped to a specific key
const actionsForSpaceKey = ActionsController.GetActionsFromKeyCode(Enum.KeyCode.Space);

// Get all keys mapped to a specific action
const keysForJumpAction = ActionsController.GetKeyCodes("Jump");

// Remove a key from an action
ActionsController.EraseKeyCode("Jump", Enum.KeyCode.Space);

// Remove all keys from an action
ActionsController.EraseAllKeyCodes("Jump");

// Delete an action completely
ActionsController.Erase("Jump");
```

## InputManagerController

The InputManagerController handles the low-level processing of input events. It converts Roblox input events into the system's InputEvent format and allows subscribing to these events.

### Subscribing to Input Events

```ts
import { InputManagerController, EInputEventSubscriptionType } from "@rbxts/input-actions";

// Basic subscription
const cleanup = InputManagerController.Subscribe((inputEvent) => {
	if (inputEvent.IsAction("Fire") && inputEvent.IsPressed()) {
		FireWeapon();
	}
});

// Advanced subscription with options
const highPriorityCleanup = InputManagerController.Subscribe(
	(inputEvent) => {
		// Handle UI input with high priority
		if (inputEvent.IsAction("UiSelect")) {
			return Enum.ContextActionResult.Sink; // Prevent other handlers from processing
		}
	},
	{
		Priority: 100, // Higher priorities are processed first
		SubscriptionType: EInputEventSubscriptionType.KeysOnly, // Only handle key presses, not analog changes
	},
);

// Clean up subscriptions when no longer needed
cleanup();
highPriorityCleanup();
```

## InputContextController

The InputContextController provides a high-level way to manage groups of input mappings. It allows you to define "contexts" of related inputs and switch between them easily.

### Creating and Using Contexts

```ts
import { InputContextController } from "@rbxts/input-actions";

// Create contexts for different game states
const gameplayContext = InputContextController.CreateContext("gameplay");
const menuContext = InputContextController.CreateContext("menu");
const vehicleContext = InputContextController.CreateContext("vehicle");

// Add input mappings to contexts
gameplayContext.Add("Jump", {
	KeyboardAndMouse: Enum.KeyCode.Space,
	Gamepad: Enum.KeyCode.ButtonA,
});

menuContext.Add("SelectOption", {
	KeyboardAndMouse: Enum.KeyCode.Return,
	Gamepad: Enum.KeyCode.ButtonA,
});

vehicleContext.Add("Accelerate", {
	KeyboardAndMouse: Enum.KeyCode.W,
	Gamepad: Enum.KeyCode.ButtonR2,
});

// Switch contexts based on game state
function EnterVehicle() {
	gameplayContext.Unassign();
	vehicleContext.Assign();
}

function ExitVehicle() {
	vehicleContext.Unassign();
	gameplayContext.Assign();
}

function OpenMenu() {
	gameplayContext.Unassign();
	menuContext.Assign();
}

function CloseMenu() {
	menuContext.Unassign();
	gameplayContext.Assign();
}
```

### Getting Visual Input Representations

```ts
// Get the current key binding for an action based on the active input device
const jumpKey = gameplayContext.GetInputKeyForCurrentDevice("Jump");

// Get visual data for displaying the key in the UI
const jumpKeyVisual = gameplayContext.GetVisualData("Jump");
print(`Press ${jumpKeyVisual.DisplayName} to jump`);
```

## DeviceTypeHandler

The DeviceTypeHandler detects and tracks the input device being used by the player.

```ts
import { DeviceTypeHandler, EInputType, EDeviceType } from "@rbxts/input-actions";

// Get the current input type
const inputType = DeviceTypeHandler.GetMainInputType();

// Show appropriate control hints based on input type
if (inputType === EInputType.KeyboardAndMouse) {
	ShowKeyboardControls();
} else if (inputType === EInputType.Gamepad) {
	ShowGamepadControls();
} else if (inputType === EInputType.Touch) {
	ShowTouchControls();
}

// Get device type for platform-specific behavior
const deviceType = DeviceTypeHandler.GetMainDeviceType();
if (deviceType === EDeviceType.Phone || deviceType === EDeviceType.Tablet) {
	// Mobile-specific adjustments
}

// Listen for input type changes
DeviceTypeHandler.OnInputTypeChanged.Connect((newInputType) => {
	UpdateControlDisplay(newInputType);
});
```

## MouseController

The MouseController provides advanced control over mouse behavior, including locking the mouse cursor.

```ts
import { MouseController, EMouseLockAction } from "@rbxts/input-actions";

// Create mouse lock actions with different priorities
const aimingLock = new MouseController.MouseLockAction(EMouseLockAction.LockMouseCenter, 100);
const menuUnlock = new MouseController.MouseLockAction(EMouseLockAction.UnlockMouse, 200);

// Lock the mouse when aiming
function StartAiming() {
	aimingLock.SetActive(true);
}

function StopAiming() {
	aimingLock.SetActive(false);
}

// Force unlock when menu is open
function OpenMenu() {
	menuUnlock.SetActive(true);
}

function CloseMenu() {
	menuUnlock.SetActive(false);
}

// Configure strict mode behavior
MouseController.SetMouseLockActionStrictMode(EMouseLockAction.LockMouseCenter, true);
```

## KeyCombinationController

The KeyCombinationController handles multi-key combinations and keyboard shortcuts.

```ts
import { KeyCombinationController } from "@rbxts/input-actions";

// Register key combinations
KeyCombinationController.RegisterCombination("Save", Enum.KeyCode.S, [Enum.KeyCode.LeftControl]);
KeyCombinationController.RegisterCombination("Quit", Enum.KeyCode.Q, [Enum.KeyCode.LeftAlt]);
KeyCombinationController.RegisterCombination("Screenshot", Enum.KeyCode.F12);

// Check for combinations like any other action
if (ActionsController.IsJustPressed("Save")) {
	SaveGame();
}

if (ActionsController.IsJustPressed("Quit")) {
	QuitToMainMenu();
}
```

## InputEchoController

The InputEchoController enables input repetition for held keys, similar to how typing repeats when a key is held down.

```ts
import { InputEchoController } from "@rbxts/input-actions";

// Configure echo behavior for UI navigation
InputEchoController.ConfigureActionEcho("UIUp", 0.5, 0.1); // 0.5s initial delay, then repeat every 0.1s
InputEchoController.ConfigureActionEcho("UIDown", 0.5, 0.1);
InputEchoController.ConfigureActionEcho("UILeft", 0.5, 0.1);
InputEchoController.ConfigureActionEcho("UIRight", 0.5, 0.1);

// When done with a menu, disable echo
function CloseMenu() {
	InputEchoController.DisableActionEcho("UIUp");
	InputEchoController.DisableActionEcho("UIDown");
	InputEchoController.DisableActionEcho("UILeft");
	InputEchoController.DisableActionEcho("UIRight");
}
```

## HapticFeedbackController

The HapticFeedbackController provides easy control of controller vibration feedback.

```ts
import { HapticFeedbackController, EVibrationPreset } from "@rbxts/input-actions";

// Use built-in presets for common feedback patterns
function HitTarget() {
	HapticFeedbackController.VibratePreset(EVibrationPreset.Success);
}

function TakeDamage() {
	HapticFeedbackController.VibratePreset(EVibrationPreset.Heavy);
}

// Custom vibration parameters
function SmallBump() {
	HapticFeedbackController.Vibrate(0.2, 0.3, 0.1); // largeMotor, smallMotor, duration
}

// Register your own presets
HapticFeedbackController.RegisterPreset("WeaponJam", 0.8, 0.3, 0.4);
HapticFeedbackController.VibratePreset("WeaponJam");

// Stop all vibration immediately
function PauseGame() {
	HapticFeedbackController.StopAll();
}
```

## InputConfigController

The InputConfigController manages configuration settings for input sensitivity and behavior.

```ts
import { InputConfigController } from "@rbxts/input-actions";

// Configure analog input deadzones
InputConfigController.SetInputDeadzone(Enum.KeyCode.Thumbstick1, 0.12);
InputConfigController.SetInputDeadzone(Enum.KeyCode.Thumbstick2, 0.15);

// Adjust action activation thresholds
InputConfigController.SetActionActivationThreshold("Aim", 0.8); // Requires strong press for aiming
InputConfigController.SetActionActivationThreshold("Walk", 0.2); // Light press for walking
```

## RawInputHandler

The RawInputHandler provides access to raw input data, particularly useful for character movement and camera control.

```ts
import { RawInputHandler } from "@rbxts/input-actions";

// Get movement input in a frame-independent way
RunService.RenderStepped.Connect((deltaTime) => {
	// Get raw movement vector relative to camera
	const moveVector = RawInputHandler.GetMoveVector(true);

	// Move character based on input
	character.Humanoid.Move(moveVector);

	// Get camera rotation input
	const rotationDelta = RawInputHandler.GetRotation();
	UpdateCameraAngle(rotationDelta.X, rotationDelta.Y);

	// Get mouse wheel/zoom input
	const zoomDelta = RawInputHandler.GetZoomDelta();
	AdjustCameraZoom(zoomDelta);
});

// Temporarily disable input when needed
function ShowCutscene() {
	RawInputHandler.ControlSetEnabled(false);
	RawInputHandler.MouseInputSetEnabled(false);
}

function EndCutscene() {
	RawInputHandler.ControlSetEnabled(true);
	RawInputHandler.MouseInputSetEnabled(true);
}
```

## InputKeyCodeHelper

The InputKeyCodeHelper provides utilities for working with input key codes, including getting visual representations and checking key types.

```ts
import { InputKeyCodeHelper, ECustomKey } from "@rbxts/input-actions";

// Check if a key is a custom key
const isCustom = InputKeyCodeHelper.IsCustomKey(ECustomKey.Thumbstick1Up); // true
const isCustom2 = InputKeyCodeHelper.IsCustomKey(Enum.KeyCode.Space); // false

// Get a user-friendly name for a key
const keyName = InputKeyCodeHelper.GetInputKeyCodeName(Enum.KeyCode.LeftShift); // "LeftShift"

// Get visual data for displaying a key in UI
const visualData = InputKeyCodeHelper.GetVisualInputKeyCodeData(Enum.KeyCode.Space);
print(`Key: ${visualData.Name}, Image: ${visualData.ImageId}`);

// Get image for a specific key
const imageId = InputKeyCodeHelper.GetImageForKey(Enum.KeyCode.W);
```

## Mouse Lock Action Priorities

The MouseController uses a priority system to determine which mouse lock action takes precedence:

```ts
import { MouseController, EMouseLockAction, EMouseLockActionPriority } from "@rbxts/input-actions";

// Default priorities are defined in EMouseLockActionPriority:
// - UnlockMouse: 100 (highest priority by default)
// - LockMouseCenter: 50 (medium priority)
// - LockMouseAtPosition: 25 (lowest priority)

// You can create mouse lock actions with custom priorities:
const highPriorityLock = new MouseController.MouseLockAction(
	EMouseLockAction.LockMouseCenter,
	200, // Higher priority than default unlock
);

// This will override even the unlock action due to higher priority
highPriorityLock.SetActive(true);
```

## InputCatcher

The InputCatcher allows temporarily blocking all user input, useful for cutscenes, loading screens, or modal dialogs.

```ts
import { InputCatcher } from "@rbxts/input-actions";

// Create an input catcher with high priority
const blockingInputCatcher = new InputCatcher(1000);

// Block all input
blockingInputCatcher.GrabInput();

// Check if the catcher is active
if (blockingInputCatcher.IsActive()) {
	// Input is currently being blocked
}

// Restore normal input handling
blockingInputCatcher.ReleaseInput();
```

## InputActionsInitializationHelper

The InputActionsInitializationHelper provides a convenient way to initialize multiple controllers at once.

```ts
import { InputActionsInitializationHelper } from "@rbxts/input-actions";

// Initialize all controllers
InputActionsInitializationHelper.InitAll();

// Or initialize specific controllers
InputActionsInitializationHelper.InitMouseController();
InputActionsInitializationHelper.InitDeviceTypeHandler();
InputActionsInitializationHelper.InitActionsAndInputManager();

// Apply default UI input mappings
InputActionsInitializationHelper.ApplyDefaultInputMaps();

// Trigger haptic feedback with a preset
InputActionsInitializationHelper.TriggerHapticFeedback(EVibrationPreset.Success);
```
