import {
  type WithSpringConfig,
  type WithTimingConfig,
} from 'react-native-reanimated';

import { animation } from '@/theme';

export const pressSpring: WithSpringConfig = {
  damping: animation.spring.damping,
  stiffness: 400,
  mass: 0.4,
};

export const screenEnterSpring: WithSpringConfig = {
  damping: animation.spring.damping,
  stiffness: animation.spring.stiffness,
  mass: animation.spring.mass,
};

export function createTimingConfig(
  duration: number = animation.duration.normal,
): WithTimingConfig {
  return { duration };
}

export const LIST_ITEM_STAGGER_MS = 45;
export const LIST_ITEM_MAX_STAGGER_INDEX = 8;
export const LIST_ITEM_ENTER_DURATION = 280;
