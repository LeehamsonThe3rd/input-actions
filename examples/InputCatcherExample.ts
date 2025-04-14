import { InputCatcher, InputActionsInitializationHelper } from "@rbxts/input-actions";
import { RunService } from "@rbxts/services";

// Example showing how to temporarily block all input
// Useful for cutscenes, loading screens, or modal dialogs

// Initialize required controllers
InputActionsInitializationHelper.InitActionsAndInputManager();

// Create an input catcher with a high priority
// Higher priority ensures it catches input before other handlers
const blockingInputCatcher = new InputCatcher(1000);

// Simulate a cutscene or loading sequence
function PlayCutscene() {
	print("Cutscene started - blocking all input");

	// Block all input while the cutscene plays
	blockingInputCatcher.GrabInput();

	// Simulate cutscene duration
	task.delay(5, () => {
		// Release input block when cutscene is done
		blockingInputCatcher.ReleaseInput();
		print("Cutscene ended - input restored");
	});
}

// Function to simulate a modal dialog that blocks input
function ShowModalDialog(message: string, duration: number = 3) {
	print(`Dialog shown: "${message}" - blocking all input`);

	// Block all input
	blockingInputCatcher.GrabInput();

	// Simulate dialog being visible
	task.delay(duration, () => {
		// Release input block when dialog is closed
		blockingInputCatcher.ReleaseInput();
		print("Dialog closed - input restored");
	});
}

// Demo: Toggle input blocking with a timer
let blockingActive = false;
let blockingStartTime = 0;

RunService.Heartbeat.Connect((deltaTime) => {
	// Auto-toggle blocking every 6 seconds for demo purposes
	const currentTime = os.clock();

	if (!blockingActive && currentTime - blockingStartTime > 6) {
		blockingActive = true;
		blockingStartTime = currentTime;

		// Alternate between cutscene and dialog for demo
		if (math.random() < 0.5) {
			PlayCutscene();
		} else {
			ShowModalDialog("Important game message!", 3);
		}
	} else if (blockingActive && blockingInputCatcher.IsActive) {
		// Show countdown while input is blocked
		const remainingTime = math.ceil(3 - (currentTime - blockingStartTime));
		print(`Input blocked: ${remainingTime}s remaining`);
	} else if (blockingActive && !blockingInputCatcher.IsActive) {
		blockingActive = false;
	}
});

// Start the demo
print("Input catcher example started");
print("Will automatically toggle between blocking and unblocking input");
