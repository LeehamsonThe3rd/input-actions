/**
 * Comprehensive example showing how to use all the controllers together
 */
import {
	ActionsController,
	EVibrationPreset,
	HapticFeedbackController,
	InputActionsInitializationHelper,
	InputConfigController,
	InputContextController,
	InputEchoController,
	KeyCombinationController,
} from "@rbxts/input-actions";
import { RunService } from "@rbxts/services";

// Initialize all controllers
InputActionsInitializationHelper.InitAll();

// Set up contexts for different game states
function SetupInputContexts() {
	// Create gameplay context
	const gameplayContext = InputContextController.CreateContext("gameplay");
	gameplayContext.Add("Jump", { KeyboardAndMouse: Enum.KeyCode.Space });
	gameplayContext.Add("Attack", { KeyboardAndMouse: Enum.UserInputType.MouseButton1 });
	gameplayContext.Add("Run", { KeyboardAndMouse: Enum.KeyCode.LeftShift });
	gameplayContext.Add("Crouch", { KeyboardAndMouse: Enum.KeyCode.LeftControl });
	gameplayContext.Add("Reload", { KeyboardAndMouse: Enum.KeyCode.R });
	gameplayContext.Add("Interact", { KeyboardAndMouse: Enum.KeyCode.E });

	// Create menu context
	const menuContext = InputContextController.CreateContext("menu");
	menuContext.Add("MenuUp", { KeyboardAndMouse: Enum.KeyCode.Up });
	menuContext.Add("MenuDown", { KeyboardAndMouse: Enum.KeyCode.Down });
	menuContext.Add("MenuLeft", { KeyboardAndMouse: Enum.KeyCode.Left });
	menuContext.Add("MenuRight", { KeyboardAndMouse: Enum.KeyCode.Right });
	menuContext.Add("MenuAccept", { KeyboardAndMouse: Enum.KeyCode.Return });
	menuContext.Add("MenuBack", { KeyboardAndMouse: Enum.KeyCode.Escape });

	// Configure menu navigation to repeat when held
	InputEchoController.ConfigureActionEcho("MenuUp", 0.4, 0.15);
	InputEchoController.ConfigureActionEcho("MenuDown", 0.4, 0.15);

	// Start with gameplay context
	gameplayContext.Assign();
}

// Set up key combinations
function SetupKeyCombinations() {
	// Add shortcut for opening inventory (I or Tab)
	KeyCombinationController.RegisterCombination("OpenInventory", Enum.KeyCode.I);
	KeyCombinationController.RegisterCombination("OpenInventory", Enum.KeyCode.Tab);

	// Add shortcut for quick save (Ctrl+S)
	KeyCombinationController.RegisterCombination("QuickSave", Enum.KeyCode.S, [
		Enum.KeyCode.LeftControl,
	]);

	// Add shortcut for quick load (Ctrl+L)
	KeyCombinationController.RegisterCombination("QuickLoad", Enum.KeyCode.L, [
		Enum.KeyCode.LeftControl,
	]);
}

// Configure input settings
function ConfigureInputSettings() {
	// Increase thumbstick deadzone to reduce drift
	InputConfigController.SetInputDeadzone(Enum.KeyCode.Thumbstick1, 0.18);
	InputConfigController.SetInputDeadzone(Enum.KeyCode.Thumbstick2, 0.2);

	// Make aiming require a stronger press on triggers
	ActionsController.Add("Aim", 0.3);
	InputConfigController.SetActionActivationThreshold("Aim", 0.7);
}

// Set up game state
let isMenuOpen = false;

// Handle input events
RunService.Heartbeat.Connect(() => {
	// Check for menu toggle
	if (ActionsController.IsJustPressed("MenuBack") && !isMenuOpen) {
		OpenMenu();
	} else if (ActionsController.IsJustPressed("MenuBack") && isMenuOpen) {
		CloseMenu();
	}

	// Check for shortcuts
	if (ActionsController.IsJustPressed("QuickSave")) {
		print("Game saved!");
		// Provide feedback through controller vibration
		HapticFeedbackController.VibratePreset(EVibrationPreset.Success);
	}

	if (ActionsController.IsJustPressed("QuickLoad")) {
		print("Game loaded!");
		// Provide feedback through controller vibration
		HapticFeedbackController.VibratePreset(EVibrationPreset.Medium);
	}

	if (ActionsController.IsJustPressed("OpenInventory")) {
		print("Inventory opened!");
	}
});

function OpenMenu() {
	isMenuOpen = true;
	const menuContext = InputContextController.GetContext("menu")!;
	const gameplayContext = InputContextController.GetContext("gameplay")!;

	gameplayContext.Unassign();
	menuContext.Assign();
	print("Menu opened - context switched to menu controls");
}

function CloseMenu() {
	isMenuOpen = false;
	const menuContext = InputContextController.GetContext("menu")!;
	const gameplayContext = InputContextController.GetContext("gameplay")!;

	menuContext.Unassign();
	gameplayContext.Assign();
	print("Menu closed - context switched to gameplay controls");
}

// Initialize everything
SetupInputContexts();
SetupKeyCombinations();
ConfigureInputSettings();

print("Control system initialized!");
