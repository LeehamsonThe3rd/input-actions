import {
	EMouseLockAction,
	InputActionsInitializationHelper,
	MouseController,
	ActionsController,
} from "@rbxts/input-actions";
import { RunService, Workspace } from "@rbxts/services";

// Mouse control example showing how to create different mouse behaviors
// for different game states like aiming, UI, and free camera

// Initialize required controllers
InputActionsInitializationHelper.InitMouseController();
InputActionsInitializationHelper.InitBasicInputControllers();

// Define our states that affect mouse behavior
ActionsController.Add("Aim");
ActionsController.Add("OpenMenu");
ActionsController.Add("FreeCameraMode");

// Bind keys to our actions
ActionsController.AddKeyCode("Aim", Enum.UserInputType.MouseButton2);
ActionsController.AddKeyCode("OpenMenu", Enum.KeyCode.Tab);
ActionsController.AddKeyCode("FreeCameraMode", Enum.KeyCode.F);

// Step 1: Create mouse lock actions with different priorities
// Higher priority values take precedence when active at the same time
const aimingMouseLock = new MouseController.MouseLockAction(EMouseLockAction.LockMouseCenter, 100);
const menuMouseUnlock = new MouseController.MouseLockAction(EMouseLockAction.UnlockMouse, 200); // Higher priority
const freeCameraLock = new MouseController.MouseLockAction(EMouseLockAction.LockMouseCenter, 150);

// Step 2: Set up strict mode for specific mouse behaviors
// This ensures the behavior is enforced every frame, not just on changes
MouseController.SetMouseLockActionStrictMode(EMouseLockAction.LockMouseCenter, true);

// Step 3: Track game state
let isAiming = false;
let isMenuOpen = false;
let isFreeCameraMode = false;

// Handle camera references
const camera = Workspace.CurrentCamera!;
let originalCameraType: Enum.CameraType;

// Process input every frame
RunService.RenderStepped.Connect((deltaTime) => {
	// Check for state changes

	// Toggle aiming
	if (ActionsController.IsJustPressed("Aim")) {
		isAiming = !isAiming;
		aimingMouseLock.SetActive(isAiming);
		print(`Aiming: ${isAiming ? "enabled" : "disabled"}`);
	}

	// Toggle menu
	if (ActionsController.IsJustPressed("OpenMenu")) {
		isMenuOpen = !isMenuOpen;
		menuMouseUnlock.SetActive(isMenuOpen);
		print(`Menu: ${isMenuOpen ? "opened" : "closed"}`);
	}

	// Toggle free camera mode
	if (ActionsController.IsJustPressed("FreeCameraMode")) {
		isFreeCameraMode = !isFreeCameraMode;

		// Handle camera type changes
		if (isFreeCameraMode) {
			originalCameraType = camera.CameraType;
			camera.CameraType = Enum.CameraType.Scriptable;
			freeCameraLock.SetActive(true);
		} else {
			camera.CameraType = originalCameraType;
			freeCameraLock.SetActive(false);
		}

		print(`Free camera: ${isFreeCameraMode ? "enabled" : "disabled"}`);
	}

	// Demonstrate priority behavior:
	// - Menu unlock (200) takes precedence over everything
	// - Free camera lock (150) takes precedence over aiming (100)
	// - Aiming lock (100) has lowest priority

	// Show current mouse state
	if (isMenuOpen) {
		// Menu state (highest priority)
		// Mouse is visible and freely movable
	} else if (isFreeCameraMode) {
		// Free camera state (medium priority)
		// Mouse is locked to center for camera control
	} else if (isAiming) {
		// Aiming state (lowest priority)
		// Mouse is locked to center for aiming
	} else {
		// Default state
		// Mouse behaves normally
	}
});
