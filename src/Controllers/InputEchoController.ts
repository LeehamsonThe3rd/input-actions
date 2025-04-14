import { RunService } from "@rbxts/services";
import { ActionsController } from "./ActionsController";

/**
 * Controller for handling input echo/repeat
 *
 * Provides functionality to trigger repeated input events when keys are held down
 */
export namespace InputEchoController {
	interface EchoConfig {
		/** Delay before first repeat (seconds) */
		initialDelay: number;
		/** Interval between repeats (seconds) */
		repeatInterval: number;
		/** Time the key has been held down */
		heldTime: number;
		/** Whether the key is currently being held */
		isHeld: boolean;
		/** Time of the last echo */
		lastEchoTime: number;
	}

	const DEFAULT_INITIAL_DELAY = 0.5;
	const DEFAULT_REPEAT_INTERVAL = 0.1;

	const actionEchoConfigs = new Map<string, EchoConfig>();
	let initialized = false;

	/**
	 * Initializes the echo controller
	 */
	export function Initialize() {
		if (initialized) return;
		initialized = true;

		RunService.Heartbeat.Connect(Update);
	}

	/**
	 * Configures echo behavior for an action
	 */
	export function ConfigureActionEcho(
		actionName: string,
		initialDelay: number = DEFAULT_INITIAL_DELAY,
		repeatInterval: number = DEFAULT_REPEAT_INTERVAL,
	) {
		actionEchoConfigs.set(actionName, {
			initialDelay,
			repeatInterval,
			heldTime: 0,
			isHeld: false,
			lastEchoTime: 0,
		});
	}

	/**
	 * Disables echo for an action
	 */
	export function DisableActionEcho(actionName: string) {
		actionEchoConfigs.delete(actionName);
	}

	/**
	 * Updates all registered echo actions
	 */
	function Update(deltaTime: number) {
		const now = os.clock();

		for (const [actionName, config] of actionEchoConfigs) {
			const pressed = ActionsController.IsPressed(actionName);

			if (pressed) {
				if (!config.isHeld) {
					// Key just pressed, start tracking
					config.isHeld = true;
					config.heldTime = 0;
					config.lastEchoTime = now;
				} else {
					// Key held down
					config.heldTime += deltaTime;

					// Check if it's time to echo
					if (config.heldTime >= config.initialDelay) {
						const timeSinceLastEcho = now - config.lastEchoTime;
						if (timeSinceLastEcho >= config.repeatInterval) {
							// Trigger echo event by releasing and re-pressing
							ActionsController.Release(actionName);
							task.wait(0); // Wait a frame
							ActionsController.Press(actionName);

							config.lastEchoTime = now;
						}
					}
				}
			} else {
				// Key released
				config.isHeld = false;
				config.heldTime = 0;
			}
		}
	}
}
