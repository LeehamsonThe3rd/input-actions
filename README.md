# What is input-actions?

Input-actions is an input handling package based on Godot's actions system
+aditional tools to handle the input

## How it works?

You handle all input via <b>Actions</b>
That means to handle input you create an action and assign keys that activate it

It gives some sort of flexibility since you have full control over them

### Have you thought how you could handle input for Phone | Console | Pc at the same time?

input-actions gives you the ability to manage that easily from 1 place
You're able to assign keys to activate the action and even fake those inputs with <b>UI joystick</b> or scripts etc...

### What are Actions?

Actions are small values that hold the input state with the PressStrength
`you're not able to detect the press strength of the KeyCode, it's eather 0 or 1, for everyting else the value can be any number depending on the Input`

# Quick start

before you start remember
<b>SOME CONTROLLERS REQUIRE INITIALIZATION</b>
and you're able to activate only those parts of the package that you need

e.g

```ts
//init_actions.client.ts
InputActionsInitializerTools.InitActionsAndInputManager();
```

or directly activate

```ts
//that is not very recommended to use .Initialize directly since some of them come in couples and have activated to be at the same time (just not to forget to initialize the other one)

ActionsController.Initialize();
```

1. [InputKeyCode](docs/InputKeyCode.md)
2. [ActionsController and InputManagerController](docs/ActionsAndInputManager.md)

### Example usage

#### Sprint

```ts
//init_actions_and_input_manager.client.ts
InputActionsInitializerTools.InitActionsAndInputManager();

//sprint.ts
const sprint_action = "Sprint";
ActionsController.Add(sprint_action);
ActionsController.AddKeyCode(Enum.KeyCode.LeftShift);

const humanoid: Humanoid;
const walk_speed = 16;
const run_speed = 24;
RunService.RenderStepped.Connect(() => {
	humanoid.WalkSpeed = ActionsController.IsPressed(sprint_action) ? run_speed : walk_speed;
});
```

#### Crouch

```ts
//init_actions_and_input_manager.client.ts
InputActionsInitializerTools.InitActionsAndInputManager();

//crouch.ts
const crouch_action = "Crouch";
ActionsController.Add(crouch_action);
ActionsController.AddKeyCode(Enum.KeyCode.LeftControl);

const cleanup = InputManagerController.Subscribe((input) => {
	if (input.IsActionPressed(crouch_action)) EnterCrouchState();
	if (input.IsActionReleased(crouch_action)) LeaveCrouchState();
});
```
