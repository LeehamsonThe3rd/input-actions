Replicating the godot input system for roblox-ts as package.

This package immitates godot input system.
It provides utilities for normal roblox input and adds utilities that replicate godot input system.

There are 3 parts (Utilities [For raw input, catching input and the thing that provides custom keycodes], Godot Input System [For actions and low level mapping], Input Context [Layer on top of Godot input system that allows user to map the input easier and separated by contexts e.g. for Settings to map the user controls])

This system is aimed to make Roblox input sytem more flexible by building on top of it. It should be easily integrated into different systems like Weapons, Vehicles, Ui, other kinds of games and mechanics.

Main parts:

- ActionsController (low-level actions control and storing keycodes for each action)
- InputManagerController - (making keycodes activate and deactivate the actions)
- HapticController - (vibration utils with presets)
- InputConfigController - (config for actions like dead-zone and threshhold)
- InputContextController - (map the keycodes to actions in easy and flexible way)
- InputEchoController - (repeating emmition of the keycode if pressed)
- KeyCombinationController - (detect action combinations)
- MouseController - (for more advanced usage e.g. Creating custom CameraSystem, give more abilities to control the mouse)

Utils:

- DeviceTypeHandler (prev. InputTypeController) - detects the device type
- RawInputHandler - used to get the raw input from the user (e.g. CameraDelta, RawMoveDirection)
- InputActionsInitializationHelper - helps to activate and setup lifycycles of the Controllers
- InputCatcher - utility that allows to prevent ALL user input from going through
- InputKeyCodeHelper - utilities to handle the InputKeyCode (Get Image, Name, Custom Icon, Check if custom etc.)

Models: - Main exposed types to use in that Input System
