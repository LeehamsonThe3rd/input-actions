import { Players, UserInputService, VRService } from "@rbxts/services";
import { EDeviceType } from "../Models/EDeviceType";
import { EInputType } from "../Models/EInputType";

export namespace DeviceController {
	const TOUCH_GUI_WAIT_TIMEOUT = 20; // seconds
	const INITIAL_WAIT_TIME = 1; // seconds
	const INPUT_POLL_INTERVAL = 0.1; // seconds

	const inputTypeChangedEvent: BindableEvent<(inputType: EInputType) => void> = new Instance(
		"BindableEvent",
	);
	export const OnInputTypeChanged = inputTypeChangedEvent.Event;

	const deviceTypeChangedEvent: BindableEvent<(deviceType: EDeviceType) => void> = new Instance(
		"BindableEvent",
	);
	export const OnDeviceTypeChanged = deviceTypeChangedEvent.Event;

	//TODO switch to the latest input type?
	export function GetMainInputType() {
		//touch is prioritased
		if (UserInputService.TouchEnabled) return EInputType.Touch;
		//gamepad is 2nd
		else if (UserInputService.GamepadEnabled) return EInputType.Gamepad;
		//keyboard and mouse are 3ed
		return EInputType.KeyboardAndMouse;
	}

	export function GetMainDeviceType() {
		//vr is prioritased
		if (vrEnabled) return EDeviceType.Vr;
		//phone and tables are 2nd
		else if (touchEnabled) {
			//checks whether the jump button has the tablet size(120x120);
			//phone has button size(70x70);
			return jumpButtonHasTabletSize ? EDeviceType.Tablet : EDeviceType.Phone;
		}
		//console is 3rd
		else if (gamepadEnabled) return EDeviceType.Console;
		//pc is 4th
		return EDeviceType.Pc;
	}

	/**fires the new input type */
	function FireOnInputChangedEvent() {
		//gets new values
		AsignValues();
		inputTypeChangedEvent.Fire(GetMainInputType());
		deviceTypeChangedEvent.Fire(GetMainDeviceType());
	}

	function ExecuteOnChanged(newValue: boolean, previousValue: boolean, callback: () => void) {
		//calls the function if different
		if (newValue === previousValue) return;
		callback();
		//tells that value changed, so it will tell only once
		return true;
	}

	//will try to get the jump button
	let jumpButton: ImageButton | undefined;

	let mouseEnabled = false;
	let keyboardEnabled = false;
	let gamepadEnabled = false;
	let touchEnabled = false;

	let vrEnabled = false;
	/** https://devforum.roblox.com/t/how-can-i-tell-the-difference-between-a-mobile-and-tablet-player/1455628/8
	 *  will be true if the jump button is 120 x 120
	 */
	let jumpButtonHasTabletSize = false;

	async function TryGetJumpButtonSize() {
		const localPlayer = Players.LocalPlayer;
		const playerGui = localPlayer.WaitForChild("PlayerGui");
		//waits for touch gui for 20 seconds
		//gui exist even if the character didnt spawn
		const touchGui = playerGui.WaitForChild("TouchGui", TOUCH_GUI_WAIT_TIMEOUT);
		if (touchGui === undefined) return;
		const touchControlFrame = touchGui.WaitForChild("TouchControlFrame");
		//jump button will always exist;
		jumpButton = <ImageButton>touchControlFrame.WaitForChild("JumpButton");
	}

	/**will return true if the jump button is 120x120;*/
	function CheckJumpButtonHasTabletSize() {
		if (jumpButton === undefined) return false;
		return jumpButton.Size === UDim2.fromOffset(120, 120);
	}

	//compares the old to the new ones
	function CheckValues() {
		//if gets true means input type changed, will stop the function to execute only once
		if (
			ExecuteOnChanged(
				jumpButtonHasTabletSize,
				CheckJumpButtonHasTabletSize(),
				FireOnInputChangedEvent,
			)
		)
			return;
		if (ExecuteOnChanged(vrEnabled, VRService.VREnabled, FireOnInputChangedEvent)) return;

		if (ExecuteOnChanged(mouseEnabled, UserInputService.MouseEnabled, FireOnInputChangedEvent))
			return;
		if (
			ExecuteOnChanged(keyboardEnabled, UserInputService.KeyboardEnabled, FireOnInputChangedEvent)
		)
			return;
		if (ExecuteOnChanged(gamepadEnabled, UserInputService.GamepadEnabled, FireOnInputChangedEvent))
			return;
		if (ExecuteOnChanged(touchEnabled, UserInputService.TouchEnabled, FireOnInputChangedEvent))
			return;
	}

	function AsignValues() {
		jumpButtonHasTabletSize = CheckJumpButtonHasTabletSize();
		vrEnabled = VRService.VREnabled;

		mouseEnabled = UserInputService.MouseEnabled;
		keyboardEnabled = UserInputService.KeyboardEnabled;
		gamepadEnabled = UserInputService.GamepadEnabled;
		touchEnabled = UserInputService.TouchEnabled;
	}

	let initialized = false;
	export async function Initialize() {
		if (initialized) return;
		initialized = true;
		//to set the value
		task.wait(INITIAL_WAIT_TIME);
		TryGetJumpButtonSize();
		//makes in the slow loop
		while (task.wait(INPUT_POLL_INTERVAL)) {
			CheckValues();
			AsignValues();
		}
	}
}
