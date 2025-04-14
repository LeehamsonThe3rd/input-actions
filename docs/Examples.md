# Usage Examples

This document provides practical examples of how to use the Input Actions system for different game systems.

## Table of Contents

- [Character Movement](#character-movement)
- [Vehicle Controls](#vehicle-controls)
- [Weapon System](#weapon-system)
- [UI Navigation](#ui-navigation)
- [Camera System](#camera-system)
- [Input Rebinding System](#input-rebinding-system)
- [Context Switching](#context-switching)

## Character Movement

A basic character controller using the Input Actions system:

```ts
import {
	InputActionsInitializationHelper,
	ActionsController,
	RawInputHandler,
	ECustomKey,
} from "@rbxts/input-actions";
import { RunService } from "@rbxts/services";

// Initialize the system
InputActionsInitializationHelper.InitAll();

// Define movement actions
ActionsController.Add("MoveForward");
ActionsController.Add("MoveBackward");
ActionsController.Add("MoveLeft");
ActionsController.Add("MoveRight");
ActionsController.Add("Jump");
ActionsController.Add("Sprint");

// Bind keyboard controls
ActionsController.AddKeyCode("MoveForward", Enum.KeyCode.W);
ActionsController.AddKeyCode("MoveBackward", Enum.KeyCode.S);
ActionsController.AddKeyCode("MoveLeft", Enum.KeyCode.A);
ActionsController.AddKeyCode("MoveRight", Enum.KeyCode.D);
ActionsController.AddKeyCode("Jump", Enum.KeyCode.Space);
ActionsController.AddKeyCode("Sprint", Enum.KeyCode.LeftShift);

// Bind gamepad controls
ActionsController.AddKeyCode("MoveForward", ECustomKey.Thumbstick1Up);
ActionsController.AddKeyCode("MoveBackward", ECustomKey.Thumbstick1Down);
ActionsController.AddKeyCode("MoveLeft", ECustomKey.Thumbstick1Left);
ActionsController.AddKeyCode("MoveRight", ECustomKey.Thumbstick1Right);
ActionsController.AddKeyCode("Jump", Enum.KeyCode.ButtonA);
ActionsController.AddKeyCode("Sprint", Enum.KeyCode.ButtonL3);

// Get player and character references
const Players = game.GetService("Players");
const localPlayer = Players.LocalPlayer;
let character = localPlayer.Character || localPlayer.CharacterAdded.Wait()[0];
let humanoid = character.FindFirstChildOfClass("Humanoid") as Humanoid;

// Update on character changes
localPlayer.CharacterAdded.Connect((newCharacter) => {
	character = newCharacter;
	humanoid = character.WaitForChild("Humanoid") as Humanoid;
});

// Movement constants
const WALK_SPEED = 16;
const SPRINT_SPEED = 24;

// Movement logic
RunService.RenderStepped.Connect((deltaTime) => {
	if (!character || !humanoid) return;

	// Handle jumping
	if (ActionsController.IsJustPressed("Jump") && humanoid.FloorMaterial !== Enum.Material.Air) {
		humanoid.Jump = true;
	}

	// Handle sprinting
	const isSprinting = ActionsController.IsPressed("Sprint");
	humanoid.WalkSpeed = isSprinting ? SPRINT_SPEED : WALK_SPEED;

	// Get movement direction relative to camera
	const moveVector = RawInputHandler.GetMoveVector(true);

	// Apply movement
	humanoid.Move(moveVector);
});
```

## Vehicle Controls

An example of using input contexts for vehicle controls:

```ts
import {
	InputActionsInitializationHelper,
	InputContextController,
	ActionsController,
	ECustomKey,
} from "@rbxts/input-actions";
import { RunService } from "@rbxts/services";

// Initialize the system
InputActionsInitializationHelper.InitAll();

// Create a vehicle context
const vehicleContext = InputContextController.CreateContext("vehicle");

// Define vehicle controls
vehicleContext.Add("Accelerate", {
	KeyboardAndMouse: Enum.KeyCode.W,
	Gamepad: Enum.KeyCode.ButtonR2,
});

vehicleContext.Add("Brake", {
	KeyboardAndMouse: Enum.KeyCode.S,
	Gamepad: Enum.KeyCode.ButtonL2,
});

vehicleContext.Add("SteerLeft", {
	KeyboardAndMouse: Enum.KeyCode.A,
	Gamepad: ECustomKey.Thumbstick1Left,
});

vehicleContext.Add("SteerRight", {
	KeyboardAndMouse: Enum.KeyCode.D,
	Gamepad: ECustomKey.Thumbstick1Right,
});

vehicleContext.Add("Handbrake", {
	KeyboardAndMouse: Enum.KeyCode.Space,
	Gamepad: Enum.KeyCode.ButtonX,
});

vehicleContext.Add("Horn", {
	KeyboardAndMouse: Enum.KeyCode.H,
	Gamepad: Enum.KeyCode.DPadDown,
});

// Example vehicle class
class Vehicle {
	private model: Model;
	private engineForce = 0;
	private brakingForce = 0;
	private steeringAngle = 0;
	private handbrakeActive = false;

	constructor(vehicleModel: Model) {
		this.model = vehicleModel;
	}

	EnterVehicle() {
		// Enable vehicle controls
		vehicleContext.Assign();
	}

	ExitVehicle() {
		// Disable vehicle controls
		vehicleContext.Unassign();
	}

	Update(deltaTime: number) {
		// Get control inputs
		const accelerateAmount = ActionsController.GetPressStrength("Accelerate");
		const brakeAmount = ActionsController.GetPressStrength("Brake");
		const steerLeftAmount = ActionsController.GetPressStrength("SteerLeft");
		const steerRightAmount = ActionsController.GetPressStrength("SteerRight");
		this.handbrakeActive = ActionsController.IsPressed("Handbrake");

		// Apply acceleration
		this.engineForce = accelerateAmount * 1000;

		// Apply braking
		this.brakingForce = brakeAmount * 800;

		// Apply steering (combining left and right inputs)
		this.steeringAngle = steerRightAmount - steerLeftAmount;

		// Handle horn
		if (ActionsController.IsJustPressed("Horn")) {
			this.PlayHornSound();
		}

		// Apply physics (implementation depends on your vehicle physics system)
		this.ApplyVehiclePhysics(deltaTime);
	}

	private PlayHornSound() {
		// Play horn sound
	}

	private ApplyVehiclePhysics(deltaTime: number) {
		// Apply forces and steering to the vehicle model
		// This would integrate with your vehicle physics system
	}
}

// Example usage
const carModel = workspace.FindFirstChild("Car") as Model;
const car = new Vehicle(carModel);

// When player enters the car
function PlayerEntersCar() {
	car.EnterVehicle();
}

// Update loop
RunService.Heartbeat.Connect((deltaTime) => {
	car.Update(deltaTime);
});
```

## Weapon System

An example of a weapon system using input actions:

```ts
import {
	InputActionsInitializationHelper,
	ActionsController,
	InputContextController,
	HapticFeedbackController,
	EVibrationPreset,
} from "@rbxts/input-actions";

// Initialize the system
InputActionsInitializationHelper.InitAll();

// Create a weapons context
const weaponsContext = InputContextController.CreateContext("weapons");

// Define weapon actions
weaponsContext.Add("Fire", {
	KeyboardAndMouse: Enum.UserInputType.MouseButton1,
	Gamepad: Enum.KeyCode.ButtonR2,
});

weaponsContext.Add("Aim", {
	KeyboardAndMouse: Enum.UserInputType.MouseButton2,
	Gamepad: Enum.KeyCode.ButtonL2,
});

weaponsContext.Add("Reload", {
	KeyboardAndMouse: Enum.KeyCode.R,
	Gamepad: Enum.KeyCode.ButtonX,
});

weaponsContext.Add("SwitchWeapon", {
	KeyboardAndMouse: Enum.KeyCode.Q,
	Gamepad: Enum.KeyCode.ButtonY,
});

// Base weapon class
abstract class Weapon {
	protected ammo = 0;
	protected maxAmmo = 0;
	protected isReloading = false;
	protected isAiming = false;
	protected fireRate = 0;
	protected lastFired = 0;

	constructor(protected name: string) {
		// Initialize weapon
	}

	Update() {
		// Check for aiming
		this.isAiming = ActionsController.IsPressed("Aim");

		// Check for reload
		if (
			ActionsController.IsJustPressed("Reload") &&
			!this.isReloading &&
			this.ammo < this.maxAmmo
		) {
			this.StartReload();
		}

		// Check for firing
		if (ActionsController.IsPressed("Fire") && !this.isReloading) {
			const now = os.clock();
			if (now - this.lastFired >= 1 / this.fireRate) {
				this.Fire();
				this.lastFired = now;
			}
		}
	}

	protected abstract Fire(): void;

	protected StartReload() {
		this.isReloading = true;
		// Play reload animation
		task.delay(1.5, () => {
			this.ammo = this.maxAmmo;
			this.isReloading = false;
		});
	}

	Equip() {
		// Enable weapon controls
		weaponsContext.Assign();
	}

	Unequip() {
		// Disable weapon controls
		weaponsContext.Unassign();
	}
}

// Example rifle class
class Rifle extends Weapon {
	constructor() {
		super("Rifle");
		this.ammo = 30;
		this.maxAmmo = 30;
		this.fireRate = 10; // rounds per second
	}

	protected Fire() {
		if (this.ammo <= 0) {
			// Play empty sound
			return;
		}

		// Play fire effect

		// Reduce ammo
		this.ammo--;

		// Provide feedback
		HapticFeedbackController.VibratePreset(EVibrationPreset.Medium);

		// Perform raycasting for hit detection
		// ...
	}
}

// Example usage
const rifle = new Rifle();

// When player equips the rifle
function EquipRifle() {
	rifle.Equip();
}

// Update loop
game.GetService("RunService").Heartbeat.Connect(() => {
	rifle.Update();
});
```

## UI Navigation

An example of using the system for UI navigation:

```ts
import {
	InputActionsInitializationHelper,
	InputContextController,
	ActionsController,
	InputEchoController,
	HapticFeedbackController,
	EVibrationPreset,
} from "@rbxts/input-actions";

// Initialize the system
InputActionsInitializationHelper.InitAll();

// Create a UI context
const uiContext = InputContextController.CreateContext("ui");

// Define UI navigation actions
uiContext.Add("UIUp", {
	KeyboardAndMouse: Enum.KeyCode.Up,
	Gamepad: Enum.KeyCode.DPadUp,
});

uiContext.Add("UIDown", {
	KeyboardAndMouse: Enum.KeyCode.Down,
	Gamepad: Enum.KeyCode.DPadDown,
});

uiContext.Add("UILeft", {
	KeyboardAndMouse: Enum.KeyCode.Left,
	Gamepad: Enum.KeyCode.DPadLeft,
});

uiContext.Add("UIRight", {
	KeyboardAndMouse: Enum.KeyCode.Right,
	Gamepad: Enum.KeyCode.DPadRight,
});

uiContext.Add("UISelect", {
	KeyboardAndMouse: Enum.KeyCode.Return,
	Gamepad: Enum.KeyCode.ButtonA,
});

uiContext.Add("UIBack", {
	KeyboardAndMouse: Enum.KeyCode.Escape,
	Gamepad: Enum.KeyCode.ButtonB,
});

// Configure input echo for navigation (key repeat)
InputEchoController.ConfigureActionEcho("UIUp", 0.4, 0.15);
InputEchoController.ConfigureActionEcho("UIDown", 0.4, 0.15);
InputEchoController.ConfigureActionEcho("UILeft", 0.4, 0.15);
InputEchoController.ConfigureActionEcho("UIRight", 0.4, 0.15);

// Example menu class
class Menu {
	private items: TextButton[] = [];
	private selectedIndex = 0;

	constructor(private menuFrame: Frame) {
		// Get all button items
		for (const instance of menuFrame.GetDescendants()) {
			if (instance.IsA("TextButton")) {
				this.items.push(instance);
			}
		}

		// Select first item if available
		if (this.items.size() > 0) {
			this.SelectItem(0);
		}
	}

	Open() {
		// Show menu
		this.menuFrame.Visible = true;

		// Activate UI controls
		uiContext.Assign();
	}

	Close() {
		// Hide menu
		this.menuFrame.Visible = false;

		// Deactivate UI controls
		uiContext.Unassign();
	}

	Update() {
		// Only process input if menu is open
		if (!this.menuFrame.Visible) return;

		// Navigation
		if (ActionsController.IsJustPressed("UIUp")) {
			this.NavigateUp();
		}

		if (ActionsController.IsJustPressed("UIDown")) {
			this.NavigateDown();
		}

		if (ActionsController.IsJustPressed("UISelect")) {
			this.SelectCurrent();
		}

		if (ActionsController.IsJustPressed("UIBack")) {
			this.Close();
		}
	}

	private NavigateUp() {
		// Move selection up
		if (this.selectedIndex > 0) {
			this.SelectItem(this.selectedIndex - 1);
			HapticFeedbackController.VibratePreset(EVibrationPreset.Light);
		}
	}

	private NavigateDown() {
		// Move selection down
		if (this.selectedIndex < this.items.size() - 1) {
			this.SelectItem(this.selectedIndex + 1);
			HapticFeedbackController.VibratePreset(EVibrationPreset.Light);
		}
	}

	private SelectItem(index: number) {
		// Deselect previous item
		if (this.selectedIndex >= 0 && this.selectedIndex < this.items.size()) {
			const prevItem = this.items[this.selectedIndex];
			prevItem.BackgroundColor3 = Color3.fromRGB(100, 100, 100);
		}

		// Select new item
		this.selectedIndex = index;
		const item = this.items[index];
		item.BackgroundColor3 = Color3.fromRGB(0, 162, 255);
	}

	private SelectCurrent() {
		if (this.selectedIndex >= 0 && this.selectedIndex < this.items.size()) {
			const item = this.items[this.selectedIndex];
			// Trigger button click
			item.Activated.Fire();
			HapticFeedbackController.VibratePreset(EVibrationPreset.Success);
		}
	}
}

// Example usage
const mainMenuFrame = game
	.GetService("Players")
	.LocalPlayer.WaitForChild("PlayerGui")
	.WaitForChild("MainMenu") as Frame;
const mainMenu = new Menu(mainMenuFrame);

// Menu update loop
game.GetService("RunService").Heartbeat.Connect(() => {
	mainMenu.Update();
});

// Show menu when needed
mainMenu.Open();
```

## Camera System

An example of using the system for camera control:

```ts
import {
	InputActionsInitializationHelper,
	RawInputHandler,
	MouseController,
	EMouseLockAction,
} from "@rbxts/input-actions";
import { RunService, Workspace } from "@rbxts/services";

// Initialize the system
InputActionsInitializationHelper.InitAll();

// Create a custom camera controller
class FreeCamera {
	private camera = Workspace.CurrentCamera!;
	private mouseLock: MouseController.MouseLockAction;
	private cameraAngleX = 0;
	private cameraAngleY = 0;
	private cameraSensitivity = 0.5;
	private cameraDistance = 10;
	private enabled = false;

	constructor() {
		// Create a mouse lock action to center the mouse
		this.mouseLock = new MouseController.MouseLockAction(EMouseLockAction.LockMouseCenter);
	}

	Enable() {
		if (this.enabled) return;
		this.enabled = true;

		// Save current camera state
		this.cameraAngleX = this.camera.CFrame.ToEulerAnglesYXZ()[1];
		this.cameraAngleY = this.camera.CFrame.ToEulerAnglesYXZ()[0];

		// Lock mouse to center of screen
		this.mouseLock.SetActive(true);

		// Start updating camera
		RunService.RenderStepped.Connect((deltaTime) => {
			if (this.enabled) {
				this.Update(deltaTime);
			}
		});
	}

	Disable() {
		if (!this.enabled) return;
		this.enabled = false;

		// Unlock mouse
		this.mouseLock.SetActive(false);
	}

	private Update(deltaTime: number) {
		// Get mouse movement
		const rotationDelta = RawInputHandler.GetRotation();

		// Update camera angles
		this.cameraAngleX += -rotationDelta.X * this.cameraSensitivity;
		this.cameraAngleY = math.clamp(
			this.cameraAngleY + -rotationDelta.Y * this.cameraSensitivity,
			-math.pi / 2 + 0.1,
			math.pi / 2 - 0.1,
		);

		// Update zoom from scroll wheel
		const zoomDelta = RawInputHandler.GetZoomDelta();
		this.cameraDistance = math.clamp(this.cameraDistance - zoomDelta * 2, 1, 100);

		// Calculate new camera CFrame
		const rotCFrame = CFrame.fromEulerAnglesYXZ(this.cameraAngleY, this.cameraAngleX, 0);
		const position = this.camera.CFrame.Position;

		// Get movement input relative to camera orientation
		const moveVector = RawInputHandler.GetMoveVector(false, true);
		const moveSpeed = 20 * deltaTime;

		// Apply movement
		const newPosition = position
			.add(rotCFrame.RightVector.mul(moveVector.X * moveSpeed))
			.add(rotCFrame.UpVector.mul(moveVector.Y * moveSpeed))
			.add(rotCFrame.LookVector.mul(-moveVector.Z * moveSpeed));

		// Set camera CFrame
		this.camera.CFrame = CFrame.new(newPosition).mul(rotCFrame);
	}
}

// Example usage
const freeCamera = new FreeCamera();

// Toggle camera with a key
game.GetService("UserInputService").InputBegan.Connect((input, gameProcessed) => {
	if (gameProcessed) return;

	if (input.KeyCode === Enum.KeyCode.F) {
		if (freeCamera.enabled) {
			freeCamera.Disable();
		} else {
			freeCamera.Enable();
		}
	}
});
```

## Input Rebinding System

An example of using the system for custom control rebinding:

```ts
import {
	InputActionsInitializationHelper,
	InputContextController,
	InputKeyCodeHelper,
	DeviceTypeHandler,
	EInputDeviceType,
	EInputType,
} from "@rbxts/input-actions";

// Initialize the system
InputActionsInitializationHelper.InitAll();

// Game controls context
const gameControlsContext = InputContextController.CreateContext("gameControls");

// Default controls
gameControlsContext.Add("Jump", {
	KeyboardAndMouse: Enum.KeyCode.Space,
	Gamepad: Enum.KeyCode.ButtonA,
});

gameControlsContext.Add("Sprint", {
	KeyboardAndMouse: Enum.KeyCode.LeftShift,
	Gamepad: Enum.KeyCode.ButtonL3,
});

gameControlsContext.Add("Crouch", {
	KeyboardAndMouse: Enum.KeyCode.C,
	Gamepad: Enum.KeyCode.ButtonB,
});

// Class to manage control binding
class ControlsManager {
	private currentlyRebinding: string | undefined;
	private controlsGui: ScreenGui;

	constructor() {
		// Reference to the controls UI
		this.controlsGui = game
			.GetService("Players")
			.LocalPlayer.WaitForChild("PlayerGui")
			.WaitForChild("ControlsGui") as ScreenGui;

		// Load saved keybindings if available
		this.LoadKeybindings();

		// Update UI to show current bindings
		this.UpdateControlsDisplay();
	}

	// Start rebinding a specific action
	StartRebinding(actionName: string) {
		this.currentlyRebinding = actionName;

		// Show "Press any key" message
		const actionButton = this.controlsGui.FindFirstChild(actionName + "Button") as TextButton;
		if (actionButton) {
			actionButton.Text = "Press any key...";
		}

		// Listen for the next key press
		const connection = game.GetService("UserInputService").InputBegan.Connect((input) => {
			if (this.currentlyRebinding) {
				// Get the device type we're rebinding for
				const deviceType =
					DeviceTypeHandler.GetMainInputType() === EInputType.Gamepad
						? EInputDeviceType.Gamepad
						: EInputDeviceType.KeyboardAndMouse;

				// Don't allow certain keys (e.g., Escape)
				if (input.KeyCode === Enum.KeyCode.Escape) {
					this.CancelRebinding();
					return;
				}

				// Update the binding
				const inputKey =
					input.KeyCode !== Enum.KeyCode.Unknown ? input.KeyCode : input.UserInputType;

				this.SetBinding(this.currentlyRebinding, deviceType, inputKey);

				// Save the new bindings
				this.SaveKeybindings();

				// Update UI
				this.UpdateControlsDisplay();

				// End rebinding mode
				this.currentlyRebinding = undefined;
				connection.Disconnect();
			}
		});
	}

	// Cancel the current rebinding operation
	CancelRebinding() {
		if (this.currentlyRebinding) {
			// Revert the button text
			const actionButton = this.controlsGui.FindFirstChild(
				this.currentlyRebinding + "Button",
			) as TextButton;
			if (actionButton) {
				const binding = gameControlsContext.GetInputKeyForCurrentDevice(this.currentlyRebinding);
				const visualData = InputKeyCodeHelper.GetVisualInputKeyCodeData(binding);
				actionButton.Text = visualData.DisplayName;
			}

			this.currentlyRebinding = undefined;
		}
	}

	// Set a new key binding
	SetBinding(actionName: string, deviceType: EInputDeviceType, keyCode: InputKeyCode) {
		gameControlsContext.UpdateKey(actionName, deviceType, keyCode);
	}

	// Reset all bindings to defaults
	ResetToDefaults() {
		// This would re-create the default bindings
		// For this example, we'd just reload the page/place
	}

	// Update the UI to show current bindings
	UpdateControlsDisplay() {
		// For each action, update its button text
		for (const actionName of gameControlsContext.GetAllMappedActions()) {
			const binding = gameControlsContext.GetInputKeyForCurrentDevice(actionName);
			const visualData = InputKeyCodeHelper.GetVisualInputKeyCodeData(binding);

			const actionButton = this.controlsGui.FindFirstChild(actionName + "Button") as TextButton;
			if (actionButton) {
				actionButton.Text = visualData.DisplayName;
			}
		}
	}

	// Save keybindings to player data
	SaveKeybindings() {
		// In a real game, you would save to DataStore
		// For this example, we'll just use a simple object
		const bindings: Record<string, Record<string, number>> = {};

		for (const actionName of gameControlsContext.GetAllMappedActions()) {
			bindings[actionName] = {};

			const kbKey = gameControlsContext.GetDeviceKey(actionName, EInputDeviceType.KeyboardAndMouse);
			if (kbKey && typeIs(kbKey, "EnumItem")) {
				bindings[actionName]["KeyboardAndMouse"] = kbKey.Value;
			}

			const gpKey = gameControlsContext.GetDeviceKey(actionName, EInputDeviceType.Gamepad);
			if (gpKey && typeIs(gpKey, "EnumItem")) {
				bindings[actionName]["Gamepad"] = gpKey.Value;
			}
		}

		print("Would save bindings:", bindings);
	}

	// Load keybindings from player data
	LoadKeybindings() {
		// In a real game, you would load from DataStore
		// For this example, we'll just assume defaults
	}
}

// Example usage
const controlsManager = new ControlsManager();

// Set up UI buttons for rebinding
for (const actionName of gameControlsContext.GetAllMappedActions()) {
	const actionButton = game
		.GetService("Players")
		.LocalPlayer.WaitForChild("PlayerGui")
		.WaitForChild("ControlsGui")
		.FindFirstChild(actionName + "Button") as TextButton;

	if (actionButton) {
		actionButton.MouseButton1Click.Connect(() => {
			controlsManager.StartRebinding(actionName);
		});
	}
}

// Apply the controls
gameControlsContext.Assign();
```

## Context Switching

An example showing how to switch between different input contexts:

```ts
import {
	InputActionsInitializationHelper,
	InputContextController,
	ActionsController,
} from "@rbxts/input-actions";
import { RunService } from "@rbxts/services";

// Initialize the system
InputActionsInitializationHelper.InitAll();

// Create various contexts for different game states
const gameplayContext = InputContextController.CreateContext("gameplay");
const menuContext = InputContextController.CreateContext("menu");
const vehicleContext = InputContextController.CreateContext("vehicle");
const swimContext = InputContextController.CreateContext("swimming");

// Set up some actions in each context
// Gameplay context
gameplayContext.Add("Jump", { KeyboardAndMouse: Enum.KeyCode.Space });
gameplayContext.Add("Sprint", { KeyboardAndMouse: Enum.KeyCode.LeftShift });
gameplayContext.Add("Interact", { KeyboardAndMouse: Enum.KeyCode.E });

// Menu context
menuContext.Add("Select", { KeyboardAndMouse: Enum.KeyCode.Return });
menuContext.Add("Back", { KeyboardAndMouse: Enum.KeyCode.Escape });

// Vehicle context
vehicleContext.Add("Accelerate", { KeyboardAndMouse: Enum.KeyCode.W });
vehicleContext.Add("Brake", { KeyboardAndMouse: Enum.KeyCode.S });

// Swimming context
swimContext.Add("Swim", { KeyboardAndMouse: Enum.KeyCode.Space });
swimContext.Add("Dive", { KeyboardAndMouse: Enum.KeyCode.LeftControl });

// Game state manager
class GameStateManager {
	private currentState: string = "gameplay";

	constructor() {
		// Start in gameplay state
		this.TransitionTo("gameplay");

		// Listen for state change triggers
		RunService.Heartbeat.Connect(() => this.Update());
	}

	private Update() {
		// Check for state transitions based on actions

		// Open menu when Escape is pressed (can be pressed in any state)
		if (ActionsController.IsJustPressed("OpenMenu")) {
			if (this.currentState === "menu") {
				this.TransitionTo("gameplay");
			} else {
				this.TransitionTo("menu");
			}
		}

		// State-specific transitions
		if (this.currentState === "gameplay") {
			// Check for entering vehicle
			if (ActionsController.IsJustPressed("Interact")) {
				// Assuming we're near a vehicle and pressed the interact key
				const nearVehicle = this.IsNearVehicle();
				if (nearVehicle) {
					this.TransitionTo("vehicle");
				}
			}

			// Check for entering water
			if (this.IsInWater()) {
				this.TransitionTo("swimming");
			}
		} else if (this.currentState === "vehicle") {
			// Check for exiting vehicle
			if (ActionsController.IsJustPressed("Exit")) {
				this.TransitionTo("gameplay");
			}
		} else if (this.currentState === "swimming") {
			// Check for exiting water
			if (!this.IsInWater()) {
				this.TransitionTo("gameplay");
			}
		}
	}

	private TransitionTo(newState: string) {
		// Don't transition to the same state
		if (newState === this.currentState) return;

		// Exit current state
		switch (this.currentState) {
			case "gameplay":
				gameplayContext.Unassign();
				break;
			case "menu":
				menuContext.Unassign();
				break;
			case "vehicle":
				vehicleContext.Unassign();
				break;
			case "swimming":
				swimContext.Unassign();
				break;
		}

		// Enter new state
		switch (newState) {
			case "gameplay":
				gameplayContext.Assign();
				break;
			case "menu":
				menuContext.Assign();
				break;
			case "vehicle":
				vehicleContext.Assign();
				break;
			case "swimming":
				swimContext.Assign();
				break;
		}

		// Update current state
		this.currentState = newState;
		print(`Transitioned to ${newState} state`);
	}

	// Helper methods (would be implemented based on your game's mechanics)
	private IsNearVehicle(): boolean {
		// Check if player is near a vehicle
		return false;
	}

	private IsInWater(): boolean {
		// Check if player is in water
		return false;
	}
}

// Create and start the game state manager
const gameStateManager = new GameStateManager();
```
