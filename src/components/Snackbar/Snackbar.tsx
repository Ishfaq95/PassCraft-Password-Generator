import { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';

import { useSnackbar } from './SnackbarContext';

export function Snackbar() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { snackbar, hideSnackbar } = useSnackbar();

  const handleAction = () => {
    snackbar?.onAction?.();
    hideSnackbar();
  };
  const translateY = useRef(new Animated.Value(120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (snackbar) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: theme.animation.duration.normal,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: theme.animation.duration.fast,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 120,
        duration: theme.animation.duration.fast,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: theme.animation.duration.fast,
        useNativeDriver: true,
      }),
    ]).start();
  }, [snackbar, translateY, opacity, theme.animation.duration]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          position: 'absolute',
          left: theme.spacing.lg,
          right: theme.spacing.lg,
          bottom: insets.bottom + theme.spacing.lg,
          zIndex: 1000,
        },
        snackbar: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.md,
          backgroundColor: theme.colors.text,
          borderRadius: theme.borderRadius.lg,
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          ...theme.elevation.lg,
        },
        message: {
          ...theme.typography.bodyMedium,
          color: theme.colors.textInverse,
          flex: 1,
        },
        action: {
          ...theme.typography.labelLarge,
          color: theme.colors.primaryMuted,
        },
      }),
    [theme, insets.bottom],
  );

  if (!snackbar) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Pressable onPress={hideSnackbar} style={styles.snackbar}>
        <Text style={styles.message}>{snackbar.message}</Text>
        {snackbar.actionLabel && snackbar.onAction ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={snackbar.actionLabel}
            onPress={handleAction}
            hitSlop={8}
          >
            <Text style={styles.action}>{snackbar.actionLabel}</Text>
          </Pressable>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}
