import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PIN_MAX_LENGTH } from '@/services/appLock';
import { useTheme } from '@/theme';

import { PinPad } from './PinPad';

export type PinEntryProps = {
  title: string;
  subtitle?: string;
  error?: string;
  maxLength?: number;
  onComplete: (pin: string) => void;
  onChange?: (pin: string) => void;
  disabled?: boolean;
};

export function PinEntry({
  title,
  subtitle,
  error,
  maxLength = PIN_MAX_LENGTH,
  onComplete,
  onChange,
  disabled = false,
}: PinEntryProps) {
  const { theme } = useTheme();
  const [pin, setPin] = useState('');

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          alignItems: 'center',
          gap: theme.spacing.lg,
        },
        textBlock: {
          alignItems: 'center',
          gap: theme.spacing.xs,
          paddingHorizontal: theme.spacing.lg,
        },
        title: {
          ...theme.typography.headlineSmall,
          color: theme.colors.text,
          textAlign: 'center',
        },
        subtitle: {
          ...theme.typography.bodyMedium,
          color: theme.colors.textSecondary,
          textAlign: 'center',
        },
        dotsRow: {
          flexDirection: 'row',
          gap: theme.spacing.md,
        },
        dot: {
          width: 14,
          height: 14,
          borderRadius: theme.borderRadius.full,
          borderWidth: 1.5,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        },
        dotFilled: {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        },
        error: {
          ...theme.typography.bodySmall,
          color: theme.colors.error,
          textAlign: 'center',
          minHeight: 20,
        },
      }),
    [theme],
  );

  const updatePin = useCallback(
    (nextPin: string) => {
      setPin(nextPin);
      onChange?.(nextPin);
    },
    [onChange],
  );

  const handleDigitPress = useCallback(
    (digit: string) => {
      if (disabled || pin.length >= maxLength) {
        return;
      }

      const nextPin = `${pin}${digit}`;
      updatePin(nextPin);

      if (nextPin.length === maxLength) {
        onComplete(nextPin);
      }
    },
    [disabled, maxLength, onComplete, pin, updatePin],
  );

  const handleDeletePress = useCallback(() => {
    if (disabled || pin.length === 0) {
      return;
    }

    updatePin(pin.slice(0, -1));
  }, [disabled, pin, updatePin]);

  useEffect(() => {
    if (error) {
      setPin('');
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View
        style={styles.dotsRow}
        accessibilityLabel={`${pin.length} of ${maxLength} digits entered`}
      >
        {Array.from({ length: maxLength }).map((_, index) => (
          <View
            key={`dot-${index}`}
            style={[styles.dot, index < pin.length && styles.dotFilled]}
          />
        ))}
      </View>

      <Text style={styles.error} accessibilityLiveRegion="polite">
        {error ?? ' '}
      </Text>

      <PinPad
        disabled={disabled}
        onDigitPress={handleDigitPress}
        onDeletePress={handleDeletePress}
      />
    </View>
  );
}
