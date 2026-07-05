import { useMemo } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { type AccessibilityProps } from './common';
import { useTheme } from '@/theme';

export type LoadingViewProps = AccessibilityProps & {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function LoadingView({
  message = 'Loading…',
  size = 'large',
  fullScreen = false,
  accessibilityLabel,
  testID,
  style,
}: LoadingViewProps) {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing.md,
          padding: theme.spacing['2xl'],
          ...(fullScreen && {
            flex: 1,
            backgroundColor: theme.colors.background,
          }),
        },
        message: {
          ...theme.typography.bodyMedium,
          color: theme.colors.textSecondary,
          textAlign: 'center',
        },
      }),
    [theme, fullScreen],
  );

  return (
    <View
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel ?? message}
      accessibilityLiveRegion="polite"
      style={[styles.container, style]}
    >
      <ActivityIndicator color={theme.colors.primary} size={size} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}
