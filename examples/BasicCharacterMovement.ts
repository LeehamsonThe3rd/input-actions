import {
	ActionsController,
	ECustomKey,
	InputActionsInitializationHelper,
	RawInputHandler,
} from "@rbxts/input-actions";
import { RunService } from "@rbxts/services";

// Initialize required controllers
InputActionsInitializationHelper.InitAll();

// Define movement actions
ActionsController.Add("Jump");
ActionsController.Add("Sprint");

// Bind both keyboard and gamepad controls
ActionsController.AddKeyCode("Jump", Enum.KeyCode.Space);
ActionsController.AddKeyCode("Jump", Enum.KeyCode.ButtonA);
ActionsController.AddKeyCode("Sprint", Enum.KeyCode.LeftShift);
ActionsController.AddKeyCode("Sprint", Enum.KeyCode.ButtonL2);

// Setup character references
const player = game.GetService("Players").LocalPlayer;
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

	// Get and apply movement from RawInputHandler (handles both WASD and thumbstick automatically)
	const moveVec = RawInputHandler.GetMoveVector(true, true);
	humanoid.Move(moveVec);
});
