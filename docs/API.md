# API Reference

## ActionsController

The core controller for registering and checking action states.

### Methods

#### `Initialize()`

Initializes the actions controller. Must be called before using any other functionality.

#### `Add(action_name: string, activation_strength: number = 0.5, key_codes: readonly InputKeyCode[] = [])`

Adds a new action with the given name, activation strength, and optional key codes.

#### `Press(action_name: string, strength: number = 1)`

Marks an action as pressed with the given strength.

#### `Release(action_name: string)`

Marks an action as released.

#### `IsPressed(action_name: string): boolean`

Returns true if the action is currently pressed (strength >= activation threshold).

#### `IsJustPressed(action_name: string): boolean`

Returns true if the action was pressed this frame but not in the previous frame.

#### `IsReleased(action_name: string): boolean`

Returns true if the action is not pressed.

#### `IsJustReleased(action_name: string): boolean`

Returns true if the action was released this frame but was pressed in the previous frame.

#### `GetPressStrength(action_name: string): number`

Gets the current press strength of an action (0 to 1).

#### `AddKeyCode(action_name: string, key_code: InputKeyCode)`

Binds a key code to an action.

#### `EraseKeyCode(action_name: string, key_code: InputKeyCode)`

Removes a key code binding from an action.

#### `EraseAllKeyCodes(action_name: string)`

Removes all key code bindings from an action.

#### `GetKeyCodes(action_name: string): readonly InputKeyCode[]`

Gets all key codes bound to an action.

#### `HasKeyCode(action_name: string, key_code: InputKeyCode): boolean`

Checks if a specific key code is bound to an action.

#### `IsExisting(action_name: string): boolean`

Checks if an action exists.

#### `GetActionsFromKeyCode(key_code: InputKeyCode): readonly string[]`

Gets all actions bound to a specific key code.

#### `SetActivationStrength(action_name: string, activation_strength: number)`

Sets the activation strength threshold for an action.

#### `Erase(action_name: string)`

Removes an action completely.

#### `GetActions(): string[]`

Gets a list of all registered action names.

## InputManagerController

Manages input event processing and subscription.

### Methods

#### `Initialize()`

Initializes the input manager. Must be called before using any functionality.

#### `Subscribe(callback: InputCallback, config?: ISubscribtionConfig): CleanUp`

Subscribes to input events with optional configuration.

#### `ParseInputEvent(input_event_data: InputEventData): Enum.ContextActionResult`

Parse and process an input event.

### Types

#### `InputCallback`

```typescript
type InputCallback = (input_event: InputEvent) => Enum.ContextActionResult | void | undefined;
```

#### `ISubscriptionConfig`

```typescript
interface ISubscriptionConfig {
	Priority?: number;
	SubscriptionType?: EInputEventSubscriptionType;
}
```

## InputMapController

Manages input mappings for different devices.

### Methods

#### `add(actionName: string, inputMap: IInputMap)`

Adds an input map for an action.

#### `remove(actionName: string, eraseAction: boolean = false)`

Removes an input map for an action.

#### `get(name: string): IInputMap | undefined`

Gets the input map for an action.

#### `getVisualData(inputMapName: string, useCustomImages: boolean = true): IVisualInputKeyCodeData`

Gets visual representation data for an input map.

#### `addDefaultInputMaps()`

Adds the default input maps for UI navigation.

#### `getDefaultInputMaps()`

Gets the default input maps module.

#### `createContext(name: string): InputContext`

Creates a new input context with the given name.

#### `getGlobalContext(): InputContext`

Gets the global context that's always available.

### Types

#### `IInputMap`

```typescript
interface IInputMap {
	readonly Gamepad?: InputKeyCode;
	readonly KeyboardAndMouse?: InputKeyCode;
}
```

## InputTypeController

Detects and manages input device types.

### Methods

#### `Initialize()`

Initializes the input type controller.

#### `GetMainInputType(): EInputType`

Gets the main input type being used.

#### `GetMainDeviceType(): EDeviceType`

Gets the main device type being used.

### Events

#### `OnInputTypeChanged: RBXScriptSignal<(input_type: EInputType) => void>`

Fires when the input type changes.

#### `OnDeviceTypeChanged: RBXScriptSignal<(device_type: EDeviceType) => void>`

Fires when the device type changes.

## InputController

Provides access to processed movement input.

### Methods

#### `Initialize()`

Initializes the input controller.

#### `GetMoveVector(relative_camera?: boolean, normalized?: boolean, follow_full_rotation?: boolean): Vector3`

Gets the current movement vector.

#### `GetRotation(): Vector2`

Gets the current camera rotation input.

#### `GetZoomDelta(): number`

Gets the current zoom input delta.

#### `ControlSetEnabled(value: boolean)`

Enables or disables the character controls.

#### `MouseInputSetEnabled(value: boolean)`

Enables or disables mouse input.

## MouseController

Controls mouse behavior and locking.

### Classes

#### `MouseLockAction`

```typescript
class MouseLockAction {
	constructor(action: EMouseLockAction, priority?: number);
	SetActive(active: boolean): void;
}
```

### Methods

#### `Initialize()`

Initializes the mouse controller.

#### `SetMouseLockActionStrictMode(action: EMouseLockAction, value: boolean)`

Sets whether the mouse lock action should be applied strictly.

#### `SetEnabled(value: boolean)`

Enables or disables the mouse controller.

## InputContextController

Controls different input contexts or action sets for different game states.

### Classes

#### InputContext

```typescript
class InputContext {
	constructor(name?: string);
	add(actionName: string, map: IInputMap): this;
	remove(actionName: string): this;
	assign(): this;
	unassign(): this;
	isAssigned(): boolean;
	getMaps(): ReadonlyMap<string, IInputMap>;
	getMap(actionName: string): IInputMap | undefined;
	getName(): string | undefined;
}
```

### Methods

#### `createContext(name: string): InputContext`

Creates a new input context with the given name.

#### `getContext(name: string): InputContext | undefined`

Gets an existing context by name.

#### `getGlobalContext(): InputContext`

Gets the global context that's always available.

#### `getAllContexts(): ReadonlyMap<string, InputContext>`

Gets all registered contexts.

#### `assignContext(name: string): boolean`

Assigns a context by name.

#### `unassignContext(name: string): boolean`

Unassigns a context by name.

## InputEchoController

Provides functionality to trigger repeated input events when keys are held down.

### Methods

#### `Initialize()`

Initializes the echo controller.

#### `ConfigureActionEcho(actionName: string, initialDelay: number = 0.5, repeatInterval: number = 0.1)`

Configures echo behavior for an action.

#### `DisableActionEcho(actionName: string)`

Disables echo for an action.

## KeyCombinationController

Handles detection and processing of key combinations (keyboard shortcuts).

### Methods

#### `Initialize()`

Initializes the key combination controller.

#### `RegisterCombination(actionName: string, mainKey: InputKeyCode, modifiers: Enum.KeyCode[] = [])`

Registers a new key combination.

## HapticFeedbackController

Provides a simple API for triggering controller vibration.

### Methods

#### `Vibrate(largeMotor: number = 0.5, smallMotor: number = 0.5, duration: number = 0.2)`

Triggers vibration with custom parameters.

#### `VibratePreset(presetName: string)`

Triggers vibration using a named preset.

#### `RegisterPreset(name: string, largeMotor: number, smallMotor: number, duration: number)`

Registers a custom vibration preset.

#### `StopAll()`

Stops all vibration immediately.

## InputConfigController

Controls configuration settings for inputs and actions.

### Methods

#### `SetActionActivationThreshold(actionName: string, threshold: number)`

Sets the activation threshold for a specific action.

#### `GetActionActivationThreshold(actionName: string): number`

Gets the activation threshold for a specific action.

#### `SetInputDeadzone(inputKey: InputKeyCode, deadzone: number)`

Sets the deadzone for an analog input.

#### `GetInputDeadzone(inputKey: InputKeyCode): number`

Gets the deadzone for a specific input.

## Enums

### `EInputType`

- `KeyboardAndMouse`
- `Gamepad`
- `Touch`

### `EDeviceType`

- `Pc`
- `Phone`
- `Tablet`
- `Console`
- `Vr`

### `ECustomKey`

Defines custom input keys like thumbstick directions.

### `EMouseLockAction`

- `LockMouseAtPosition`
- `LockMouseCenter`
- `UnlockMouse`

### `EInputEventSubscriptionType`

- `All`
- `AllWithNoCustomKeys`
- `KeysOnly`
- `ChangedOnly`
- `CustomKeysOnly`
- `KeysWithCustomKeysOnly`

### `EDefaultInputAction`

Defines default actions for UI navigation.

### `EVibrationPreset`

Predefined vibration patterns for haptic feedback.

- `Light`
- `Medium`
- `Heavy`
- `Failure`
- `Success`

### `EInputBufferIndex`

Indices used in action key buffer arrays.

- `Current` - Current frame input (set by input events)
- `Previous` - Previous frame input (set during update)
- `PrePrevious` - Pre-previous frame input (set during update)

## Constants

### ActionResources

Constants related to action handling.

- `DEFAULT_MIN_PRESS_STRENGTH` - Default activation threshold for actions
- `DEFAULT_THUMBSTICK_DEAD_ZONE` - Default dead zone value for thumbsticks
- `DEFAULT_INPUT_PRIORITY` - Default priority for input handling

### InputPriorityResources

Constants for input operation priorities.

- `KEY_COMBINATION_PRIORITY` - Priority for key combination handlers
- `DEFAULT_KEY_REPEAT_DELAY` - Default delay for auto-repeat in seconds
- `KEY_COMBINATION_RELEASE_DELAY` - Default release delay for key combinations

### ContextActionResources

Constants for context action names.

- `ACTIONS_READER_NAME` - Name for the main input actions reader
- `INPUT_ECHO_HANDLER_NAME` - Name for the input echo handler
- `MOUSE_CONTROLLER_UPDATE` - Name for the mouse controller update
