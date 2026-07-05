import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from '@/theme';

import type { IconName } from './types';

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  accessibilityLabel?: string;
};

export function Icon({
  name,
  size = 20,
  color,
  accessibilityLabel,
}: IconProps) {
  const { theme } = useTheme();

  return (
    <Ionicons
      name={name}
      size={size}
      color={color ?? theme.colors.icon}
      accessibilityLabel={accessibilityLabel}
      importantForAccessibility={
        accessibilityLabel ? 'yes' : 'no-hide-descendants'
      }
    />
  );
}
