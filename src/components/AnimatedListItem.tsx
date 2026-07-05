import { type ReactNode } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

import {
  LIST_ITEM_ENTER_DURATION,
  LIST_ITEM_MAX_STAGGER_INDEX,
  LIST_ITEM_STAGGER_MS,
} from '@/utils/animations';

export type AnimatedListItemProps = {
  index: number;
  children: ReactNode;
};

export function AnimatedListItem({ index, children }: AnimatedListItemProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(
        Math.min(index, LIST_ITEM_MAX_STAGGER_INDEX) * LIST_ITEM_STAGGER_MS,
      )
        .duration(LIST_ITEM_ENTER_DURATION)
        .springify()
        .damping(18)}
    >
      {children}
    </Animated.View>
  );
}
