# Input Actions Overview

## What is Input Actions?

Input Actions is a comprehensive input handling system for Roblox TypeScript (roblox-ts) that replicates Godot's input management approach. It provides a more flexible, organized, and cross-platform way to handle player input in your Roblox games.

## Key Features

- **Action-Based Input System**: Define abstract actions like "Jump" or "Fire" instead of directly handling key presses
- **Device Adaptability**: Automatically adapts to different input devices (keyboard/mouse, gamepad, touch)
- **Context Management**: Easily switch between different input contexts (gameplay, menu, vehicle)
- **Enhanced Control**: Support for analog input with thresholds, deadzones, and modifiers
- **Advanced Features**: Key combinations, input echoing, haptic feedback, and more
- **Cross-Platform**: Works seamlessly across PC, mobile, console, and VR

## What Does It Change?

Input Actions builds upon Roblox's native input system to provide a more powerful and developer-friendly way to handle player input:

| Aspect               | Roblox Native                          | Input Actions                                               |
| -------------------- | -------------------------------------- | ----------------------------------------------------------- |
| **Core Approach**    | Device-specific event callbacks        | Abstract actions mapped to inputs                           |
| **Cross-Platform**   | Manual handling for each device        | Unified system with automatic device detection              |
| **Organization**     | Direct connections to UserInputService | Contextual organization of input mappings                   |
| **State Management** | Manual tracking of input states        | Built-in pressed/just-pressed/released states               |
| **Analog Input**     | Basic values                           | Enhanced with deadzones and thresholds                      |
| **Input Chaining**   | Manual implementation                  | Built-in key combinations and modifiers                     |
| **Extensibility**    | Limited                                | Modular controller system with clear separation of concerns |

## System Architecture

The Input Actions package consists of several components working together:

1. **Low-Level Input Handling**

   - InputManagerController: Captures raw input events
   - DeviceTypeHandler: Detects input devices being used
   - RawInputHandler: Provides access to raw input data

2. **Action Management**

   - ActionsController: Core component for defining and checking actions
   - InputConfigController: Configure input sensitivity and thresholds
   - MouseController: Advanced mouse behavior control

3. **Advanced Features**
   - InputContextController: High-level context management
   - KeyCombinationController: Multi-key combination detection
   - InputEchoController: Input repetition handling
   - HapticFeedbackController: Vibration feedback management
   - InputCatcher: Utility for blocking input

## When to Use Input Actions

Input Actions is ideal for:

- Games requiring complex input handling
- Projects targeting multiple platforms (PC, mobile, console)
- Games with different control schemes (on foot, in vehicle, menu navigation)
- Situations where input rebinding is desired
- Any game where you want cleaner, more organized input code

For very simple games or prototypes, Roblox's native input system may be sufficient. However, Input Actions scales better as your project grows in complexity.

## Getting Started

See the [Quick Start Guide](./QuickStart.md) to begin using Input Actions in your project.
