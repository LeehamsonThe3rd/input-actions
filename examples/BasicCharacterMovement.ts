import { RunService } from "@rbxts/services";
import {
	ActionsController,
	InputActionsInitializerTools,
	InputController,
	ECustomKey,
} from "@rbxts/input-actions";

// Character movement example that shows how to use the input system
// to create a character controller with WASD/Gamepad movement

// Step 1: Initialize required controllers
InputActionsInitializerTools.InitAll();

// Step 2: Define our movement actions
ActionsController.Add("MoveForward");
ActionsController.Add("MoveBackward");
ActionsController.Add("MoveLeft");
ActionsController.Add("MoveRight");
ActionsController.Add("Jump");
ActionsController.Add("Sprint");

// Step 3: Bind keyboard keys to our actions
ActionsController.AddKeyCode("MoveForward", Enum.KeyCode.W);
ActionsController.AddKeyCode("MoveBackward", Enum.KeyCode.S);
ActionsController.AddKeyCode("MoveLeft", Enum.KeyCode.A);
ActionsController.AddKeyCode("MoveRight", Enum.KeyCode.D);
ActionsController.AddKeyCode("Jump", Enum.KeyCode.Space);
ActionsController.AddKeyCode("Sprint", Enum.KeyCode.LeftShift);

// Step 4: Bind gamepad inputs to our actions
ActionsController.AddKeyCode("MoveForward", ECustomKey.Thumbstick1Up);
ActionsController.AddKeyCode("MoveBackward", ECustomKey.Thumbstick1Down);
ActionsController.AddKeyCode("MoveLeft", ECustomKey.Thumbstick1Left);
ActionsController.AddKeyCode("MoveRight", ECustomKey.Thumbstick1Right);
ActionsController.AddKeyCode("Jump", Enum.KeyCode.ButtonA);
ActionsController.AddKeyCode("Sprint", Enum.KeyCode.ButtonL2);

// Step 5: Constants for our movement logic
const WALK_SPEED = 16;
const SPRINT_SPEED = 24;
const JUMP_POWER = 50;

// Step 6: Get references to the player's character
const player = game.GetService("Players").LocalPlayer;
let character = player.Character || player.CharacterAdded.Wait()[0];
let humanoid = character.WaitForChild("Humanoid") as Humanoid;

player.CharacterAdded.Connect((newCharacter) => {
	character = newCharacter;
	humanoid = character.WaitForChild("Humanoid") as Humanoid;
});

// Step 7: Process input every frame
RunService.RenderStepped.Connect((deltaTime) => {
	if (!character || !humanoid) return;

	// Check for jumping
	if (ActionsController.IsJustPressed("Jump") && humanoid.FloorMaterial !== Enum.Material.Air) {
		humanoid.Jump = true;
	}

	// Check for sprinting
	humanoid.WalkSpeed = ActionsController.IsPressed("Sprint") ? SPRINT_SPEED : WALK_SPEED;

	// Get the combined move vector relative to the camera
	const moveVec = InputController.GetMoveVector(true, true);

	// Apply the movement
	humanoid.Move(moveVec);
});
