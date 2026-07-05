import { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Icon, type AccessibilityProps } from './common';
import { useTheme } from '@/theme';

export type CheckboxProps = AccessibilityProps & {
  checked: boolean;
  onValueChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Checkbox({
  checked,
  onValueChange,
  label,
  description,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
}: CheckboxProps) {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: theme.spacing.md,
          minHeight: 44,
          opacity: disabled ? 0.5 : 1,
        },
        box: {
          width: 22,
          height: 22,
          borderRadius: theme.borderRadius.xs,
          borderWidth: 2,
          borderColor: checked
            ? theme.colors.primary
            : theme.colors.borderStrong,
          backgroundColor: checked
            ? theme.colors.primary
            : theme.colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 1,
        },
        textContainer: {
          flex: 1,
          gap: theme.spacing['2xs'],
        },
        label: {
          ...theme.typography.bodyMedium,
          color: theme.colors.text,
        },
        description: {
          ...theme.typography.bodySmall,
          color: theme.colors.textSecondary,
        },
      }),
    [theme, checked, disabled],
  );

  return (
    <Pressable
      testID={testID}
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel ?? label ?? 'Checkbox'}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!checked)}
      style={[styles.container, style]}
    >
      <View style={styles.box}>
        {checked ? (
          <Icon name="checkmark" size={14} color={theme.colors.onPrimary} />
        ) : null}
      </View>
      {(label || description) && (
        <View style={styles.textContainer}>
          {label ? <Text style={styles.label}>{label}</Text> : null}
          {description ? (
            <Text style={styles.description}>{description}</Text>
          ) : null}
        </View>
      )}
    </Pressable>
  );
}
