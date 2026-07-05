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
import type { PasswordStrengthLevel } from '@/types';
import { StrengthMeter } from './StrengthMeter';
import { useTheme } from '@/theme';

export type PasswordCardProps = AccessibilityProps & {
  title: string;
  username?: string;
  password: string;
  website?: string;
  strength?: PasswordStrengthLevel;
  isFavorite?: boolean;
  obscured?: boolean;
  onPress?: () => void;
  onCopyPress?: () => void;
  onFavoritePress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function PasswordCard({
  title,
  username,
  password,
  website,
  strength,
  isFavorite = false,
  obscured = true,
  onPress,
  onCopyPress,
  onFavoritePress,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
}: PasswordCardProps) {
  const { theme } = useTheme();

  const displayPassword = obscured
    ? '•'.repeat(Math.min(password.length, 16))
    : password;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.lg,
          gap: theme.spacing.sm,
          ...theme.elevation.sm,
        },
        pressed: {
          backgroundColor: theme.colors.surfaceVariant,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: theme.spacing.md,
        },
        headerText: {
          flex: 1,
          gap: theme.spacing['2xs'],
        },
        title: {
          ...theme.typography.titleMedium,
          color: theme.colors.text,
        },
        website: {
          ...theme.typography.bodySmall,
          color: theme.colors.textSecondary,
        },
        actions: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.xs,
        },
        actionButton: {
          padding: theme.spacing.xs,
          borderRadius: theme.borderRadius.sm,
        },
        username: {
          ...theme.typography.bodySmall,
          color: theme.colors.textSecondary,
        },
        password: {
          ...theme.typography.mono,
          color: theme.colors.text,
          letterSpacing: 2,
        },
      }),
    [theme],
  );

  const content = (
    <>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {website ? (
            <Text style={styles.website} numberOfLines={1}>
              {website}
            </Text>
          ) : null}
        </View>
        <View style={styles.actions}>
          {onFavoritePress ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                isFavorite ? 'Remove from favorites' : 'Add to favorites'
              }
              onPress={onFavoritePress}
              style={styles.actionButton}
              hitSlop={8}
            >
              <Icon
                name={isFavorite ? 'star' : 'star-outline'}
                size={20}
                color={
                  isFavorite ? theme.colors.warning : theme.colors.iconSecondary
                }
              />
            </Pressable>
          ) : null}
          {onCopyPress ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Copy password"
              onPress={onCopyPress}
              style={styles.actionButton}
              hitSlop={8}
            >
              <Icon name="copy-outline" size={20} color={theme.colors.icon} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {username ? (
        <Text style={styles.username} numberOfLines={1}>
          {username}
        </Text>
      ) : null}

      <Text
        style={styles.password}
        numberOfLines={1}
        accessibilityLabel={obscured ? 'Password hidden' : password}
      >
        {displayPassword}
      </Text>

      {strength !== undefined ? (
        <StrengthMeter strength={strength} showLabel />
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? `${title} password entry`}
        accessibilityHint={accessibilityHint}
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      testID={testID}
      accessibilityLabel={accessibilityLabel ?? `${title} password entry`}
      style={[styles.card, style]}
    >
      {content}
    </View>
  );
}
