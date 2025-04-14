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

## Initialization Flow

The system uses a helper to manage initialization of the various components in the correct order:
