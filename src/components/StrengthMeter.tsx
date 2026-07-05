import { useEffect, useMemo } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { STRENGTH_LABELS } from '@/services/password';
import type { PasswordStrengthLevel } from '@/types';
import { type AccessibilityProps } from './common';
import { useTheme } from '@/theme';
import type { ThemeColors } from '@/theme';
import { createTimingConfig, screenEnterSpring } from '@/utils/animations';

export type StrengthMeterProps = AccessibilityProps & {
  strength: PasswordStrengthLevel;
  showLabel?: boolean;
  segments?: number;
  style?: StyleProp<ViewStyle>;
};

const SEGMENT_COUNT = 5;

function getStrengthColor(
  level: PasswordStrengthLevel,
  colors: ThemeColors,
): string {
  switch (level) {
    case 0:
    case 1:
      return colors.error;
    case 2:
      return colors.warning;
    case 3:
      return colors.success;
    case 4:
    default:
      return colors.primary;
  }
}

type AnimatedStrengthSegmentProps = {
  index: number;
  progress: SharedValue<number>;
  activeColor: string;
  inactiveColor: string;
};

function AnimatedStrengthSegment({
  index,
  progress,
  activeColor,
  inactiveColor,
}: AnimatedStrengthSegmentProps) {
  const { theme } = useTheme();

  const segmentStyle = useAnimatedStyle(() => {
    const fill = interpolate(
      progress.value,
      [index - 0.6, index + 0.2],
      [0, 1],
      'clamp',
    );

    return {
      opacity: interpolate(fill, [0, 1], [0.35, 1]),
      transform: [{ scaleY: interpolate(fill, [0, 1], [0.55, 1]) }],
      backgroundColor: interpolateColor(
        fill,
        [0, 1],
        [inactiveColor, activeColor],
      ),
    };
  });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        segment: {
          flex: 1,
          borderRadius: theme.borderRadius.full,
          height: 4,
        },
      }),
    [theme],
  );

  return <Animated.View style={[styles.segment, segmentStyle]} />;
}

export function StrengthMeter({
  strength,
  showLabel = false,
  segments = SEGMENT_COUNT,
  accessibilityLabel,
  testID,
  style,
}: StrengthMeterProps) {
  const { theme } = useTheme();
  const activeColor = getStrengthColor(strength, theme.colors);
  const label = STRENGTH_LABELS[strength];
  const progress = useSharedValue<number>(strength);
  const labelOpacity = useSharedValue(1);
  const labelScale = useSharedValue(1);

  useEffect(() => {
    progress.value = withSpring(strength, screenEnterSpring);
    labelOpacity.value = 0.6;
    labelScale.value = 0.96;
    labelOpacity.value = withTiming(
      1,
      createTimingConfig(theme.animation.duration.fast),
    );
    labelScale.value = withSpring(1, screenEnterSpring);
  }, [
    labelOpacity,
    labelScale,
    progress,
    strength,
    theme.animation.duration.fast,
  ]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          gap: theme.spacing.xs,
        },
        track: {
          flexDirection: 'row',
          gap: theme.spacing['2xs'],
          height: 4,
        },
        label: {
          ...theme.typography.labelSmall,
          color: activeColor,
        },
      }),
    [theme, activeColor],
  );

  const labelStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
    transform: [{ scale: labelScale.value }],
  }));

  return (
    <View
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel ?? `Password strength: ${label}`}
      accessibilityValue={{
        min: 0,
        max: segments - 1,
        now: strength,
        text: label,
      }}
      style={[styles.container, style]}
    >
      <View style={styles.track}>
        {Array.from({ length: segments }, (_, index) => (
          <AnimatedStrengthSegment
            key={index}
            index={index}
            progress={progress}
            activeColor={activeColor}
            inactiveColor={theme.colors.surfaceVariant}
          />
        ))}
      </View>
      {showLabel ? (
        <Animated.Text style={[styles.label, labelStyle]}>
          {label}
        </Animated.Text>
      ) : null}
    </View>
  );
}
