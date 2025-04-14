/**
 * Example showing how to integrate multiple controllers in a cohesive system
 */
import {
	ActionsController,
	EVibrationPreset,
	HapticFeedbackController,
	InputActionsInitializationHelper,
	InputContextController,
	InputEchoController,
	KeyCombinationController,
} from "@rbxts/input-actions";
import { RunService } from "@rbxts/services";

// Initialize all controllers
InputActionsInitializationHelper.InitAll();

// Set up a complete game input system with both contexts
const gameplayContext = InputContextController.CreateContext("gameplay");
gameplayContext.Add("Jump", { KeyboardAndMouse: Enum.KeyCode.Space });
gameplayContext.Add("Attack", { KeyboardAndMouse: Enum.UserInputType.MouseButton1 });

const menuContext = InputContextController.CreateContext("menu");
menuContext.Add("MenuUp", { KeyboardAndMouse: Enum.KeyCode.Up });
menuContext.Add("MenuDown", { KeyboardAndMouse: Enum.KeyCode.Down });
menuContext.Add("MenuBack", { KeyboardAndMouse: Enum.KeyCode.Escape });

// Configure menu navigation to repeat when held
InputEchoController.ConfigureActionEcho("MenuUp", 0.4, 0.15);
InputEchoController.ConfigureActionEcho("MenuDown", 0.4, 0.15);

// Register key combinations for quick actions
KeyCombinationController.RegisterCombination("QuickSave", Enum.KeyCode.S, [
	Enum.KeyCode.LeftControl,
]);

// Start with gameplay context
gameplayContext.Assign();

// Game state
let isMenuOpen = false;

// Handle state changes
function OpenMenu() {
	isMenuOpen = true;
	gameplayContext.Unassign();
	menuContext.Assign();
	print("Menu opened - context switched");
}

function CloseMenu() {
	isMenuOpen = false;
	menuContext.Unassign();
	gameplayContext.Assign();
	print("Menu closed - context switched");
}

// Process input each frame
RunService.Heartbeat.Connect(() => {
	// Check for menu toggle
	if (ActionsController.IsJustPressed("MenuBack") && !isMenuOpen) {
		OpenMenu();
	} else if (ActionsController.IsJustPressed("MenuBack") && isMenuOpen) {
		CloseMenu();
	}

	// Check for shortcut actions
	if (ActionsController.IsJustPressed("QuickSave")) {
		print("Game saved!");
		// Provide haptic feedback
		HapticFeedbackController.VibratePreset(EVibrationPreset.Success);
	}
});

print("Control system initialized!");
