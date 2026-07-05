import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const HAPTIC_OPTIONS = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
} as const;

export function triggerCopyHaptic(): void {
  ReactNativeHapticFeedback.trigger('notificationSuccess', HAPTIC_OPTIONS);
}

export function triggerImpactHaptic(): void {
  ReactNativeHapticFeedback.trigger('impactLight', HAPTIC_OPTIONS);
}
