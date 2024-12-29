# InputKeyCode

Main type used to indicate the KeyCode
in some cases the KeyCode is Unknown therefore UserInputType is used instead

and the package contains <b>Custom Keys</b>

```ts
//already included
type InputKeyCode = Enum.KeyCode | Enum.UserInputType | ECustomKey;
```

## Custom Keys

the package contains Custom Keys like `ECustomKey.Thumbstick1Up`, `ECustomKey.MouseWheelUp` or `ECustomKey.MouseLeft`

Some of them have to be treated differently from everything else e.g `ECustomKey.MouseLeft`

Here the full list:

```ts
const enum ECustomKey {
	Thumbstick1Up = "Thumbstick1Up",
	Thumbstick2Up = "Thumbstick2Up",

	Thumbstick1Down = "Thumbstick1Down",
	Thumbstick2Down = "Thumbstick2Down",

	Thumbstick1Left = "Thumbstick1Left",
	Thumbstick2Left = "Thumbstick2Left",

	Thumbstick1Right = "Thumbstick1Right",
	Thumbstick2Right = "Thumbstick2Right",

	MouseWheelUp = "MouseWheelUp",
	MouseWheelDown = "MouseWheelDown",

	MouseLeft = "MouseLeft",
	MouseRight = "MouseRight",
	MouseDown = "MouseDown",
	MouseUp = "MouseUp",
}
```
