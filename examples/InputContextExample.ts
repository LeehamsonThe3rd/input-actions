import {
	ActionsController,
	InputActionsInitializationHelper,
	InputContextController,
} from "@rbxts/input-actions";

// Initialize the input system
InputActionsInitializationHelper.InitActionsAndInputManager();

// Example: Create a vehicle controls context
const vehicleContext = InputContextController.CreateContext("Vehicle");

// Add controls to the vehicle context using direct object literals
vehicleContext.Add("Accelerate", {
	Gamepad: Enum.KeyCode.ButtonR2,
	KeyboardAndMouse: Enum.KeyCode.W,
});

vehicleContext.Add("Brake", {
	Gamepad: Enum.KeyCode.ButtonL2,
	KeyboardAndMouse: Enum.KeyCode.S,
});

// Example: Create a weapon controls context
const weaponContext = InputContextController.CreateContext("Weapon");

weaponContext.Add("Fire", {
	Gamepad: Enum.KeyCode.ButtonR2,
	KeyboardAndMouse: Enum.UserInputType.MouseButton1,
});

weaponContext.Add("Reload", {
	Gamepad: Enum.KeyCode.ButtonX,
	KeyboardAndMouse: Enum.KeyCode.R,
});

// Example: Get the global context for always-available actions
const globalContext = InputContextController.GetGlobalContext();
globalContext.Add("ToggleInventory", {
	Gamepad: Enum.KeyCode.ButtonY,
	KeyboardAndMouse: Enum.KeyCode.Tab,
});

// Demonstrating context switching
function EnterVehicle() {
	// Unassign weapon controls if they were active
	weaponContext.Unassign();
	// Assign vehicle controls
	vehicleContext.Assign();
	print("Vehicle controls activated");
}

function ExitVehicle() {
	vehicleContext.Unassign();
	print("Vehicle controls deactivated");
}

// Example of checking if actions are pressed
game.GetService("RunService").Heartbeat.Connect(() => {
	// Only check vehicle actions when in vehicle context
	if (vehicleContext.IsAssigned() && ActionsController.IsPressed("Accelerate")) {
		print("Accelerating...");
	}

	// Global context actions are always available
	if (ActionsController.IsJustPressed("ToggleInventory")) {
		print("Toggling inventory...");
	}
});

// For testing
EnterVehicle();
