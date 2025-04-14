# Implementation Details

This document explains the internal architecture of the Input Actions package for developers who want to understand or contribute to the codebase.

## Core Architecture

The package is built around these main components:

1. **Actions System**: Tracks the state of named actions
2. **Input Processing**: Converts raw Roblox input to action events
3. **Input Mapping**: Maps physical inputs to actions for different devices
4. **Device Detection**: Identifies what input devices the player is using

## Action State Management

Actions are tracked using a three-value buffer system:

```
KeyBuffer: [current, previous, pre-previous]
```

This allows detecting various states:

- **IsPressed**: current value >= activation threshold
- **IsJustPressed**: previous >= threshold && pre-previous < threshold
- **IsJustReleased**: previous < threshold && pre-previous >= threshold

Each frame, values are shifted in the buffer: pre-previous = previous, previous = current.

## Input Processing Flow

1. Roblox input events are captured via ContextActionService
2. Raw inputs are converted to InputEvent objects
3. Custom inputs (thumbstick directions, etc.) are processed
4. InputManagerController fires the input signal
5. Subscriber callbacks process the input
6. Corresponding actions are updated

## Custom Input Keys

Since Roblox doesn't provide fine-grained input events for things like thumbstick directions, the package implements custom keys like:

- Thumbstick directions (Up, Down, Left, Right)
- Mouse wheel directions
- Mouse movement directions

These are detected by processing Enum.UserInputState.Change events and calculating directional values.

## Mouse Locking System

The MouseController uses a priority stack system to determine the current mouse behavior:

- Multiple systems can request different mouse behaviors
- Each request includes a priority
- The highest priority behavior is applied
- When a higher priority behavior is removed, the next highest is applied

## Device Detection

The InputTypeController detects the player's input device using:

- UserInputService properties (MouseEnabled, TouchEnabled, etc.)
- Analysis of UI element sizes (to differentiate phones vs. tablets)
- VRService.VREnabled for VR detection

## Threading and Performance

- Most controllers bind to RunService.RenderStepped to update each frame
- ActionsController uses Enum.RenderPriority.First to update before other systems
- Input processing uses a high priority (99999) with ContextActionService
- Input subscriptions are processed in priority order

## Extension Points

The system can be extended in several ways:

1. **Custom Input Types**: Add new entries to ECustomKey and handling in InputManagerController
2. **Action Derivatives**: Create systems that derive values from raw actions (e.g., implementing a double-press detector)
3. **Visual Customization**: Add custom key images to InputKeyCodeImages
