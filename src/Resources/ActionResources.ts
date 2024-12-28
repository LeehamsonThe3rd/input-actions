export namespace ActionResources {
	export const NONE_ACTION = "*";
	export const DEFAULT_MIN_PRESS_STRENGTH = 0.5;
	export const DEFAULT_THUMBSTICK_DEAD_ZONE = 0.2;
	export const ALL_KEYCODES = [
		...Enum.KeyCode.GetEnumItems(),
		...Enum.UserInputType.GetEnumItems(),
		...Enum.PlayerActions.GetEnumItems(),
	];
}
