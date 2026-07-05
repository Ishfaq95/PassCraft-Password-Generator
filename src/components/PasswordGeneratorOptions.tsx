import { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { SectionHeader } from './SectionHeader';
import { Slider } from './Slider';
import { Toggle } from './Toggle';
import {
  PASSWORD_LENGTH_MAX,
  PASSWORD_LENGTH_MIN,
  type PasswordGeneratorOptions,
} from '@/services/password';
import { useTheme } from '@/theme';

export type PasswordGeneratorOptionsProps = {
  options: PasswordGeneratorOptions;
  onOptionsChange: (patch: Partial<PasswordGeneratorOptions>) => void;
  style?: StyleProp<ViewStyle>;
};

export function PasswordGeneratorOptionsPanel({
  options,
  onOptionsChange,
  style,
}: PasswordGeneratorOptionsProps) {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          gap: theme.spacing.xs,
        },
        card: {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.lg,
          gap: theme.spacing.lg,
          ...theme.elevation.xs,
        },
        lengthHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        lengthLabel: {
          ...theme.typography.titleMedium,
          color: theme.colors.text,
        },
        lengthValue: {
          ...theme.typography.titleMedium,
          color: theme.colors.primary,
        },
        toggles: {
          gap: theme.spacing.sm,
        },
        divider: {
          height: StyleSheet.hairlineWidth,
          backgroundColor: theme.colors.divider,
        },
      }),
    [theme],
  );

  return (
    <View style={[styles.container, style]}>
      <SectionHeader title="Options" />
      <View style={styles.card}>
        <View>
          <View style={styles.lengthHeader}>
            <Text style={styles.lengthLabel}>Length</Text>
            <Text style={styles.lengthValue}>{options.length}</Text>
          </View>
          <Slider
            value={options.length}
            minimumValue={PASSWORD_LENGTH_MIN}
            maximumValue={PASSWORD_LENGTH_MAX}
            step={1}
            onValueChange={length => onOptionsChange({ length })}
            accessibilityLabel="Password length"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.toggles}>
          <Toggle
            label="Uppercase"
            description="A–Z"
            value={options.uppercase}
            onValueChange={uppercase => onOptionsChange({ uppercase })}
          />
          <Toggle
            label="Lowercase"
            description="a–z"
            value={options.lowercase}
            onValueChange={lowercase => onOptionsChange({ lowercase })}
          />
          <Toggle
            label="Numbers"
            description="0–9"
            value={options.numbers}
            onValueChange={numbers => onOptionsChange({ numbers })}
          />
          <Toggle
            label="Symbols"
            description="!@#$%…"
            value={options.symbols}
            onValueChange={symbols => onOptionsChange({ symbols })}
          />
          <Toggle
            label="Exclude ambiguous"
            description="Avoid 0, O, 1, l, I, |"
            value={options.avoidAmbiguous}
            onValueChange={avoidAmbiguous =>
              onOptionsChange({ avoidAmbiguous })
            }
          />
        </View>
      </View>
    </View>
  );
}
