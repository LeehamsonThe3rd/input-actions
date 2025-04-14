import {
	InputMapController,
	EDefaultInputAction,
	InputActionsInitializerTools,
} from "@rbxts/input-actions";

// Initialize the input system
InputActionsInitializerTools.InitActionsAndInputManager();

// Example: Create a vehicle controls context
const vehicleContext = InputMapController.createContext("Vehicle");

// Add controls to the vehicle context using the fluent builder API
vehicleContext
	.addMap("Accelerate")
	.withGamepad(Enum.KeyCode.ButtonR2)
	.withKeyboardAndMouse(Enum.KeyCode.W)
	.build();

vehicleContext
	.addMap("Brake")
	.withGamepad(Enum.KeyCode.ButtonL2)
	.withKeyboardAndMouse(Enum.KeyCode.S)
	.build();

vehicleContext
	.addMap("SteerLeft")
	.withGamepad(Enum.KeyCode.Thumbstick1)
	.withKeyboardAndMouse(Enum.KeyCode.A)
	.build();

vehicleContext
	.addMap("SteerRight")
	.withGamepad(Enum.KeyCode.Thumbstick1)
	.withKeyboardAndMouse(Enum.KeyCode.D)
	.build();

vehicleContext
	.addMap("Horn")
	.withGamepad(Enum.KeyCode.ButtonX)
	.withKeyboardAndMouse(Enum.KeyCode.H)
	.build();

// Example: Create a weapon controls context
const weaponContext = InputMapController.createContext("Weapon");

weaponContext
	.addMap("Fire")
	.withGamepad(Enum.KeyCode.ButtonR2)
	.withKeyboardAndMouse(Enum.KeyCode.MouseButton1)
	.build();

weaponContext
	.addMap("Aim")
	.withGamepad(Enum.KeyCode.ButtonL2)
	.withKeyboardAndMouse(Enum.KeyCode.MouseButton2)
	.build();

weaponContext
	.addMap("Reload")
	.withGamepad(Enum.KeyCode.ButtonX)
	.withKeyboardAndMouse(Enum.KeyCode.R)
	.build();

// Example: Get the global context and add a custom action
const globalContext = InputMapController.getGlobalContext();
globalContext
	.addMap("ToggleInventory")
	.withGamepad(Enum.KeyCode.ButtonY)
	.withKeyboardAndMouse(Enum.KeyCode.Tab)
	.build();

// Example usage: Player enters a vehicle
function enterVehicle() {
	// Unassign weapon controls if they were active
	weaponContext.unassign();

	// Assign vehicle controls
	vehicleContext.assign();

	print("Vehicle controls activated");
}

// Example usage: Player exits a vehicle
function exitVehicle() {
	// Unassign vehicle controls
	vehicleContext.unassign();

	print("Vehicle controls deactivated");
}

// Example usage: Player equips a weapon
function equipWeapon() {
	// Make sure vehicle controls are not active
	if (vehicleContext.isAssigned()) {
		print("Cannot equip weapon while in vehicle");
		return;
	}

	// Assign weapon controls
	weaponContext.assign();

	print("Weapon controls activated");
}

// Example usage: Player holsters a weapon
function holsterWeapon() {
	// Unassign weapon controls
	weaponContext.unassign();

	print("Weapon controls deactivated");
}

// Example of checking if actions are pressed
game.GetService("RunService").Heartbeat.Connect(() => {
	if (vehicleContext.isAssigned()) {
		if (ActionsController.IsPressed("Accelerate")) {
			print("Accelerating...");
		}

		if (ActionsController.IsPressed("Brake")) {
			print("Braking...");
		}
	}

	if (weaponContext.isAssigned()) {
		if (ActionsController.IsJustPressed("Fire")) {
			print("Bang!");
		}
	}

	if (ActionsController.IsJustPressed("ToggleInventory")) {
		print("Toggling inventory...");
	}
});

// For testing
enterVehicle();
task.wait(3);
exitVehicle();
task.wait(1);
equipWeapon();
