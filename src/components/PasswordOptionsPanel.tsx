import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SectionHeader } from './SectionHeader';
import { SettingsGroup } from './SettingsGroup';
import { SettingsRow } from './SettingsRow';
import { Slider } from './Slider';
import {
  PASSWORD_LENGTH_MAX,
  PASSWORD_LENGTH_MIN,
  type PasswordGeneratorOptions,
} from '@/services/password';
import { useTheme } from '@/theme';

export type PasswordOptionsPanelProps = {
  options: PasswordGeneratorOptions;
  onOptionsChange: (patch: Partial<PasswordGeneratorOptions>) => void;
  error?: string | null;
};

type CharsetKey = 'uppercase' | 'lowercase' | 'numbers' | 'symbols';

const CHARSET_TOGGLES: Array<{ key: CharsetKey; label: string }> = [
  { key: 'uppercase', label: 'Uppercase (A–Z)' },
  { key: 'lowercase', label: 'Lowercase (a–z)' },
  { key: 'numbers', label: 'Numbers (0–9)' },
  { key: 'symbols', label: 'Symbols (!@#…)' },
];

function countEnabledCharsets(options: PasswordGeneratorOptions): number {
  return (
    Number(options.uppercase) +
    Number(options.lowercase) +
    Number(options.numbers) +
    Number(options.symbols)
  );
}

function canToggleCharset(
  key: CharsetKey,
  options: PasswordGeneratorOptions,
  nextValue: boolean,
): boolean {
  if (nextValue) {
    return true;
  }

  return countEnabledCharsets(options) > 1 || !options[key];
}

export function PasswordOptionsPanel({
  options,
  onOptionsChange,
  error,
}: PasswordOptionsPanelProps) {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          gap: theme.spacing.xs,
        },
        lengthCard: {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.lg,
          gap: theme.spacing.md,
          ...theme.elevation.xs,
        },
        lengthHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        lengthLabel: {
          ...theme.typography.bodyMedium,
          color: theme.colors.text,
        },
        lengthValue: {
          ...theme.typography.titleMedium,
          color: theme.colors.primary,
        },
        error: {
          ...theme.typography.bodySmall,
          color: theme.colors.error,
          paddingHorizontal: theme.spacing.lg,
        },
      }),
    [theme],
  );

  const handleCharsetToggle = (key: CharsetKey, value: boolean) => {
    if (!canToggleCharset(key, options, value)) {
      return;
    }

    onOptionsChange({ [key]: value });
  };

  return (
    <View style={styles.container}>
      <SectionHeader title="Options" />
      <View style={styles.lengthCard}>
        <View style={styles.lengthHeader}>
          <Text style={styles.lengthLabel}>Password length</Text>
          <Text style={styles.lengthValue}>{options.length}</Text>
        </View>
        <Slider
          value={options.length}
          onValueChange={length => onOptionsChange({ length })}
          minimumValue={PASSWORD_LENGTH_MIN}
          maximumValue={PASSWORD_LENGTH_MAX}
          step={1}
          accessibilityLabel="Password length"
        />
      </View>

      <SettingsGroup title="Character types">
        {CHARSET_TOGGLES.map(({ key, label }, index) => (
          <SettingsRow
            key={key}
            label={label}
            rightElement="toggle"
            toggleValue={options[key]}
            onToggleChange={value => handleCharsetToggle(key, value)}
            disabled={!canToggleCharset(key, options, false) && options[key]}
            showDivider={index < CHARSET_TOGGLES.length - 1}
          />
        ))}
      </SettingsGroup>

      <SettingsGroup title="Advanced">
        <SettingsRow
          label="Exclude ambiguous characters"
          description="Avoid 0, O, 1, l, I, and |"
          rightElement="toggle"
          toggleValue={options.avoidAmbiguous}
          onToggleChange={avoidAmbiguous => onOptionsChange({ avoidAmbiguous })}
          showDivider={false}
        />
      </SettingsGroup>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}
