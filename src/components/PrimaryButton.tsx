import { useMemo } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { AnimatedPressable } from './AnimatedPressable';
import {
  MIN_TOUCH_TARGET,
  type AccessibilityProps,
  type ComponentSize,
} from './common';
import { useTheme } from '@/theme';

export type PrimaryButtonProps = AccessibilityProps & {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  size?: ComponentSize;
  style?: StyleProp<ViewStyle>;
};

const SIZE_HEIGHT: Record<ComponentSize, number> = {
  sm: 40,
  md: MIN_TOUCH_TARGET,
  lg: 52,
};

export function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  fullWidth = false,
  size = 'md',
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
}: PrimaryButtonProps) {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        button: {
          minHeight: SIZE_HEIGHT[size],
          minWidth: MIN_TOUCH_TARGET,
          paddingHorizontal: theme.spacing.xl,
          borderRadius: theme.borderRadius.md,
          backgroundColor: isDisabled
            ? theme.colors.textDisabled
            : theme.colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          ...theme.elevation.sm,
        },
        label: {
          ...theme.typography.labelLarge,
          color: theme.colors.onPrimary,
        },
      }),
    [theme, isDisabled, size, fullWidth],
  );

  return (
    <AnimatedPressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      scaleTo={0.97}
      style={[styles.button, style]}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.onPrimary} size="small" />
      ) : (
        <Text style={styles.label}>{title}</Text>
      )}
    </AnimatedPressable>
  );
}
