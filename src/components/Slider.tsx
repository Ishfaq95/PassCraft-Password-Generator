import { useCallback, useEffect, useMemo } from 'react';
import {
  LayoutChangeEvent,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { type AccessibilityProps } from './common';
import { useTheme } from '@/theme';

export type SliderProps = AccessibilityProps & {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const THUMB_SIZE = 24;
const TRACK_HEIGHT = 6;

function clamp(value: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

function snapToStep(value: number, min: number, step: number) {
  'worklet';
  return Math.round((value - min) / step) * step + min;
}

export function Slider({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
}: SliderProps) {
  const { theme } = useTheme();
  const trackWidth = useSharedValue(0);
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);

  const updatePosition = useCallback(
    (width: number) => {
      const ratio = (value - minimumValue) / (maximumValue - minimumValue);
      translateX.value = ratio * Math.max(width - THUMB_SIZE, 0);
    },
    [value, minimumValue, maximumValue, translateX],
  );

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const width = event.nativeEvent.layout.width;
      trackWidth.value = width;
      updatePosition(width);
    },
    [trackWidth, updatePosition],
  );

  useEffect(() => {
    updatePosition(trackWidth.value);
  }, [value, trackWidth, updatePosition]);

  const emitValue = useCallback(
    (position: number) => {
      const available = Math.max(trackWidth.value - THUMB_SIZE, 1);
      const ratio = position / available;
      const raw = minimumValue + ratio * (maximumValue - minimumValue);
      const stepped =
        Math.round((raw - minimumValue) / step) * step + minimumValue;
      const clamped = Math.min(Math.max(stepped, minimumValue), maximumValue);
      onValueChange(clamped);
    },
    [minimumValue, maximumValue, step, onValueChange],
  );

  const pan = Gesture.Pan()
    .enabled(!disabled)
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate(event => {
      const max = Math.max(trackWidth.value - THUMB_SIZE, 0);
      translateX.value = clamp(startX.value + event.translationX, 0, max);
    })
    .onEnd(() => {
      const max = Math.max(trackWidth.value - THUMB_SIZE, 0);
      const snapped = snapToStep(
        translateX.value / Math.max(max, 1),
        0,
        step / (maximumValue - minimumValue),
      );
      const finalPosition = snapped * max;
      translateX.value = withTiming(finalPosition);
      runOnJS(emitValue)(finalPosition);
    });

  const tap = Gesture.Tap()
    .enabled(!disabled)
    .onEnd(event => {
      const max = Math.max(trackWidth.value - THUMB_SIZE, 0);
      const next = clamp(event.x - THUMB_SIZE / 2, 0, max);
      translateX.value = withTiming(next);
      runOnJS(emitValue)(next);
    });

  const gesture = Gesture.Race(pan, tap);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: translateX.value + THUMB_SIZE / 2,
  }));

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          minHeight: 44,
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
        },
        track: {
          height: TRACK_HEIGHT,
          borderRadius: theme.borderRadius.full,
          backgroundColor: theme.colors.surfaceVariant,
          overflow: 'hidden',
        },
        fill: {
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          backgroundColor: theme.colors.primary,
          borderRadius: theme.borderRadius.full,
        },
        thumb: {
          position: 'absolute',
          top: -(THUMB_SIZE - TRACK_HEIGHT) / 2,
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          borderRadius: theme.borderRadius.full,
          backgroundColor: theme.colors.primary,
          borderWidth: 3,
          borderColor: theme.colors.surface,
          ...theme.elevation.md,
        },
      }),
    [theme, disabled],
  );

  return (
    <View
      testID={testID}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel ?? 'Slider'}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      accessibilityValue={{
        min: minimumValue,
        max: maximumValue,
        now: value,
      }}
      style={[styles.container, style]}
      onLayout={handleLayout}
    >
      <GestureDetector gesture={gesture}>
        <Animated.View style={styles.track}>
          <Animated.View style={[styles.fill, fillStyle]} />
          <Animated.View style={[styles.thumb, thumbStyle]} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
