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

#### `ISubscribtionConfig`

```typescript
interface ISubscribtionConfig {
	Priority?: number;
	SubscriptionType?: EInputEventSubscribtionType;
}
```

## InputMapController

Manages input mappings for different devices.

### Methods

#### `Add(action_name: string, input_map: IInputMap)`

Adds an input map for an action.

#### `Delete(action_name: string, erase_action: boolean = false)`

Deletes an input map for an action.

#### `Get(name: string): IInputMap | undefined`

Gets the input map for an action.

#### `GetVisualData(input_map_name: string, use_custom_images: boolean = true): IVisualInputKeyCodeData`

Gets visual representation data for an input map.

#### `AddDefaultInputMaps()`

Adds the default input maps for UI navigation.

#### `GetDefaultInputMaps(): { [name: string]: IInputMap }`

Gets the default input maps.

### Types

#### `IInputMap`

```typescript
interface IInputMap {
	readonly Gamepad?: InputKeyCode;
	readonly KeyboardAndMouse?: InputKeyCode;
}
```

#### `IVisualInputKeyCodeData`

```typescript
interface IVisualInputKeyCodeData {
	readonly Name: string;
	readonly ImageId: string;
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

### `EInputEventSubscribtionType`

- `All`
- `AllWithNoCustomKeys`
- `KeysOnly`
- `ChangedOnly`
- `CustomKeysOnly`
- `KeysWithCustomKeysOnly`

### `EDefaultInputAction`

Defines default actions for UI navigation.
