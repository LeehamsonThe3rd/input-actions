import {
	ActionsController,
	InputActionsInitializationHelper,
	RawInputHandler,
	InputContextController,
} from "@rbxts/input-actions";
import { RunService, Players } from "@rbxts/services";

// Example showing how to create a basic character controller
// that works with both keyboard/mouse and gamepad

// Initialize required controllers
InputActionsInitializationHelper.InitAll();

// Create a context for character movement
const movementContext = InputContextController.CreateContext("movement");

// Define movement actions with both keyboard and gamepad bindings
movementContext.Add("Jump", {
	KeyboardAndMouse: Enum.KeyCode.Space,
	Gamepad: Enum.KeyCode.ButtonA,
});

movementContext.Add("Sprint", {
	KeyboardAndMouse: Enum.KeyCode.LeftShift,
	Gamepad: Enum.KeyCode.ButtonL3, // Left thumbstick press
});

// Activate our movement context
movementContext.Assign();

// Setup character references
const player = Players.LocalPlayer;
let character = player.Character || player.CharacterAdded.Wait()[0];
let humanoid = character.WaitForChild("Humanoid") as Humanoid;

player.CharacterAdded.Connect((newCharacter) => {
	character = newCharacter;
	humanoid = character.WaitForChild("Humanoid") as Humanoid;
});

// Character movement constants
const WALK_SPEED = 16;
const SPRINT_SPEED = 24;

// Process input every frame
RunService.RenderStepped.Connect((deltaTime) => {
	if (!character || !humanoid) return;

	// Apply jumping when the Jump action is triggered
	if (ActionsController.IsJustPressed("Jump") && humanoid.FloorMaterial !== Enum.Material.Air) {
		humanoid.Jump = true;
	}

	// Apply sprint speed when the Sprint action is active
	humanoid.WalkSpeed = ActionsController.IsPressed("Sprint") ? SPRINT_SPEED : WALK_SPEED;

	// Get movement from RawInputHandler
	// - relativeCamera: true means movement is relative to camera direction
	// - normalized: true returns a unit vector for consistent movement speed
	// This handles both WASD keyboard input and gamepad thumbstick automatically
	const moveVec = RawInputHandler.GetMoveVector(true, true);

	// Apply the movement to the humanoid
	humanoid.Move(moveVec);
});

// You can also handle camera rotation using RawInputHandler
RunService.RenderStepped.Connect((deltaTime) => {
	// Get rotation delta (mouse movement or right thumbstick)
	const rotationDelta = RawInputHandler.GetRotation();

	// Example of how you might use this for camera control
	// This would be implemented in a camera control system
	print(`Camera rotation this frame: X: ${rotationDelta.X}, Y: ${rotationDelta.Y}`);
});
