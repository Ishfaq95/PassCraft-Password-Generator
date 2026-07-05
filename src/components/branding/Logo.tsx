import { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { brand } from '@/assets/branding';
import { useTheme } from '@/theme';

export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

export type LogoProps = {
  size?: LogoSize;
  showWordmark?: boolean;
  style?: StyleProp<ViewStyle>;
};

const SIZE_MAP: Record<LogoSize, { mark: number; font: number }> = {
  sm: { mark: 32, font: 16 },
  md: { mark: 48, font: 22 },
  lg: { mark: 72, font: 28 },
  xl: { mark: 96, font: 36 },
};

export function Logo({ size = 'md', showWordmark = true, style }: LogoProps) {
  const { theme, isDark } = useTheme();
  const dimensions = SIZE_MAP[size];
  const markSize = dimensions.mark;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          alignItems: 'center',
          gap: theme.spacing.md,
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.md,
        },
        mark: {
          width: markSize,
          height: markSize,
          alignItems: 'center',
          justifyContent: 'center',
        },
        shield: {
          width: markSize,
          height: markSize,
          borderRadius: markSize * 0.28,
          backgroundColor: theme.colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: theme.colors.secondary,
          ...theme.elevation.md,
        },
        keyhole: {
          width: markSize * 0.22,
          height: markSize * 0.34,
          borderRadius: markSize * 0.11,
          backgroundColor: isDark
            ? theme.colors.background
            : theme.colors.surface,
        },
        keyholeNotch: {
          position: 'absolute',
          bottom: markSize * 0.18,
          width: markSize * 0.36,
          height: markSize * 0.22,
          borderTopLeftRadius: markSize * 0.18,
          borderTopRightRadius: markSize * 0.18,
          backgroundColor: isDark
            ? theme.colors.background
            : theme.colors.surface,
        },
        wordmark: {
          fontSize: dimensions.font,
          fontWeight: brand.logo.wordmark.fontWeight,
          letterSpacing: brand.logo.wordmark.letterSpacing,
          color: theme.colors.text,
        },
      }),
    [theme, isDark, markSize, dimensions.font],
  );

  const mark = (
    <View style={styles.mark} accessibilityLabel="SecurePass logo">
      <View style={styles.shield}>
        <View style={styles.keyholeNotch} />
        <View style={styles.keyhole} />
      </View>
    </View>
  );

  if (!showWordmark) {
    return <View style={[styles.container, style]}>{mark}</View>;
  }

  return (
    <View style={[styles.row, style]}>
      {mark}
      <Text style={styles.wordmark}>{brand.name}</Text>
    </View>
  );
}
