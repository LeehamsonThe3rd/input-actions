import { RunService } from "@rbxts/services";
import type { ActionsController } from "./ActionsController";

/**
 * Controller for handling input echo/repeat
 *
 * Provides functionality to trigger repeated input events when keys are held down
 */
export namespace InputEchoController {
	interface IEchoConfig {
		/** Delay before first repeat (seconds) */
		InitialDelay: number;
		/** Interval between repeats (seconds) */
		RepeatInterval: number;
		/** Time the key has been held down */
		HeldTime: number;
		/** Whether the key is currently being held */
		IsHeld: boolean;
		/** Time of the last echo */
		LastEchoTime: number;
	}

	const DEFAULT_INITIAL_DELAY = 0.5;
	const DEFAULT_REPEAT_INTERVAL = 0.1;

	// Store echo configurations
	const actionEchoConfigs = new Map<string, IEchoConfig>();
	// Track which actions had echoes triggered this frame
	const echoTriggeredActions = new Set<string>();

	let initialized = false;
	let actionsController!: typeof ActionsController;

	/**@hidden */
	export function SetActionsController(actionsController: typeof ActionsController) {
		actionsController = actionsController;
	}

	/**
	 * Initializes the echo controller
	 */
	export function Initialize() {
		if (initialized) return;
		initialized = true;
		assert(
			actionsController,
			"ActionsController must be Initialized before initializing InputEchoController",
		);
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
			InitialDelay: initialDelay,
			RepeatInterval: repeatInterval,
			HeldTime: 0,
			IsHeld: false,
			LastEchoTime: 0,
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
			const pressed = actionsController.IsPressed(actionName);

			if (pressed) {
				if (!config.IsHeld) {
					// Key just pressed, start tracking
					config.IsHeld = true;
					config.HeldTime = 0;
					config.LastEchoTime = now;
				} else {
					// Key held down
					config.HeldTime += deltaTime;

					// Check if it's time to echo
					if (config.HeldTime >= config.InitialDelay) {
						const timeSinceLastEcho = now - config.LastEchoTime;
						if (timeSinceLastEcho >= config.RepeatInterval) {
							// Mark this action as echo-triggered this frame
							echoTriggeredActions.add(actionName);
							config.LastEchoTime = now;
						}
					}
				}
			} else {
				// Key released
				config.IsHeld = false;
				config.HeldTime = 0;
			}
		}
	}
}
