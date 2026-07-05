import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Icon } from './common';
import { useTheme } from '@/theme';
import {
  analyzePasswordStrength,
  type PasswordStrengthAnalysis,
} from '@/services/password';
import type { ThemeColors } from '@/theme';

import { StrengthMeter, type StrengthMeterProps } from './StrengthMeter';

export type PasswordStrengthMeterProps = Omit<
  StrengthMeterProps,
  'strength'
> & {
  password: string;
  analysis?: PasswordStrengthAnalysis;
  showSuggestions?: boolean;
  maxSuggestions?: number;
};

function getStrengthColor(level: number, colors: ThemeColors): string {
  switch (level) {
    case 0:
    case 1:
      return colors.error;
    case 2:
      return colors.warning;
    case 3:
      return colors.success;
    case 4:
    default:
      return colors.primary;
  }
}

export function PasswordStrengthMeter({
  password,
  analysis,
  showSuggestions = true,
  maxSuggestions = 4,
  showLabel = true,
  accessibilityLabel,
  testID,
  style,
  ...meterProps
}: PasswordStrengthMeterProps) {
  const { theme } = useTheme();

  const result = useMemo(
    () => analysis ?? analyzePasswordStrength(password),
    [analysis, password],
  );

  const suggestions = result.suggestions.slice(0, maxSuggestions);
  const activeColor = getStrengthColor(result.level, theme.colors);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          gap: theme.spacing.sm,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        label: {
          ...theme.typography.labelMedium,
          color: activeColor,
        },
        entropy: {
          ...theme.typography.labelSmall,
          color: theme.colors.textTertiary,
        },
        suggestions: {
          gap: theme.spacing.xs,
          paddingTop: theme.spacing.xs,
        },
        suggestionRow: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: theme.spacing.sm,
        },
        suggestionText: {
          ...theme.typography.bodySmall,
          color: theme.colors.textSecondary,
          flex: 1,
        },
      }),
    [theme, activeColor],
  );

  return (
    <View
      testID={testID}
      accessibilityLabel={
        accessibilityLabel ?? `Password strength: ${result.label}`
      }
      style={[styles.container, style]}
    >
      <View style={styles.header}>
        {showLabel ? <Text style={styles.label}>{result.label}</Text> : null}
        {result.entropy > 0 ? (
          <Text style={styles.entropy}>{Math.round(result.entropy)} bits</Text>
        ) : null}
      </View>

      <StrengthMeter
        {...meterProps}
        strength={result.level}
        showLabel={false}
      />

      {showSuggestions && suggestions.length > 0 ? (
        <View style={styles.suggestions} accessibilityRole="text">
          {suggestions.map(suggestion => (
            <View key={suggestion} style={styles.suggestionRow}>
              <Icon
                name="bulb-outline"
                size={14}
                color={theme.colors.warning}
              />
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
