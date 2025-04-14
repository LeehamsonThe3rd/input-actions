# Quick Start Guide

This document has been merged into GettingStarted.md for a more streamlined documentation experience.

Please refer to [Getting Started](./GettingStarted.md) for quick start information and basic concepts.

## Comparison with Roblox's Native Input System

The Input Actions package extends Roblox's native input system with several advantages:

| Feature               | Roblox Native                            | Input Actions Package                                          |
| --------------------- | ---------------------------------------- | -------------------------------------------------------------- |
| Input Abstraction     | Directly tied to physical inputs         | Abstract actions that can be triggered by multiple inputs      |
| Device Support        | Separate handling for different devices  | Unified system that automatically adapts to the current device |
| Context Switching     | Requires manual connection/disconnection | Built-in context system for easy switching between game states |
| Analog Input          | Basic support                            | Enhanced with deadzones, thresholds, and strength values       |
| Input Combinations    | Manual implementation                    | Built-in support for key combinations                          |
| Haptic Feedback       | Basic                                    | Enhanced with presets and custom patterns                      |
| Mouse Control         | Basic                                    | Advanced control with locking options and priority system      |
| Visual Representation | Limited                                  | Built-in system for displaying inputs with proper icons        |

### When to Use Native Roblox Input

While this package provides many advantages, there are still cases where you might want to use Roblox's native input directly:

- For extremely simple games with minimal input requirements
- When you need direct access to raw input events for specialized use cases
- If you're working with Roblox's built-in character controller exclusively
- For compatibility with other Roblox systems that expect direct input connections

### Using Both Systems Together

The Input Actions package works alongside Roblox's native input system, so you can:

1. Use Input Actions for most game controls
2. Connect directly to UserInputService for specialized cases
3. Mix and match as needed for your specific game requirements
