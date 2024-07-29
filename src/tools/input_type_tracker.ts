import { Players, UserInputService, VRService } from "@rbxts/services";

export namespace InputTypeTracker {
	export const enum EInputType {
		gamepad = "gamepad",
		touch = "touch",
		keyboard_and_mouse = "keyboard_and_mouse",
	}

	export const enum EDeviceType {
		phone = "phone",
		tablet = "tablet",
		console = "xbox",
		vr = "vr",
		pc = "pc",
	}

	//TODO switch to the latest input type
	export function GetMainInputType() {
		//touch is prioritased
		if (UserInputService.TouchEnabled) return EInputType.touch;
		//gamepad is 2nd
		else if (UserInputService.GamepadEnabled) return EInputType.gamepad;
		//keyboard and mouse are 3ed
		return EInputType.keyboard_and_mouse;
	}

	export function GetMainDeviceType() {
		//vr is prioritased
		if (vr_enabled) return EDeviceType.vr;
		//phone and tables are 2nd
		else if (touch_enabled) {
			//checks whether the jump button has the tablet size(120x120);
			//phone has button size(70x70);
			return jump_button_has_tablet_size
				? EDeviceType.tablet
				: EDeviceType.phone;
		}
		//console is 3rd
		else if (gamepad_enabled) return EDeviceType.console;
		//pc is 4th
		return EDeviceType.pc;
	}

	const input_type_changed_event: BindableEvent<
		(input_type: EInputType) => void
	> = new Instance("BindableEvent");
	export const on_input_type_changed = input_type_changed_event.Event;

	const device_type_changed_event: BindableEvent<
		(device_type: EDeviceType) => void
	> = new Instance("BindableEvent");
	export const on_device_type_changed = device_type_changed_event.Event;

	/**fires the new input type */
	function FireOnInputChangedEvent() {
		//gets new values
		AsignValues();
		input_type_changed_event.Fire(GetMainInputType());
		device_type_changed_event.Fire(GetMainDeviceType());
	}

	function ExecuteOnChanged(
		new_value: boolean,
		previos_value: boolean,
		callback: () => void,
	) {
		//calls the function if different
		if (new_value === previos_value) return;
		callback();
		//tells that value changed, so it will tell only once
		return true;
	}

	//will try to get the jump button
	let jump_button: ImageButton | undefined;

	let mouse_enabled = false;
	let keyboard_enabled = false;
	let gamepad_enabled = false;
	let touch_enabled = false;

	let vr_enabled = false;
	/** https://devforum.roblox.com/t/how-can-i-tell-the-difference-between-a-mobile-and-tablet-player/1455628/8
	 *  will be true if the jump button is 120 x 120
	 */
	let jump_button_has_tablet_size = false;

	async function TryGetJumpButtonSize() {
		const local_player = Players.LocalPlayer;
		const player_gui = local_player.WaitForChild("PlayerGui");
		//waits for touch gui for 20 seconds
		//gui exist even if the character didnt spawn
		const touch_gui = player_gui.WaitForChild("TouchGui", 20);
		if (touch_gui === undefined) return;
		const touch_control_frame = touch_gui.WaitForChild("TouchControlFrame");
		//jump button will always exist;
		jump_button = <ImageButton>touch_control_frame.WaitForChild("JumpButton");
	}

	/**will return true if the jump button is 120x120;*/
	function CheckJumpButtonHasTabletSize() {
		if (jump_button === undefined) return false;
		return jump_button.Size === UDim2.fromOffset(120, 120);
	}

	//compares the old to the new ones
	function CheckValues() {
		//if gets true means input type changed, will stop the function to execute only once
		if (
			ExecuteOnChanged(
				jump_button_has_tablet_size,
				CheckJumpButtonHasTabletSize(),
				FireOnInputChangedEvent,
			)
		)
			return;
		if (
			ExecuteOnChanged(vr_enabled, VRService.VREnabled, FireOnInputChangedEvent)
		)
			return;

		if (
			ExecuteOnChanged(
				mouse_enabled,
				UserInputService.MouseEnabled,
				FireOnInputChangedEvent,
			)
		)
			return;
		if (
			ExecuteOnChanged(
				keyboard_enabled,
				UserInputService.KeyboardEnabled,
				FireOnInputChangedEvent,
			)
		)
			return;
		if (
			ExecuteOnChanged(
				gamepad_enabled,
				UserInputService.GamepadEnabled,
				FireOnInputChangedEvent,
			)
		)
			return;
		if (
			ExecuteOnChanged(
				touch_enabled,
				UserInputService.TouchEnabled,
				FireOnInputChangedEvent,
			)
		)
			return;
	}

	function AsignValues() {
		jump_button_has_tablet_size = CheckJumpButtonHasTabletSize();
		vr_enabled = VRService.VREnabled;

		mouse_enabled = UserInputService.MouseEnabled;
		keyboard_enabled = UserInputService.KeyboardEnabled;
		gamepad_enabled = UserInputService.GamepadEnabled;
		touch_enabled = UserInputService.TouchEnabled;
	}

	let initialized = false;
	export async function Initialize() {
		if (initialized) return;
		initialized = true;
		//to set the value
		task.wait(2);
		TryGetJumpButtonSize();
		//makes in the slow loop
		while (task.wait(0.1)) {
			CheckValues();
			AsignValues();
		}
	}
}
