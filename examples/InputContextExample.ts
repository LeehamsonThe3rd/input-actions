import {
	ActionsController,
	InputActionsInitializerTools,
	InputMapController,
} from "@rbxts/input-actions";

// Initialize the input system
InputActionsInitializerTools.InitActionsAndInputManager();

// Example: Create a vehicle controls context
const vehicleContext = InputMapController.createContext("Vehicle");

// Add controls to the vehicle context using direct object literals
vehicleContext.add("Accelerate", {
	Gamepad: Enum.KeyCode.ButtonR2,
	KeyboardAndMouse: Enum.KeyCode.W,
});

vehicleContext.add("Brake", {
	Gamepad: Enum.KeyCode.ButtonL2,
	KeyboardAndMouse: Enum.KeyCode.S,
});

vehicleContext.add("SteerLeft", {
	Gamepad: Enum.KeyCode.Thumbstick1,
	KeyboardAndMouse: Enum.KeyCode.A,
});

vehicleContext.add("SteerRight", {
	Gamepad: Enum.KeyCode.Thumbstick1,
	KeyboardAndMouse: Enum.KeyCode.D,
});

vehicleContext.add("Horn", {
	Gamepad: Enum.KeyCode.ButtonX,
	KeyboardAndMouse: Enum.KeyCode.H,
});

// Example: Create a weapon controls context
const weaponContext = InputMapController.createContext("Weapon");

weaponContext.add("Fire", {
	Gamepad: Enum.KeyCode.ButtonR2,
	KeyboardAndMouse: Enum.KeyCode.MouseButton1,
});

weaponContext.add("Aim", {
	Gamepad: Enum.KeyCode.ButtonL2,
	KeyboardAndMouse: Enum.KeyCode.MouseButton2,
});

weaponContext.add("Reload", {
	Gamepad: Enum.KeyCode.ButtonX,
	KeyboardAndMouse: Enum.KeyCode.R,
});

// Example: Get the global context and add a custom action
const globalContext = InputMapController.getGlobalContext();
globalContext.add("ToggleInventory", {
	Gamepad: Enum.KeyCode.ButtonY,
	KeyboardAndMouse: Enum.KeyCode.Tab,
});

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
