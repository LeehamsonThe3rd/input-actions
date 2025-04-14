import { RunService } from "@rbxts/services";
import {
	ActionsController,
	InputActionsInitializerTools,
	InputConfigController,
	InputContextController,
	InputEchoController,
	KeyCombinationController,
	HapticFeedbackController,
	ECustomKey,
} from "@rbxts/input-actions";

// Initialize all controllers
InputActionsInitializerTools.InitAll();

// Step 1: Set up different input contexts for different game states
// Create the "gameplay" context
InputContextController.CreateContext("gameplay");
InputContextController.AddActionToContext("gameplay", "Jump", Enum.KeyCode.Space);
InputContextController.AddActionToContext("gameplay", "Fire", Enum.KeyCode.MouseButton1);
InputContextController.AddActionToContext("gameplay", "Reload", Enum.KeyCode.R);

// Create the "menu" context
InputContextController.CreateContext("menu");
InputContextController.AddActionToContext("menu", "Accept", Enum.KeyCode.Return);
InputContextController.AddActionToContext("menu", "Cancel", Enum.KeyCode.Escape);
InputContextController.AddActionToContext("menu", "NavigateUp", Enum.KeyCode.Up);
InputContextController.AddActionToContext("menu", "NavigateDown", Enum.KeyCode.Down);

// Apply the gameplay context
InputContextController.SetActiveContext("gameplay");

// Step 2: Configure input echo for repeating input
InputEchoController.ConfigureActionEcho("NavigateDown", 0.4, 0.1);
InputEchoController.ConfigureActionEcho("NavigateUp", 0.4, 0.1);

// Step 3: Configure special key combinations
KeyCombinationController.RegisterCombination("QuickSave", Enum.KeyCode.S, [
	Enum.KeyCode.LeftControl,
]);

KeyCombinationController.RegisterCombination("QuickLoad", Enum.KeyCode.L, [
	Enum.KeyCode.LeftControl,
]);

// Step 4: Configure analog input deadzones
InputConfigController.SetInputDeadzone(Enum.KeyCode.Thumbstick1, 0.15);
InputConfigController.SetInputDeadzone(Enum.KeyCode.Thumbstick2, 0.2);
InputConfigController.SetInputDeadzone(ECustomKey.Thumbstick1Up, 0.15);

// Step 5: Configure action sensitivity
// Make the "Aim" action require a stronger press on triggers
ActionsController.Add("Aim", 0.3);
InputConfigController.SetActionActivationThreshold("Aim", 0.7);

// Example of switching contexts when opening a menu
let menuOpen = false;
const toggleMenu = () => {
	menuOpen = !menuOpen;
	// Switch input context based on menu state
	InputContextController.SetActiveContext(menuOpen ? "menu" : "gameplay");

	print(`Menu is now ${menuOpen ? "open" : "closed"}`);
};

// Subscribe to input for quicksave/quickload
InputActionsInitializerTools.InitActionsAndInputManager();
ActionsController.Add("OpenMenu", 0.5, [Enum.KeyCode.Tab]);

RunService.Heartbeat.Connect(() => {
	// Check for our quick actions
	if (ActionsController.IsJustPressed("QuickSave")) {
		print("Quick saved game!");
		// Trigger haptic feedback for save success
		HapticFeedbackController.VibratePreset("success");
	}

	if (ActionsController.IsJustPressed("QuickLoad")) {
		print("Quick loaded game!");
		// Trigger haptic feedback for load
		HapticFeedbackController.Vibrate(0.7, 0.5, 0.3);
	}

	if (ActionsController.IsJustPressed("OpenMenu")) {
		toggleMenu();
	}
});
