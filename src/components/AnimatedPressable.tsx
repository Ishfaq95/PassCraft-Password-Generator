import { useCallback } from 'react';
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { pressSpring } from '@/utils/animations';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

export type AnimatedPressableProps = PressableProps & {
  scaleTo?: number;
  style?: StyleProp<ViewStyle>;
};

export function AnimatedPressable({
  children,
  disabled = false,
  onPressIn,
  onPressOut,
  scaleTo = 0.96,
  style,
  ...props
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(
    (event: Parameters<NonNullable<PressableProps['onPressIn']>>[0]) => {
      if (!disabled) {
        scale.value = withSpring(scaleTo, pressSpring);
      }

      onPressIn?.(event);
    },
    [disabled, onPressIn, scale, scaleTo],
  );

  const handlePressOut = useCallback(
    (event: Parameters<NonNullable<PressableProps['onPressOut']>>[0]) => {
      scale.value = withSpring(1, pressSpring);
      onPressOut?.(event);
    },
    [onPressOut, scale],
  );

  return (
    <AnimatedPressableBase
      {...props}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style]}
    >
      {children}
    </AnimatedPressableBase>
  );
}
