import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from './common';
import { useTheme } from '@/theme';
import type { ThemeMode } from '@/theme';

type ThemeModeOption = {
  mode: ThemeMode;
  label: string;
  description: string;
  icon: IconName;
};

const THEME_MODE_OPTIONS: ThemeModeOption[] = [
  {
    mode: 'light',
    label: 'Light mode',
    description: 'Always use light theme',
    icon: 'sunny-outline',
  },
  {
    mode: 'dark',
    label: 'Dark mode',
    description: 'Always use dark theme',
    icon: 'moon-outline',
  },
  {
    mode: 'system',
    label: 'System theme',
    description: 'Match your device settings',
    icon: 'phone-portrait-outline',
  },
];

export type ThemeModeSelectorProps = {
  value: ThemeMode;
  onChange: (mode: ThemeMode) => void;
};

export function ThemeModeSelector({ value, onChange }: ThemeModeSelectorProps) {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          minHeight: 52,
          gap: theme.spacing.md,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: theme.colors.divider,
        },
        rowLast: {
          borderBottomWidth: 0,
        },
        rowPressed: {
          backgroundColor: theme.colors.surfaceVariant,
        },
        iconContainer: {
          width: 32,
          height: 32,
          borderRadius: theme.borderRadius.sm,
          backgroundColor: theme.colors.primaryMuted,
          alignItems: 'center',
          justifyContent: 'center',
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
        selectedLabel: {
          color: theme.colors.primary,
        },
      }),
    [theme],
  );

  return (
    <View accessibilityRole="radiogroup">
      {THEME_MODE_OPTIONS.map((option, index) => {
        const selected = value === option.mode;
        const isLast = index === THEME_MODE_OPTIONS.length - 1;

        return (
          <Pressable
            key={option.mode}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
            onPress={() => onChange(option.mode)}
            style={({ pressed }) => [
              styles.row,
              isLast && styles.rowLast,
              pressed && styles.rowPressed,
            ]}
          >
            <View style={styles.iconContainer}>
              <Icon name={option.icon} size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.label, selected && styles.selectedLabel]}>
                {option.label}
              </Text>
              <Text style={styles.description}>{option.description}</Text>
            </View>
            {selected ? (
              <Icon
                name="checkmark-circle"
                size={22}
                color={theme.colors.primary}
              />
            ) : (
              <Icon
                name="ellipse-outline"
                size={22}
                color={theme.colors.iconSecondary}
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
