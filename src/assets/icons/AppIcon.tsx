import { Icon } from '@/components/common';
import { brand } from '@/assets/branding';
import { useTheme } from '@/theme';

import {
  appIconAccessibility,
  AppIconName,
  AppIconNameFilled,
  getAppIcon,
  type AppIconKey,
} from './iconMap';

type AppIconProps = {
  name: AppIconKey;
  size?: number;
  color?: string;
  variant?: 'outline' | 'filled';
  accessibilityLabel?: string;
};

export function AppIcon({
  name,
  size = brand.iconSystem.defaultSize,
  color,
  variant = 'outline',
  accessibilityLabel,
}: AppIconProps) {
  const { theme } = useTheme();

  return (
    <Icon
      name={getAppIcon(name, variant)}
      size={size}
      color={color ?? theme.colors.icon}
      accessibilityLabel={accessibilityLabel ?? appIconAccessibility[name]}
    />
  );
}

export { AppIconName, AppIconNameFilled, appIconAccessibility, getAppIcon };
export type { AppIconKey };
