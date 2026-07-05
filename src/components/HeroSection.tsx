import { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { AppIcon } from '@/assets/icons';
import { brand } from '@/assets/branding';
import { useTheme } from '@/theme';

export type HeroSectionProps = {
  title: string;
  subtitle: string;
  style?: StyleProp<ViewStyle>;
};

export function HeroSection({ title, subtitle, style }: HeroSectionProps) {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          borderRadius: theme.borderRadius['2xl'],
          padding: theme.spacing['2xl'],
          gap: theme.spacing.lg,
          overflow: 'hidden',
          backgroundColor: theme.colors.primaryMuted,
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        accentOrb: {
          position: 'absolute',
          top: -40,
          right: -30,
          width: 140,
          height: 140,
          borderRadius: 70,
          backgroundColor: theme.colors.secondaryMuted,
          opacity: 0.6,
        },
        accentOrbSmall: {
          position: 'absolute',
          bottom: -20,
          left: -20,
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: theme.colors.primary,
          opacity: 0.12,
        },
        iconBadge: {
          width: 56,
          height: 56,
          borderRadius: theme.borderRadius.lg,
          backgroundColor: theme.colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          ...theme.elevation.md,
        },
        title: {
          ...theme.typography.headlineMedium,
          color: theme.colors.text,
        },
        subtitle: {
          ...theme.typography.bodyMedium,
          color: theme.colors.textSecondary,
        },
        brand: {
          ...theme.typography.labelSmall,
          color: theme.colors.primary,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
        },
      }),
    [theme],
  );

  return (
    <View style={[styles.container, style]} accessibilityRole="header">
      <View style={styles.accentOrb} />
      <View style={styles.accentOrbSmall} />
      <View style={styles.iconBadge}>
        <AppIcon
          name="Generate"
          variant="filled"
          size={28}
          color={theme.colors.onPrimary}
        />
      </View>
      <Text style={styles.brand}>{brand.name}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}
