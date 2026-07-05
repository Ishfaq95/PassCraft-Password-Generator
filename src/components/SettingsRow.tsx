import { useMemo, type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Icon, type AccessibilityProps, type IconName } from './common';
import { Toggle } from './Toggle';
import { useTheme } from '@/theme';

export type SettingsRowRightElement =
  | 'chevron'
  | 'toggle'
  | 'value'
  | 'none'
  | 'custom';

export type SettingsRowProps = AccessibilityProps & {
  label: string;
  description?: string;
  icon?: IconName;
  value?: string;
  onPress?: () => void;
  rightElement?: SettingsRowRightElement;
  customRight?: ReactNode;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
  destructive?: boolean;
  disabled?: boolean;
  showDivider?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function SettingsRow({
  label,
  description,
  icon,
  value,
  onPress,
  rightElement = 'chevron',
  customRight,
  toggleValue = false,
  onToggleChange,
  destructive = false,
  disabled = false,
  showDivider = true,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
}: SettingsRowProps) {
  const { theme } = useTheme();
  const isInteractive =
    Boolean(onPress) && !disabled && rightElement !== 'toggle';

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          minHeight: 52,
          gap: theme.spacing.md,
          backgroundColor: theme.colors.surface,
          borderBottomWidth: showDivider ? StyleSheet.hairlineWidth : 0,
          borderBottomColor: theme.colors.divider,
          opacity: disabled ? 0.5 : 1,
        },
        pressed: {
          backgroundColor: theme.colors.surfaceVariant,
        },
        iconContainer: {
          width: 32,
          height: 32,
          borderRadius: theme.borderRadius.sm,
          backgroundColor: destructive
            ? theme.colors.errorMuted
            : theme.colors.primaryMuted,
          alignItems: 'center',
          justifyContent: 'center',
        },
        textContainer: {
          flex: 1,
          gap: theme.spacing['2xs'],
        },
        label: {
          ...theme.typography.bodyMedium,
          color: destructive ? theme.colors.error : theme.colors.text,
        },
        description: {
          ...theme.typography.bodySmall,
          color: theme.colors.textSecondary,
        },
        value: {
          ...theme.typography.bodySmall,
          color: theme.colors.textTertiary,
        },
        right: {
          alignItems: 'center',
          justifyContent: 'center',
        },
      }),
    [theme, destructive, disabled, showDivider],
  );

  const renderRight = () => {
    if (customRight) {
      return customRight;
    }

    switch (rightElement) {
      case 'toggle':
        return (
          <Toggle
            value={toggleValue}
            onValueChange={onToggleChange ?? (() => undefined)}
            disabled={disabled}
            accessibilityLabel={`${label} toggle`}
          />
        );
      case 'value':
        return value ? <Text style={styles.value}>{value}</Text> : null;
      case 'none':
        return null;
      case 'chevron':
      default:
        return isInteractive ? (
          <Icon
            name="chevron-forward"
            size={18}
            color={theme.colors.iconSecondary}
          />
        ) : null;
    }
  };

  const content = (
    <>
      {icon ? (
        <View style={styles.iconContainer}>
          <Icon
            name={icon}
            size={18}
            color={destructive ? theme.colors.error : theme.colors.primary}
          />
        </View>
      ) : null}

      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>

      <View style={styles.right}>{renderRight()}</View>
    </>
  );

  if (isInteractive) {
    return (
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.container,
          pressed && styles.pressed,
          style,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      testID={testID}
      accessibilityLabel={accessibilityLabel ?? label}
      style={[styles.container, style]}
    >
      {content}
    </View>
  );
}
