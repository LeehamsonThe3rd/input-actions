import {
	EDefaultInputAction,
	EInputType,
	InputActionsInitializationHelper,
	InputManagerController,
	DeviceTypeHandler,
} from "@rbxts/input-actions";

// UI Navigation example that shows how to use the input system
// to navigate a UI with gamepad/keyboard

// Step 1: Initialize required controllers
InputActionsInitializationHelper.InitBasicInputControllers();
InputActionsInitializationHelper.InitDeviceTypeHandler();

// Step 2: Define our UI navigation system
class UINavigationSystem {
	private selectedElement: GuiObject | undefined;
	private elements: GuiObject[] = [];
	private cleanupFunction: (() => void) | undefined;

	constructor() {
		// Use default UI navigation actions
		this.SetupInputHandling();

		// Listen for input type changes to show/hide selection indicator
		DeviceTypeHandler.OnInputTypeChanged.Connect((inputType) => {
			this.UpdateSelectionVisibility(inputType);
		});
	}

	// Add UI elements that can be navigated
	AddNavigableElements(elements: GuiObject[]) {
		this.elements.push(...elements);

		// Select first element if none selected
		if (!this.selectedElement && this.elements.size() > 0) {
			this.SelectElement(this.elements[0]);
		}
	}

	private SetupInputHandling() {
		// Clean up previous subscription if it exists
		this.cleanupFunction?.();

		// Subscribe to input events
		this.cleanupFunction = InputManagerController.Subscribe((inputEvent) => {
			// Handle UI navigation
			if (inputEvent.IsActionJustPressed(EDefaultInputAction.UiGoUp)) {
				this.NavigateUp();
				return Enum.ContextActionResult.Sink;
			}

			if (inputEvent.IsActionJustPressed(EDefaultInputAction.UiGoDown)) {
				this.NavigateDown();
				return Enum.ContextActionResult.Sink;
			}

			if (inputEvent.IsActionJustPressed(EDefaultInputAction.UiGoLeft)) {
				this.NavigateLeft();
				return Enum.ContextActionResult.Sink;
			}

			if (inputEvent.IsActionJustPressed(EDefaultInputAction.UiGoRight)) {
				this.NavigateRight();
				return Enum.ContextActionResult.Sink;
			}

			if (inputEvent.IsActionJustPressed(EDefaultInputAction.UiAccept)) {
				this.ActivateSelected();
				return Enum.ContextActionResult.Sink;
			}

			return Enum.ContextActionResult.Pass;
		});
	}

	private NavigateUp() {
		// Find the element above the current one
		// Simple implementation - in a real system you would use spatial navigation
		if (!this.selectedElement) return;
		const currentIndex = this.elements.indexOf(this.selectedElement);
		if (currentIndex > 0) {
			this.SelectElement(this.elements[currentIndex - 1]);
		}
	}

	private NavigateDown() {
		// Find the element below the current one
		if (!this.selectedElement) return;
		const currentIndex = this.elements.indexOf(this.selectedElement);
		if (currentIndex < this.elements.size() - 1) {
			this.SelectElement(this.elements[currentIndex + 1]);
		}
	}

	private NavigateLeft() {
		// This would use spatial navigation in a real implementation
		// For this example, we'll keep it simple
	}

	private NavigateRight() {
		// This would use spatial navigation in a real implementation
	}

	private SelectElement(element: GuiObject) {
		// Remove selection from previous element
		if (this.selectedElement) {
			// Remove selection visual
			const selectionBox = this.selectedElement.FindFirstChild("SelectionBox") as Frame;
			if (selectionBox) {
				selectionBox.Visible = false;
			}
		}

		// Select new element
		this.selectedElement = element;

		// Add selection visual
		let selectionBox = this.selectedElement.FindFirstChild("SelectionBox") as Frame;
		if (!selectionBox) {
			selectionBox = new Instance("Frame");
			selectionBox.Name = "SelectionBox";
			selectionBox.BackgroundColor3 = Color3.fromRGB(0, 162, 255);
			selectionBox.BackgroundTransparency = 0.7;
			selectionBox.BorderSizePixel = 0;
			selectionBox.Size = UDim2.fromScale(1, 1);
			selectionBox.ZIndex = this.selectedElement.ZIndex - 1;
			selectionBox.Parent = this.selectedElement;
		}

		selectionBox.Visible = DeviceTypeHandler.GetMainInputType() !== EInputType.KeyboardAndMouse;
	}

	private ActivateSelected() {
		// Simulate a click on the selected element
		if (this.selectedElement) {
			this.selectedElement.Activated.Fire();
		}
	}

	private UpdateSelectionVisibility(inputType: EInputType) {
		if (!this.selectedElement) return;

		const selectionBox = this.selectedElement.FindFirstChild("SelectionBox") as Frame;
		if (selectionBox) {
			// Only show selection box for gamepad/touch input
			selectionBox.Visible = inputType !== EInputType.KeyboardAndMouse;
		}
	}

	Destroy() {
		this.cleanupFunction?.();
	}
}

// Export for use in other scripts
export = UINavigationSystem;
