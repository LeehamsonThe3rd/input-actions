import {
	ActionsController,
	EDefaultInputAction,
	InputActionsInitializerTools,
	InputManagerController,
	InputTypeController,
	EInputType,
} from "@rbxts/input-actions";

// UI Navigation example that shows how to use the input system
// to navigate a UI with gamepad/keyboard

// Step 1: Initialize required controllers
InputActionsInitializerTools.InitActionsAndInputManager();
InputActionsInitializerTools.InitInputTypeController();

// Step 2: Define our UI navigation system
class UINavigationSystem {
	private selectedElement: GuiObject | undefined;
	private elements: GuiObject[] = [];
	private cleanupFunction: (() => void) | undefined;

	constructor() {
		// Use default UI navigation actions
		this.setupInputHandling();

		// Listen for input type changes to show/hide selection indicator
		InputTypeController.OnInputTypeChanged.Connect((inputType) => {
			this.updateSelectionVisibility(inputType);
		});
	}

	// Add UI elements that can be navigated
	addNavigableElements(elements: GuiObject[]) {
		this.elements.push(...elements);

		// Select first element if none selected
		if (!this.selectedElement && this.elements.size() > 0) {
			this.selectElement(this.elements[0]);
		}
	}

	private setupInputHandling() {
		// Clean up previous subscription if it exists
		this.cleanupFunction?.();

		// Subscribe to input events
		this.cleanupFunction = InputManagerController.Subscribe((inputEvent) => {
			// Handle UI navigation
			if (inputEvent.IsActionJustPressed(EDefaultInputAction.UiGoUp)) {
				this.navigateUp();
				return Enum.ContextActionResult.Sink;
			}

			if (inputEvent.IsActionJustPressed(EDefaultInputAction.UiGoDown)) {
				this.navigateDown();
				return Enum.ContextActionResult.Sink;
			}

			if (inputEvent.IsActionJustPressed(EDefaultInputAction.UiGoLeft)) {
				this.navigateLeft();
				return Enum.ContextActionResult.Sink;
			}

			if (inputEvent.IsActionJustPressed(EDefaultInputAction.UiGoRight)) {
				this.navigateRight();
				return Enum.ContextActionResult.Sink;
			}

			if (inputEvent.IsActionJustPressed(EDefaultInputAction.UiAccept)) {
				this.activateSelected();
				return Enum.ContextActionResult.Sink;
			}

			return Enum.ContextActionResult.Pass;
		});
	}

	private navigateUp() {
		// Find the element above the current one
		// Simple implementation - in a real system you would use spatial navigation
		if (!this.selectedElement) return;
		const currentIndex = this.elements.indexOf(this.selectedElement);
		if (currentIndex > 0) {
			this.selectElement(this.elements[currentIndex - 1]);
		}
	}

	private navigateDown() {
		// Find the element below the current one
		if (!this.selectedElement) return;
		const currentIndex = this.elements.indexOf(this.selectedElement);
		if (currentIndex < this.elements.size() - 1) {
			this.selectElement(this.elements[currentIndex + 1]);
		}
	}

	private navigateLeft() {
		// This would use spatial navigation in a real implementation
		// For this example, we'll keep it simple
	}

	private navigateRight() {
		// This would use spatial navigation in a real implementation
	}

	private selectElement(element: GuiObject) {
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

		selectionBox.Visible = InputTypeController.GetMainInputType() !== EInputType.KeyboardAndMouse;
	}

	private activateSelected() {
		// Simulate a click on the selected element
		if (this.selectedElement) {
			this.selectedElement.Activated.Fire();
		}
	}

	private updateSelectionVisibility(inputType: EInputType) {
		if (!this.selectedElement) return;

		const selectionBox = this.selectedElement.FindFirstChild("SelectionBox") as Frame;
		if (selectionBox) {
			// Only show selection box for gamepad/touch input
			selectionBox.Visible = inputType !== EInputType.KeyboardAndMouse;
		}
	}

	destroy() {
		this.cleanupFunction?.();
	}
}

// Export for use in other scripts
export = UINavigationSystem;
