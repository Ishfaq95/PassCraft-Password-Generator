import { useMemo } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { AnimatedPressable } from './AnimatedPressable';
import {
  Icon,
  MIN_TOUCH_TARGET,
  type AccessibilityProps,
  type ComponentSize,
  type IconName,
} from './common';
import { useTheme } from '@/theme';

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost';

export type IconButtonProps = AccessibilityProps & {
  icon: IconName;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: ComponentSize;
  variant?: IconButtonVariant;
  style?: StyleProp<ViewStyle>;
};

const SIZE_MAP: Record<ComponentSize, number> = {
  sm: 36,
  md: MIN_TOUCH_TARGET,
  lg: 52,
};

const ICON_SIZE: Record<ComponentSize, number> = {
  sm: 18,
  md: 22,
  lg: 26,
};

export function IconButton({
  icon,
  onPress,
  disabled = false,
  loading = false,
  size = 'md',
  variant = 'ghost',
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
}: IconButtonProps) {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;
  const dimension = SIZE_MAP[size];

  const variantStyles = useMemo(() => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: isDisabled
            ? theme.colors.textDisabled
            : theme.colors.primary,
          iconColor: theme.colors.onPrimary,
          pressedBg: theme.colors.primaryHover,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondaryMuted,
          iconColor: isDisabled
            ? theme.colors.iconDisabled
            : theme.colors.secondary,
          pressedBg: theme.colors.surfaceVariant,
        };
      case 'ghost':
      default:
        return {
          backgroundColor: 'transparent',
          iconColor: isDisabled ? theme.colors.iconDisabled : theme.colors.icon,
          pressedBg: theme.colors.surfaceVariant,
        };
    }
  }, [variant, theme, isDisabled]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        button: {
          width: dimension,
          height: dimension,
          borderRadius: theme.borderRadius.full,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: variantStyles.backgroundColor,
        },
      }),
    [theme, dimension, variantStyles],
  );

  return (
    <AnimatedPressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? icon}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      hitSlop={8}
      scaleTo={0.9}
      style={[styles.button, style]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.iconColor} size="small" />
      ) : (
        <Icon
          name={icon}
          size={ICON_SIZE[size]}
          color={variantStyles.iconColor}
        />
      )}
    </AnimatedPressable>
  );
}
