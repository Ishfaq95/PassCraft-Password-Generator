import { useMemo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { brand } from '@/assets/branding';
import { images } from '@/assets/images';
import { useTheme } from '@/theme';

import { Logo } from './Logo';

export type SplashViewProps = {
  useImageLogo?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function SplashView({ useImageLogo = false, style }: SplashViewProps) {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.background,
          paddingHorizontal: theme.spacing['2xl'],
          gap: theme.spacing.lg,
        },
        imageLogo: {
          width: brand.splash.logoSize,
          height: brand.splash.logoSize,
          borderRadius: theme.borderRadius.xl,
        },
        tagline: {
          ...theme.typography.bodyMedium,
          color: theme.colors.textSecondary,
          opacity: brand.splash.taglineOpacity,
          textAlign: 'center',
        },
      }),
    [theme],
  );

  return (
    <View
      style={[styles.container, style]}
      accessibilityLabel={`${brand.name} splash screen`}
    >
      {useImageLogo ? (
        <Image
          source={images.logo}
          style={styles.imageLogo}
          accessibilityLabel="SecurePass logo"
          resizeMode="contain"
        />
      ) : (
        <Logo size="xl" showWordmark />
      )}
      <Text style={styles.tagline}>{brand.tagline}</Text>
    </View>
  );
}
