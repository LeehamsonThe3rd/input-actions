/**
 * Comprehensive example showing how to use all the controllers together
 */
import { Players, RunService, UserInputService } from "@rbxts/services";
import {
	ActionsController,
	ECustomKey,
	InputActionsInitializerTools,
	InputConfigController,
	InputContextController,
	InputEchoController,
	KeyCombinationController,
	HapticFeedbackController,
} from "@rbxts/input-actions";

// Initialize all controllers
InputActionsInitializerTools.InitAll();

// Set up contexts for different game states
function setupInputContexts() {
	// Create gameplay context
	InputContextController.CreateContext("gameplay");
	InputContextController.AddActionToContext("gameplay", "Jump", Enum.KeyCode.Space);
	InputContextController.AddActionToContext("gameplay", "Attack", Enum.KeyCode.MouseButton1);
	InputContextController.AddActionToContext("gameplay", "Run", Enum.KeyCode.LeftShift);
	InputContextController.AddActionToContext("gameplay", "Crouch", Enum.KeyCode.LeftControl);
	InputContextController.AddActionToContext("gameplay", "Reload", Enum.KeyCode.R);
	InputContextController.AddActionToContext("gameplay", "Interact", Enum.KeyCode.E);

	// Create menu context
	InputContextController.CreateContext("menu");
	InputContextController.AddActionToContext("menu", "MenuUp", Enum.KeyCode.Up);
	InputContextController.AddActionToContext("menu", "MenuDown", Enum.KeyCode.Down);
	InputContextController.AddActionToContext("menu", "MenuLeft", Enum.KeyCode.Left);
	InputContextController.AddActionToContext("menu", "MenuRight", Enum.KeyCode.Right);
	InputContextController.AddActionToContext("menu", "MenuAccept", Enum.KeyCode.Return);
	InputContextController.AddActionToContext("menu", "MenuBack", Enum.KeyCode.Escape);

	// Configure menu navigation to repeat when held
	InputEchoController.ConfigureActionEcho("MenuUp", 0.4, 0.15);
	InputEchoController.ConfigureActionEcho("MenuDown", 0.4, 0.15);

	// Start with gameplay context
	InputContextController.SetActiveContext("gameplay");
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
		HapticFeedbackController.VibratePreset("success");
	}

	if (ActionsController.IsJustPressed("QuickLoad")) {
		print("Game loaded!");
		// Provide feedback through controller vibration
		HapticFeedbackController.VibratePreset("medium");
	}

	if (ActionsController.IsJustPressed("OpenInventory")) {
		print("Inventory opened!");
	}
});

function openMenu() {
	isMenuOpen = true;
	InputContextController.SetActiveContext("menu");
	print("Menu opened - context switched to menu controls");
}

function closeMenu() {
	isMenuOpen = false;
	InputContextController.SetActiveContext("gameplay");
	print("Menu closed - context switched to gameplay controls");
}

// Initialize everything
setupInputContexts();
setupKeyCombinations();
configureInputSettings();

print("Control system initialized!");
