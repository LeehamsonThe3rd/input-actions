import { RunService } from "@rbxts/services";
import { ActionsController } from "./ActionsController";

/**
 * Controller for handling input echo/repeat
 *
 * Provides functionality to trigger repeated input events when keys are held down
 */
export namespace InputEchoController {
	interface IEchoConfig {
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

	// Store echo configurations
	const actionEchoConfigs = new Map<string, IEchoConfig>();
	// Track which actions had echoes triggered this frame
	const echoTriggeredActions = new Set<string>();

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
		echoTriggeredActions.delete(actionName);
	}

	/**
	 * Checks if an echo was triggered for the action this frame
	 */
	export function WasEchoTriggered(actionName: string): boolean {
		return echoTriggeredActions.has(actionName);
	}

	/**
	 * Updates all registered echo actions
	 */
	function Update(deltaTime: number) {
		const now = os.clock();

		// Clear the echo triggered set at the start of each frame
		echoTriggeredActions.clear();

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
							// Mark this action as echo-triggered this frame
							echoTriggeredActions.add(actionName);
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
