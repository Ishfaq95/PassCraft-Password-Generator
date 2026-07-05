import { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { Icon, type AccessibilityProps, type IconName } from './common';
import { IconButton } from './IconButton';
import { useTheme } from '@/theme';

export type InputProps = AccessibilityProps &
  Omit<TextInputProps, 'style'> & {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: IconName;
    secureTextEntry?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
  };

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  secureTextEntry = false,
  editable = true,
  accessibilityLabel,
  accessibilityHint,
  testID,
  containerStyle,
  ...textInputProps
}: InputProps) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const hasError = Boolean(error);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          gap: theme.spacing.xs,
        },
        label: {
          ...theme.typography.labelMedium,
          color: theme.colors.text,
        },
        inputWrapper: {
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: 48,
          borderRadius: theme.borderRadius.md,
          borderWidth: 1.5,
          borderColor: hasError
            ? theme.colors.error
            : isFocused
            ? theme.colors.primary
            : theme.colors.border,
          backgroundColor: editable
            ? theme.colors.surface
            : theme.colors.surfaceVariant,
          paddingHorizontal: theme.spacing.md,
          gap: theme.spacing.sm,
        },
        input: {
          flex: 1,
          ...theme.typography.bodyMedium,
          color: theme.colors.text,
          paddingVertical: theme.spacing.sm,
        },
        helper: {
          ...theme.typography.bodySmall,
          color: hasError ? theme.colors.error : theme.colors.textSecondary,
        },
      }),
    [theme, hasError, isFocused, editable],
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={styles.label} accessibilityRole="text">
          {label}
        </Text>
      ) : null}

      <View style={styles.inputWrapper}>
        {leftIcon ? <Icon name={leftIcon} size={20} /> : null}
        <TextInput
          {...textInputProps}
          testID={testID}
          editable={editable}
          secureTextEntry={isSecure}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={accessibilityHint}
          placeholderTextColor={theme.colors.textTertiary}
          onFocus={event => {
            setIsFocused(true);
            textInputProps.onFocus?.(event);
          }}
          onBlur={event => {
            setIsFocused(false);
            textInputProps.onBlur?.(event);
          }}
          style={styles.input}
        />
        {secureTextEntry ? (
          <IconButton
            icon={isSecure ? 'eye-off-outline' : 'eye-outline'}
            variant="ghost"
            size="sm"
            accessibilityLabel={isSecure ? 'Show password' : 'Hide password'}
            onPress={() => setIsSecure(current => !current)}
          />
        ) : null}
      </View>

      {error || helperText ? (
        <Text
          style={styles.helper}
          accessibilityRole="text"
          accessibilityLiveRegion="polite"
        >
          {error ?? helperText}
        </Text>
      ) : null}
    </View>
  );
}
