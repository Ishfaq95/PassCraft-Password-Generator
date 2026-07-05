import { useMemo } from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { type AccessibilityProps } from './common';
import { useTheme } from '@/theme';

export type ToggleProps = AccessibilityProps & {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Toggle({
  value,
  onValueChange,
  label,
  description,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
}: ToggleProps) {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing.md,
          minHeight: 44,
        },
        textContainer: {
          flex: 1,
          gap: theme.spacing['2xs'],
        },
        label: {
          ...theme.typography.bodyMedium,
          color: disabled ? theme.colors.textDisabled : theme.colors.text,
        },
        description: {
          ...theme.typography.bodySmall,
          color: theme.colors.textSecondary,
        },
      }),
    [theme, disabled],
  );

  const switchElement = (
    <Switch
      testID={testID}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel ?? label ?? 'Toggle'}
      accessibilityHint={accessibilityHint}
      accessibilityRole="switch"
      trackColor={{
        false: theme.colors.surfaceVariant,
        true: theme.colors.primaryMuted,
      }}
      thumbColor={value ? theme.colors.primary : theme.colors.surface}
      ios_backgroundColor={theme.colors.surfaceVariant}
    />
  );

  if (!label && !description) {
    return <View style={style}>{switchElement}</View>;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.textContainer}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
      </View>
      {switchElement}
    </View>
  );
}
