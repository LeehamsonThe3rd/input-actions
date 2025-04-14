/**
 * Comprehensive example showing how to use all the controllers together
 */
import {
	ActionsController,
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

// Set up contexts for different game states
function setupInputContexts() {
	// Create gameplay context
	const gameplayContext = InputContextController.createContext("gameplay");
	gameplayContext.add("Jump", { KeyboardAndMouse: Enum.KeyCode.Space });
	gameplayContext.add("Attack", { KeyboardAndMouse: Enum.UserInputType.MouseButton1 });
	gameplayContext.add("Run", { KeyboardAndMouse: Enum.KeyCode.LeftShift });
	gameplayContext.add("Crouch", { KeyboardAndMouse: Enum.KeyCode.LeftControl });
	gameplayContext.add("Reload", { KeyboardAndMouse: Enum.KeyCode.R });
	gameplayContext.add("Interact", { KeyboardAndMouse: Enum.KeyCode.E });

	// Create menu context
	const menuContext = InputContextController.createContext("menu");
	menuContext.add("MenuUp", { KeyboardAndMouse: Enum.KeyCode.Up });
	menuContext.add("MenuDown", { KeyboardAndMouse: Enum.KeyCode.Down });
	menuContext.add("MenuLeft", { KeyboardAndMouse: Enum.KeyCode.Left });
	menuContext.add("MenuRight", { KeyboardAndMouse: Enum.KeyCode.Right });
	menuContext.add("MenuAccept", { KeyboardAndMouse: Enum.KeyCode.Return });
	menuContext.add("MenuBack", { KeyboardAndMouse: Enum.KeyCode.Escape });

	// Configure menu navigation to repeat when held
	InputEchoController.ConfigureActionEcho("MenuUp", 0.4, 0.15);
	InputEchoController.ConfigureActionEcho("MenuDown", 0.4, 0.15);

	// Start with gameplay context
	gameplayContext.assign();
}

// Set up key combinations
function setupKeyCombinations() {
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
function configureInputSettings() {
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
		openMenu();
	} else if (ActionsController.IsJustPressed("MenuBack") && isMenuOpen) {
		closeMenu();
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

function openMenu() {
	isMenuOpen = true;
	const menuContext = InputContextController.getContext("menu")!;
	const gameplayContext = InputContextController.getContext("gameplay")!;

	gameplayContext.unassign();
	menuContext.assign();
	print("Menu opened - context switched to menu controls");
}

function closeMenu() {
	isMenuOpen = false;
	const menuContext = InputContextController.getContext("menu")!;
	const gameplayContext = InputContextController.getContext("gameplay")!;

	menuContext.unassign();
	gameplayContext.assign();
	print("Menu closed - context switched to gameplay controls");
}

// Initialize everything
setupInputContexts();
setupKeyCombinations();
configureInputSettings();

print("Control system initialized!");
