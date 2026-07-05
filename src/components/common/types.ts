import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ComponentProps } from 'react';
import type Ionicons from 'react-native-vector-icons/Ionicons';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export type ComponentSize = 'sm' | 'md' | 'lg';

export type AccessibilityProps = {
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
};

export type WithStyle = {
  style?: StyleProp<ViewStyle>;
};

export type WithChildren = {
  children?: ReactNode;
};
