import { useMemo, type ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton } from './IconButton';
import { type AccessibilityProps, type IconName } from './common';
import { useTheme } from '@/theme';

export type ScreenHeaderProps = AccessibilityProps & {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  backIcon?: IconName;
  rightAction?: ReactNode;
  showBorder?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ScreenHeader({
  title,
  subtitle,
  onBackPress,
  backIcon = 'chevron-back',
  rightAction,
  showBorder = true,
  accessibilityLabel,
  testID,
  style,
}: ScreenHeaderProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingTop: insets.top + theme.spacing.sm,
          paddingBottom: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          backgroundColor: theme.colors.background,
          borderBottomWidth: showBorder ? StyleSheet.hairlineWidth : 0,
          borderBottomColor: theme.colors.divider,
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: 44,
          gap: theme.spacing.sm,
        },
        backSlot: {
          width: 44,
        },
        titleContainer: {
          flex: 1,
          alignItems: onBackPress ? 'center' : 'flex-start',
        },
        title: {
          ...theme.typography.headlineSmall,
          color: theme.colors.text,
          textAlign: onBackPress ? 'center' : 'left',
        },
        subtitle: {
          ...theme.typography.bodySmall,
          color: theme.colors.textSecondary,
          textAlign: onBackPress ? 'center' : 'left',
          marginTop: theme.spacing['2xs'],
        },
        rightSlot: {
          minWidth: 44,
          alignItems: 'flex-end',
        },
      }),
    [theme, insets.top, onBackPress, showBorder],
  );

  return (
    <View
      testID={testID}
      accessibilityRole="header"
      accessibilityLabel={accessibilityLabel ?? title}
      style={[styles.container, style]}
    >
      <View style={styles.row}>
        <View style={styles.backSlot}>
          {onBackPress ? (
            <IconButton
              icon={backIcon}
              variant="ghost"
              accessibilityLabel="Go back"
              onPress={onBackPress}
            />
          ) : null}
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={styles.rightSlot}>{rightAction}</View>
      </View>
    </View>
  );
}
