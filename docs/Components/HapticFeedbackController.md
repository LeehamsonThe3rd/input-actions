# HapticFeedbackController

The HapticFeedbackController provides a simple and powerful API for triggering controller vibration (haptic feedback) on supported devices.

## Overview

Haptic feedback enhances gameplay by providing physical feedback through vibration. This controller makes it easy to trigger different vibration patterns for various game events, improving the player experience on gamepad devices.

## Key Concepts

- **Vibration Motors**: Modern controllers have dual vibration motors (large/small)
- **Vibration Presets**: Predefined vibration patterns for common scenarios
- **Custom Vibration**: Fine-grained control over vibration parameters

## Core Functionality

### Using Predefined Vibration Presets

```ts
import { HapticFeedbackController, EVibrationPreset } from "@rbxts/input-actions";

// Trigger preset vibrations for different game events
HapticFeedbackController.VibratePreset(EVibrationPreset.Light); // Subtle feedback
HapticFeedbackController.VibratePreset(EVibrationPreset.Medium); // Moderate feedback
HapticFeedbackController.VibratePreset(EVibrationPreset.Heavy); // Strong feedback

// Feedback for game outcomes
HapticFeedbackController.VibratePreset(EVibrationPreset.Success); // Achievement/success feedback
HapticFeedbackController.VibratePreset(EVibrationPreset.Failure); // Failure/damage feedback
```

### Creating Custom Vibration Patterns

```ts
// Trigger custom vibration with specific parameters
HapticFeedbackController.Vibrate(
	0.8, // Large motor intensity (0-1)
	0.3, // Small motor intensity (0-1)
	0.4, // Duration in seconds
);

// Short, sharp vibration
HapticFeedbackController.Vibrate(1.0, 0.0, 0.1);

// Long, rumbling vibration
HapticFeedbackController.Vibrate(0.7, 0.2, 1.5);
```

### Creating Custom Vibration Presets

```ts
// Register your own named presets
HapticFeedbackController.RegisterPreset(
	"LowHealth", // Preset name
	0.9, // Large motor intensity
	0.6, // Small motor intensity
	0.3, // Duration in seconds
);

// Then use them by name
HapticFeedbackController.VibratePreset("LowHealth");
```

### Stopping Vibration

```ts
// Stop all vibration immediately
HapticFeedbackController.StopAll();
```

## Practical Examples

### Combat Feedback System

```ts
// Set up a comprehensive combat feedback system
function SetupCombatHaptics() {
	// Register custom combat presets
	HapticFeedbackController.RegisterPreset("WeaponFire", 0.4, 0.2, 0.1);
	HapticFeedbackController.RegisterPreset("WeaponReload", 0.3, 0.1, 0.3);
	HapticFeedbackController.RegisterPreset("LightHit", 0.4, 0.2, 0.15);
	HapticFeedbackController.RegisterPreset("HeavyHit", 0.7, 0.4, 0.25);
	HapticFeedbackController.RegisterPreset("PlayerDamaged", 0.7, 0.5, 0.3);
	HapticFeedbackController.RegisterPreset("NearDeath", 0.8, 0.8, 0.5);

	// Usage in combat system
	return {
		onWeaponFired: (weaponType: string) => {
			switch (weaponType) {
				case "Pistol":
					HapticFeedbackController.VibratePreset("WeaponFire");
					break;
				case "Shotgun":
					HapticFeedbackController.Vibrate(0.7, 0.3, 0.2); // Stronger custom vibration
					break;
				case "Sniper":
					HapticFeedbackController.Vibrate(0.9, 0.1, 0.15); // Very strong but brief
					break;
			}
		},

		onWeaponReloaded: () => {
			HapticFeedbackController.VibratePreset("WeaponReload");
		},

		onEnemyHit: (damageAmount: number) => {
			if (damageAmount < 20) {
				HapticFeedbackController.VibratePreset("LightHit");
			} else {
				HapticFeedbackController.VibratePreset("HeavyHit");
			}
		},

		onPlayerDamaged: (healthRemaining: number) => {
			if (healthRemaining < 20) {
				HapticFeedbackController.VibratePreset("NearDeath");
			} else {
				HapticFeedbackController.VibratePreset("PlayerDamaged");
			}
		},
	};
}

// Use in game
const combatHaptics = SetupCombatHaptics();

// In weapon system
function FireWeapon(weaponType: string) {
	// Weapon firing logic...

	// Trigger haptic feedback
	combatHaptics.onWeaponFired(weaponType);
}
```

### Racing Game Feedback

```ts
// Set up haptic feedback for a racing game
function SetupRacingHaptics() {
	// Register racing-specific presets
	HapticFeedbackController.RegisterPreset("EngineIdle", 0.1, 0.05, 0.2);
	HapticFeedbackController.RegisterPreset("OffRoad", 0.4, 0.3, 0.3);
	HapticFeedbackController.RegisterPreset("Collision", 0.9, 0.7, 0.4);
	HapticFeedbackController.RegisterPreset("Drift", 0.5, 0.2, 0.2);

	// Continuous feedback for engine and terrain
	let lastFeedbackTime = 0;

	RunService.Heartbeat.Connect((deltaTime) => {
		const now = os.clock();
		if (now - lastFeedbackTime < 0.2) return; // Limit feedback frequency

		const vehicle = GetPlayerVehicle();
		if (!vehicle) return;

		// Update feedback based on vehicle state
		if (vehicle.IsOffRoad) {
			HapticFeedbackController.VibratePreset("OffRoad");
			lastFeedbackTime = now;
		} else if (vehicle.IsDrifting) {
			HapticFeedbackController.VibratePreset("Drift");
			lastFeedbackTime = now;
		} else if (vehicle.Speed > 5) {
			// Engine vibration scales with speed
			const intensity = math.min(0.1 + (vehicle.Speed / 100) * 0.4, 0.5);
			HapticFeedbackController.Vibrate(intensity, intensity * 0.5, 0.2);
			lastFeedbackTime = now;
		} else if (vehicle.EngineRunning) {
			HapticFeedbackController.VibratePreset("EngineIdle");
			lastFeedbackTime = now;
		}
	});

	// One-time collision feedback
	return {
		onVehicleCollision: (impactForce: number) => {
			const intensity = math.min(impactForce / 100, 1);
			HapticFeedbackController.Vibrate(intensity, intensity * 0.8, 0.3);
		},
	};
}
```

## Default Vibration Presets

The HapticFeedbackController comes with several built-in presets:

| Preset  | Description          | Large Motor | Small Motor | Duration |
| ------- | -------------------- | ----------- | ----------- | -------- |
| Light   | Subtle feedback      | 0.3         | 0.1         | 0.1      |
| Medium  | Moderate feedback    | 0.5         | 0.3         | 0.2      |
| Heavy   | Strong feedback      | 0.8         | 0.5         | 0.3      |
| Success | Achievement feeling  | 0.6         | 0.4         | 0.3      |
| Failure | Error/damage feeling | 0.7         | 0.7         | 0.4      |

## Implementation Details

The HapticFeedbackController:

1. Manages vibration presets in an internal registry
2. Communicates with Roblox's GamepadService to trigger vibration
3. Handles timing for vibration duration and stopping
4. Works only on devices that support vibration (primarily gamepads)

## Usage Recommendations

- Use haptic feedback to reinforce important gameplay events
- Match vibration intensity to the significance of the event
- Keep vibrations brief (typically under 0.5 seconds) to avoid annoyance
- Use the large motor for main impacts and the small motor for subtle details
- Be mindful of overusing vibration, which can reduce its impact
- Consider providing an option for players to adjust or disable vibration
- Test your vibration patterns on actual hardware when possible
