import { memo, useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { HighlightedText } from './HighlightedText';
import { Icon, type AccessibilityProps } from './common';
import { StrengthMeter } from './StrengthMeter';
import type { PasswordStrengthLevel } from '@/types';
import { useTheme } from '@/theme';
import { getPasswordDisplayTitle } from '@/utils/passwordDetails';

export type HistoryPasswordCardProps = AccessibilityProps & {
  title?: string;
  email?: string;
  password: string;
  createdAtLabel: string;
  strength?: PasswordStrengthLevel;
  highlightQuery?: string;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
  onCopyPress?: () => void;
  onDeletePress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export const HistoryPasswordCard = memo(function HistoryPasswordCard({
  title,
  email,
  password,
  createdAtLabel,
  strength,
  highlightQuery = '',
  isFavorite = false,
  onFavoritePress,
  onCopyPress,
  onDeletePress,
  accessibilityLabel,
  testID,
  style,
}: HistoryPasswordCardProps) {
  const { theme } = useTheme();
  const displayTitle = getPasswordDisplayTitle(title);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.lg,
          gap: theme.spacing.md,
          ...theme.elevation.sm,
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
        email: {
          ...theme.typography.bodySmall,
          color: theme.colors.textSecondary,
        },
        createdAt: {
          ...theme.typography.bodySmall,
          color: theme.colors.textTertiary,
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
        password: {
          ...theme.typography.mono,
          color: theme.colors.text,
          letterSpacing: 1.5,
        },
      }),
    [theme],
  );

  return (
    <View
      testID={testID}
      accessibilityLabel={
        accessibilityLabel ?? `${displayTitle} password entry`
      }
      style={[styles.card, style]}
    >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <HighlightedText
            text={displayTitle}
            query={highlightQuery}
            style={styles.title}
            numberOfLines={1}
          />
          {email ? (
            <HighlightedText
              text={email}
              query={highlightQuery}
              style={styles.email}
              numberOfLines={1}
            />
          ) : null}
          <Text style={styles.createdAt}>{createdAtLabel}</Text>
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
          {onDeletePress ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Delete password"
              onPress={onDeletePress}
              style={styles.actionButton}
              hitSlop={8}
            >
              <Icon name="trash-outline" size={20} color={theme.colors.error} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <HighlightedText
        text={password}
        query={highlightQuery}
        style={styles.password}
        numberOfLines={2}
        selectable
      />

      {strength !== undefined ? (
        <StrengthMeter strength={strength} showLabel />
      ) : null}
    </View>
  );
});
