import {
	DeviceTypeHandler,
	EInputType,
	InputActionsInitializationHelper,
	InputContextController,
	InputKeyCodeHelper,
} from "@rbxts/input-actions";
import { Players } from "@rbxts/services";

// Example showing how to create and display visual input prompts
// that automatically update based on the current input device

// Initialize required controllers
InputActionsInitializationHelper.InitDeviceTypeHandler();
InputActionsInitializationHelper.InitActionsAndInputManager();

// Create a context with our game actions
const gameContext = InputContextController.CreateContext("gameContext");
gameContext.Add("Jump", {
	KeyboardAndMouse: Enum.KeyCode.Space,
	Gamepad: Enum.KeyCode.ButtonA,
});

gameContext.Add("Sprint", {
	KeyboardAndMouse: Enum.KeyCode.LeftShift,
	Gamepad: Enum.KeyCode.ButtonX,
});

gameContext.Add("Interact", {
	KeyboardAndMouse: Enum.KeyCode.E,
	Gamepad: Enum.KeyCode.ButtonY,
});

// Assign our context to enable these actions
gameContext.Assign();

// Get player's screen GUI
const player = Players.LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;

// Create a ScreenGui to display our prompts
const screenGui = new Instance("ScreenGui");
screenGui.Name = "InputPrompts";
screenGui.ResetOnSpawn = false;
screenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
screenGui.Parent = playerGui;

// Create a frame to hold our prompts
const promptFrame = new Instance("Frame");
promptFrame.Name = "PromptFrame";
promptFrame.Size = UDim2.fromScale(0.2, 0.15);
promptFrame.Position = UDim2.fromScale(0.8, 0.85);
promptFrame.BackgroundTransparency = 0.5;
promptFrame.BackgroundColor3 = Color3.fromRGB(0, 0, 0);
promptFrame.BorderSizePixel = 0;
promptFrame.Parent = screenGui;

// Create a UIListLayout for our prompts
const listLayout = new Instance("UIListLayout");
listLayout.Padding = new UDim(0, 10);
listLayout.HorizontalAlignment = Enum.HorizontalAlignment.Center;
listLayout.VerticalAlignment = Enum.VerticalAlignment.Center;
listLayout.SortOrder = Enum.SortOrder.LayoutOrder;
listLayout.Parent = promptFrame;

// Function to create a visual prompt for an action
function CreatePrompt(
	actionName: string,
	description: string,
): { frame: Frame; iconImage: ImageLabel } {
	// Create a container frame
	const frame = new Instance("Frame");
	frame.Name = actionName + "Prompt";
	frame.Size = UDim2.fromScale(0.9, 0.2);
	frame.BackgroundTransparency = 1;
	frame.LayoutOrder = frame.GetAttribute("LayoutOrder") as number;
	frame.Parent = promptFrame;

	// Create icon for the input
	const iconImage = new Instance("ImageLabel");
	iconImage.Name = "Icon";
	iconImage.Size = UDim2.fromOffset(40, 40);
	iconImage.Position = UDim2.fromScale(0, 0.5);
	iconImage.AnchorPoint = new Vector2(0, 0.5);
	iconImage.BackgroundTransparency = 1;
	iconImage.Parent = frame;

	// Create description text
	const textLabel = new Instance("TextLabel");
	textLabel.Name = "Description";
	textLabel.Size = UDim2.new(1, -50, 1, 0);
	textLabel.Position = UDim2.fromScale(1, 0.5);
	textLabel.AnchorPoint = new Vector2(1, 0.5);
	textLabel.Text = description;
	textLabel.TextColor3 = Color3.fromRGB(255, 255, 255);
	textLabel.TextXAlignment = Enum.TextXAlignment.Left;
	textLabel.BackgroundTransparency = 1;
	textLabel.Parent = frame;

	return { frame, iconImage };
}

// Create prompts for our actions
const jumpPrompt = CreatePrompt("Jump", "Jump");
const sprintPrompt = CreatePrompt("Sprint", "Sprint");
const interactPrompt = CreatePrompt("Interact", "Interact with objects");

// Helper function to update a prompt's visual elements based on current device
function UpdatePrompt(actionName: string, iconImage: ImageLabel) {
	// Get visual data for the action
	const visualData = gameContext.GetVisualData(actionName);

	// Update the icon image
	if (visualData.ImageId !== "") {
		iconImage.Image = visualData.ImageId;
	} else {
		// Fallback text if no image is available
		iconImage.Image = "";
	}
}

// Update all prompts
function UpdateAllPrompts() {
	UpdatePrompt("Jump", jumpPrompt[1]);
	UpdatePrompt("Sprint", sprintPrompt[1]);
	UpdatePrompt("Interact", interactPrompt[1]);
}

// Update prompts initially
UpdateAllPrompts();

// Update prompts when input type changes
DeviceTypeHandler.OnInputTypeChanged.Connect((inputType) => {
	print(`Input type changed to: ${EInputType[inputType]}`);
	UpdateAllPrompts();
});
