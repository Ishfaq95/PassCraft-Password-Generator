import { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Icon,
  MIN_TOUCH_TARGET,
  type AccessibilityProps,
  type IconName,
} from './common';
import { useTheme } from '@/theme';

export type FloatingActionButtonProps = AccessibilityProps & {
  icon: IconName;
  onPress: () => void;
  disabled?: boolean;
  extended?: boolean;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export function FloatingActionButton({
  icon,
  onPress,
  disabled = false,
  extended = false,
  label,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
}: FloatingActionButtonProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        fab: {
          position: 'absolute',
          right: theme.spacing.lg,
          bottom: insets.bottom + theme.spacing.lg,
          minWidth: MIN_TOUCH_TARGET,
          minHeight: MIN_TOUCH_TARGET,
          borderRadius: extended
            ? theme.borderRadius.xl
            : theme.borderRadius.full,
          backgroundColor: disabled
            ? theme.colors.textDisabled
            : theme.colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          paddingHorizontal: extended ? theme.spacing.lg : 0,
          gap: theme.spacing.sm,
          ...theme.elevation.lg,
        },
        pressed: {
          backgroundColor: theme.colors.primaryHover,
        },
        label: {
          ...theme.typography.labelLarge,
          color: theme.colors.onPrimary,
        },
      }),
    [theme, insets.bottom, extended, disabled],
  );

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label ?? 'Action button'}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.fab,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Icon name={icon} size={24} color={theme.colors.onPrimary} />
      {extended && label ? <Text style={styles.label}>{label}</Text> : null}
    </Pressable>
  );
}
