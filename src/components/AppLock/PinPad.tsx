import { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { Icon } from '@/components/common';
import { useTheme } from '@/theme';

export type PinPadProps = {
  onDigitPress: (digit: string) => void;
  onDeletePress: () => void;
  disabled?: boolean;
};

const DIGIT_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'delete'],
] as const;

const MAX_KEY_SIZE = 72;
const MIN_KEY_SIZE = 56;

export function PinPad({
  onDigitPress,
  onDeletePress,
  disabled = false,
}: PinPadProps) {
  const { theme } = useTheme();
  const { width: windowWidth } = useWindowDimensions();

  const keySize = useMemo(() => {
    const horizontalPadding = theme.spacing.lg * 2;
    const rowGap = theme.spacing.md * 2;
    const availableWidth = windowWidth - horizontalPadding - rowGap;
    const computed = Math.floor(availableWidth / 3);

    return Math.max(MIN_KEY_SIZE, Math.min(MAX_KEY_SIZE, computed));
  }, [theme.spacing.lg, theme.spacing.md, windowWidth]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          gap: theme.spacing.sm,
        },
        row: {
          flexDirection: 'row',
          justifyContent: 'center',
          gap: theme.spacing.md,
        },
        key: {
          width: keySize,
          height: keySize,
          borderRadius: theme.borderRadius.full,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        keyPressed: {
          backgroundColor: theme.colors.surfaceVariant,
        },
        keyDisabled: {
          opacity: 0.5,
        },
        keyLabel: {
          ...theme.typography.headlineMedium,
          color: theme.colors.text,
        },
        spacer: {
          width: keySize,
          height: keySize,
        },
      }),
    [keySize, theme],
  );

  return (
    <View style={styles.container} accessibilityRole="keyboardkey">
      {DIGIT_ROWS.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map(key => {
            if (key === '') {
              return <View key="spacer" style={styles.spacer} />;
            }

            if (key === 'delete') {
              return (
                <Pressable
                  key="delete"
                  accessibilityRole="button"
                  accessibilityLabel="Delete digit"
                  disabled={disabled}
                  onPress={onDeletePress}
                  style={({ pressed }) => [
                    styles.key,
                    disabled && styles.keyDisabled,
                    pressed && !disabled && styles.keyPressed,
                  ]}
                >
                  <Icon
                    name="backspace-outline"
                    size={22}
                    color={theme.colors.text}
                  />
                </Pressable>
              );
            }

            return (
              <Pressable
                key={key}
                accessibilityRole="button"
                accessibilityLabel={`Digit ${key}`}
                disabled={disabled}
                onPress={() => onDigitPress(key)}
                style={({ pressed }) => [
                  styles.key,
                  disabled && styles.keyDisabled,
                  pressed && !disabled && styles.keyPressed,
                ]}
              >
                <Text style={styles.keyLabel}>{key}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
