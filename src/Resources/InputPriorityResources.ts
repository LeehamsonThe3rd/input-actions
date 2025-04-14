/**
 * Defines priority constants for various input operations
 */
export namespace InputPriorityResources {
	/**
	 * Priority for key combination handlers (higher than normal input)
	 */
	export const KEY_COMBINATION_PRIORITY = 1000;

	/**
	 * Default delay for auto-repeat in seconds
	 */
	export const DEFAULT_KEY_REPEAT_DELAY = 0.1;

	/**
	 * Default release delay for key combinations
	 */
	export const KEY_COMBINATION_RELEASE_DELAY = 0.1;
}
