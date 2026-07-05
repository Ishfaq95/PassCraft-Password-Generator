import { useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { IconButton } from './IconButton';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { useTheme } from '@/theme';
import { createTimingConfig, screenEnterSpring } from '@/utils/animations';

export type PasswordPreviewCardProps = {
  password: string;
  label?: string;
  placeholder?: string;
  onCopyPress?: () => void;
  onSharePress?: () => void;
  onRegeneratePress?: () => void;
  regenerateDisabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function PasswordPreviewCard({
  password,
  label = 'Generated Password',
  placeholder = 'Your password will appear here',
  onCopyPress,
  onSharePress,
  onRegeneratePress,
  regenerateDisabled = false,
  style,
}: PasswordPreviewCardProps) {
  const { theme } = useTheme();
  const cardScale = useSharedValue(1);
  const textOpacity = useSharedValue(1);
  const textTranslateY = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (!password) {
      textOpacity.value = 1;
      textTranslateY.value = 0;
      glowOpacity.value = 0;
      return;
    }

    cardScale.value = withSequence(
      withTiming(0.98, createTimingConfig(theme.animation.duration.fast)),
      withSpring(1, screenEnterSpring),
    );
    glowOpacity.value = withSequence(
      withTiming(0.35, createTimingConfig(theme.animation.duration.fast)),
      withTiming(0, createTimingConfig(theme.animation.duration.normal)),
    );
    textOpacity.value = 0;
    textTranslateY.value = 10;
    textOpacity.value = withTiming(
      1,
      createTimingConfig(theme.animation.duration.normal),
    );
    textTranslateY.value = withSpring(0, screenEnterSpring);
  }, [
    cardScale,
    glowOpacity,
    password,
    textOpacity,
    textTranslateY,
    theme.animation.duration.fast,
    theme.animation.duration.normal,
  ]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.xl,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.xl,
          gap: theme.spacing.lg,
          ...theme.elevation.md,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        label: {
          ...theme.typography.labelMedium,
          color: theme.colors.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: 0.8,
        },
        actions: {
          flexDirection: 'row',
          gap: theme.spacing.xs,
        },
        passwordContainer: {
          backgroundColor: theme.colors.surfaceVariant,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          overflow: 'hidden',
        },
        glow: {
          ...StyleSheet.absoluteFill,
          backgroundColor: theme.colors.primaryMuted,
        },
        password: {
          ...theme.typography.mono,
          fontSize: theme.typography.mono.fontSize,
          color: password ? theme.colors.text : theme.colors.textTertiary,
          letterSpacing: 1.5,
          textAlign: 'center',
        },
      }),
    [theme, password],
  );

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <Animated.View
      style={[styles.card, cardStyle, style]}
      accessibilityLabel={`${label}: password hidden`}
    >
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.actions}>
          <IconButton
            icon="copy-outline"
            variant="ghost"
            size="sm"
            accessibilityLabel="Copy password"
            onPress={onCopyPress ?? (() => undefined)}
            disabled={!password}
          />
          <IconButton
            icon="share-outline"
            variant="ghost"
            size="sm"
            accessibilityLabel="Share password"
            onPress={onSharePress ?? (() => undefined)}
            disabled={!password}
          />
          <IconButton
            icon="refresh-outline"
            variant="ghost"
            size="sm"
            accessibilityLabel="Regenerate password"
            onPress={onRegeneratePress ?? (() => undefined)}
            disabled={regenerateDisabled}
          />
        </View>
      </View>

      <View style={styles.passwordContainer}>
        <Animated.View style={[styles.glow, glowStyle]} />
        <Animated.Text
          style={[styles.password, textStyle]}
          selectable={Boolean(password)}
        >
          {password || placeholder}
        </Animated.Text>
      </View>

      {password ? (
        <PasswordStrengthMeter password={password} showSuggestions />
      ) : null}
    </Animated.View>
  );
}
