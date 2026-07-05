import { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { type AccessibilityProps } from './common';
import { useTheme } from '@/theme';

export type SectionHeaderProps = AccessibilityProps & {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function SectionHeader({
  title,
  actionLabel,
  onActionPress,
  accessibilityLabel,
  testID,
  style,
}: SectionHeaderProps) {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.sm,
          minHeight: 36,
        },
        title: {
          ...theme.typography.labelMedium,
          color: theme.colors.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
        action: {
          ...theme.typography.labelMedium,
          color: theme.colors.primary,
        },
        actionPressed: {
          opacity: 0.7,
        },
      }),
    [theme],
  );

  return (
    <View
      testID={testID}
      accessibilityRole="header"
      accessibilityLabel={accessibilityLabel ?? title}
      style={[styles.container, style]}
    >
      <Text style={styles.title}>{title}</Text>
      {actionLabel && onActionPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onActionPress}
          hitSlop={8}
          style={({ pressed }) => pressed && styles.actionPressed}
        >
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
