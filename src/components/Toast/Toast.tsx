import { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '../common/Icon';
import { useTheme } from '@/theme';

import { useToast, type ToastType } from './ToastContext';

function getToastColors(
  type: ToastType,
  colors: ReturnType<typeof useTheme>['theme']['colors'],
) {
  switch (type) {
    case 'success':
      return {
        background: colors.successMuted,
        border: colors.success,
        text: colors.success,
        icon: 'checkmark-circle' as const,
      };
    case 'error':
      return {
        background: colors.errorMuted,
        border: colors.error,
        text: colors.error,
        icon: 'close-circle' as const,
      };
    case 'info':
    default:
      return {
        background: colors.primaryMuted,
        border: colors.primary,
        text: colors.primary,
        icon: 'information-circle' as const,
      };
  }
}

export function Toast() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { toast, hideToast } = useToast();
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast) {
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
        toValue: -120,
        duration: theme.animation.duration.fast,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: theme.animation.duration.fast,
        useNativeDriver: true,
      }),
    ]).start();
  }, [toast, translateY, opacity, theme.animation.duration]);

  const palette = toast
    ? getToastColors(toast.type, theme.colors)
    : getToastColors('info', theme.colors);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          position: 'absolute',
          top: insets.top + theme.spacing.sm,
          left: theme.spacing.lg,
          right: theme.spacing.lg,
          zIndex: 1000,
        },
        toast: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.sm,
          backgroundColor: palette.background,
          borderWidth: 1,
          borderColor: palette.border,
          borderRadius: theme.borderRadius.lg,
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          ...theme.elevation.md,
        },
        message: {
          ...theme.typography.bodyMedium,
          color: palette.text,
          flex: 1,
        },
      }),
    [theme, insets.top, palette],
  );

  if (!toast) {
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
      <Pressable onPress={hideToast} style={styles.toast}>
        <Icon name={palette.icon} size={20} color={palette.text} />
        <Text style={styles.message}>{toast.message}</Text>
      </Pressable>
    </Animated.View>
  );
}
