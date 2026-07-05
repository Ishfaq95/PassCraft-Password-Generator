import { useCallback, type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/theme';
import { createTimingConfig, screenEnterSpring } from '@/utils/animations';

export type AnimatedScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function AnimatedScreen({ children, style }: AnimatedScreenProps) {
  const { theme } = useTheme();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(14);

  useFocusEffect(
    useCallback(() => {
      opacity.value = 0;
      translateY.value = 14;
      opacity.value = withTiming(
        1,
        createTimingConfig(theme.animation.duration.normal),
      );
      translateY.value = withSpring(0, screenEnterSpring);
    }, [opacity, theme.animation.duration.normal, translateY]),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}
