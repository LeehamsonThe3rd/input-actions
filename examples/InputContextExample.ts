import {
	ActionsController,
	InputActionsInitializerTools,
	InputMapController,
} from "@rbxts/input-actions";

// Initialize the input system
InputActionsInitializerTools.InitActionsAndInputManager();

// Example: Create a vehicle controls context
const vehicleContext = InputMapController.CreateContext("Vehicle");

// Add controls to the vehicle context using direct object literals
vehicleContext.Add("Accelerate", {
	Gamepad: Enum.KeyCode.ButtonR2,
	KeyboardAndMouse: Enum.KeyCode.W,
});

vehicleContext.Add("Brake", {
	Gamepad: Enum.KeyCode.ButtonL2,
	KeyboardAndMouse: Enum.KeyCode.S,
});

vehicleContext.Add("SteerLeft", {
	Gamepad: Enum.KeyCode.Thumbstick1,
	KeyboardAndMouse: Enum.KeyCode.A,
});

vehicleContext.Add("SteerRight", {
	Gamepad: Enum.KeyCode.Thumbstick1,
	KeyboardAndMouse: Enum.KeyCode.D,
});

vehicleContext.Add("Horn", {
	Gamepad: Enum.KeyCode.ButtonX,
	KeyboardAndMouse: Enum.KeyCode.H,
});

// Example: Create a weapon controls context
const weaponContext = InputMapController.CreateContext("Weapon");

weaponContext.Add("Fire", {
	Gamepad: Enum.KeyCode.ButtonR2,
	KeyboardAndMouse: Enum.KeyCode.MouseButton1,
});

weaponContext.Add("Aim", {
	Gamepad: Enum.KeyCode.ButtonL2,
	KeyboardAndMouse: Enum.KeyCode.MouseButton2,
});

weaponContext.Add("Reload", {
	Gamepad: Enum.KeyCode.ButtonX,
	KeyboardAndMouse: Enum.KeyCode.R,
});

// Example: Get the global context and add a custom action
const globalContext = InputMapController.GetGlobalContext();
globalContext.Add("ToggleInventory", {
	Gamepad: Enum.KeyCode.ButtonY,
	KeyboardAndMouse: Enum.KeyCode.Tab,
});

// Example usage: Player enters a vehicle
function EnterVehicle() {
	// Unassign weapon controls if they were active
	weaponContext.Unassign();

	// Assign vehicle controls
	vehicleContext.Assign();

	print("Vehicle controls activated");
}

// Example usage: Player exits a vehicle
function ExitVehicle() {
	// Unassign vehicle controls
	vehicleContext.Unassign();

	print("Vehicle controls deactivated");
}

// Example usage: Player equips a weapon
function EquipWeapon() {
	// Make sure vehicle controls are not active
	if (vehicleContext.IsAssigned()) {
		print("Cannot equip weapon while in vehicle");
		return;
	}

	// Assign weapon controls
	weaponContext.Assign();

	print("Weapon controls activated");
}

// Example usage: Player holsters a weapon
function HolsterWeapon() {
	// Unassign weapon controls
	weaponContext.Unassign();

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
EnterVehicle();
task.wait(3);
ExitVehicle();
task.wait(1);
EquipWeapon();
