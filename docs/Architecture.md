# Input Actions System Architecture

## System Overview

The Input Actions system is a comprehensive input handling framework built on top of Roblox's native input system, inspired by Godot's approach to input management. It provides multiple layers of abstraction to make input handling more flexible and easier to integrate into different game systems.

## System Layers

The system is organized into three main layers:

### 1. Raw Input Layer

This layer interfaces directly with Roblox's input events and processes them into standardized formats.

Components:

- **InputManagerController**: Captures raw input events and processes them
- **RawInputHandler**: Provides access to raw input data (e.g., movement vectors, camera deltas)
- **DeviceTypeHandler**: Detects and tracks the input device being used

### 2. Action Mapping Layer

This layer converts physical inputs into abstract "actions" that represent player intent rather than specific keys.

Components:

- **ActionsController**: Core component that manages action states
- **InputEvent/InputEventData**: Data structures representing processed input events
- **KeyCombinationController**: Handles multi-key combinations and shortcuts

### 3. Context Management Layer

This high-level layer organizes actions into contexts, allowing easy switching between different input modes.

Components:

- **InputContextController**: Manages sets of input mappings for different game states
- **InputContext**: Represents a complete set of input mappings that can be switched on/off

## Utility Components

Additional components that provide specialized functionality:

- **MouseController**: Advanced mouse behavior control
- **HapticFeedbackController**: Controller vibration management
- **InputEchoController**: Input repetition management
- **InputConfigController**: Configuration for input sensitivity, deadzones, etc.
- **InputCatcher**: Utility for intercepting and blocking all user input
- **InputKeyCodeHelper**: Utilities for working with input key codes

## Implementation Details

### Action State Management

Actions are tracked using a three-value buffer system:

## Best Practices

To get the most out of the Input Actions system, follow these recommended practices:

### Context Organization

Organize contexts by game state or feature:

- Create a separate context for each distinct game mode (Menu, Gameplay, Vehicle, etc.)
- Use the global context only for actions that should always be available
- Consider creating a hierarchy of contexts (Base, Combat, Movement)

### Performance Optimization

Optimize input handling for smooth gameplay:

- Minimize the number of active contexts and subscriptions
- Use `IsJustPressed` and `IsJustReleased` instead of tracking state changes manually
- Clean up unused contexts, actions, and subscriptions when they're no longer needed
- For very performance-sensitive games, consider using `ActionsController` directly for critical actions

### Code Organization

Structure your input-related code for maintainability:

- Create a dedicated input manager class to encapsulate your game's input setup
- Define context setups in separate functions or modules
- Keep input binding code separate from game logic
- Use enums for action names to ensure type safety

### Debugging Tools

Consider implementing debug utilities for input troubleshooting:

- A debug overlay showing currently pressed actions
- Action history for diagnosing timing issues
- Visualization of active contexts
- Input strength meters for analog inputs

### Input Rebinding

Support player customization:

- Store action-to-key mappings rather than hardcoded keys
- Use `InputContext.UpdateKey()` to change bindings at runtime
- Implement a rebinding UI that displays proper key visuals using `GetVisualData()`
- Save and load bindings using Roblox's data stores

### Cross-Platform Design

Design your input system to work well across platforms:

- Always provide both keyboard/mouse and gamepad bindings
- Use `DeviceTypeHandler` to adapt UI based on input device
- Test with all supported input devices
- Consider device-specific behaviors (e.g., haptic feedback for gamepad)
