import { InputKeyCode } from "../../Models/InputKeyCode";
import IInputMap from "../../Models/IInputMap";

/**
 * Builder for creating input maps with a fluent API
 */
export class InputMapBuilder {
	private gamepadKey?: InputKeyCode;
	private keyboardAndMouseKey?: InputKeyCode;

	/**
	 * Set the gamepad key for this input map
	 */
	public withGamepad(keyCode: InputKeyCode): InputMapBuilder {
		this.gamepadKey = keyCode;
		return this;
	}

	/**
	 * Set the keyboard/mouse key for this input map
	 */
	public withKeyboardAndMouse(keyCode: InputKeyCode): InputMapBuilder {
		this.keyboardAndMouseKey = keyCode;
		return this;
	}

	/**
	 * Build the final input map
	 */
	public build(): IInputMap {
		return {
			Gamepad: this.gamepadKey,
			KeyboardAndMouse: this.keyboardAndMouseKey,
		};
	}

	/**
	 * Create a new builder instance
	 */
	public static create(): InputMapBuilder {
		return new InputMapBuilder();
	}
}
