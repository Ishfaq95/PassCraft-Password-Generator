import { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Icon, type AccessibilityProps, type IconName } from './common';
import { PrimaryButton } from './PrimaryButton';
import { useTheme } from '@/theme';

export type EmptyStateProps = AccessibilityProps & {
  icon?: IconName;
  title: string;
  description?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function EmptyState({
  icon = 'folder-open-outline',
  title,
  description,
  actionLabel,
  onActionPress,
  accessibilityLabel,
  testID,
  style,
}: EmptyStateProps) {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: theme.spacing['2xl'],
          paddingVertical: theme.spacing['4xl'],
          gap: theme.spacing.md,
        },
        iconContainer: {
          width: 72,
          height: 72,
          borderRadius: theme.borderRadius.full,
          backgroundColor: theme.colors.surfaceVariant,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: theme.spacing.sm,
        },
        title: {
          ...theme.typography.titleLarge,
          color: theme.colors.text,
          textAlign: 'center',
        },
        description: {
          ...theme.typography.bodyMedium,
          color: theme.colors.textSecondary,
          textAlign: 'center',
        },
        action: {
          marginTop: theme.spacing.md,
        },
      }),
    [theme],
  );

  return (
    <View
      testID={testID}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? title}
      style={[styles.container, style]}
    >
      <View style={styles.iconContainer}>
        <Icon name={icon} size={32} color={theme.colors.iconSecondary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {actionLabel && onActionPress ? (
        <PrimaryButton
          title={actionLabel}
          onPress={onActionPress}
          style={styles.action}
          accessibilityLabel={actionLabel}
        />
      ) : null}
    </View>
  );
}
