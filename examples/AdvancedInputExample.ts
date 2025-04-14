import {
	ActionsController,
	ECustomKey,
	EVibrationPreset,
	HapticFeedbackController,
	InputActionsInitializerTools,
	InputConfigController,
	InputContextController,
	InputEchoController,
	KeyCombinationController,
} from "@rbxts/input-actions";
import { RunService } from "@rbxts/services";

// Initialize all controllers
InputActionsInitializerTools.InitAll();

// Step 1: Set up different input contexts for different game states
// Create the "gameplay" context
const gameplayContext = InputContextController.createContext("gameplay");
gameplayContext.add("Jump", { KeyboardAndMouse: Enum.KeyCode.Space });
gameplayContext.add("Fire", { KeyboardAndMouse: Enum.UserInputType.MouseButton1 });
gameplayContext.add("Reload", { KeyboardAndMouse: Enum.KeyCode.R });

// Create the "menu" context
const menuContext = InputContextController.createContext("menu");
menuContext.add("Accept", { KeyboardAndMouse: Enum.KeyCode.Return });
menuContext.add("Cancel", { KeyboardAndMouse: Enum.KeyCode.Escape });
menuContext.add("NavigateUp", { KeyboardAndMouse: Enum.KeyCode.Up });
menuContext.add("NavigateDown", { KeyboardAndMouse: Enum.KeyCode.Down });

// Apply the gameplay context
gameplayContext.assign();

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
	if (menuOpen) {
		gameplayContext.unassign();
		menuContext.assign();
	} else {
		menuContext.unassign();
		gameplayContext.assign();
	}

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
		HapticFeedbackController.VibratePreset(EVibrationPreset.Success);
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
