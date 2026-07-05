import type { IconName } from '@/components/common';

export const AppIconName = {
  Password: 'key-outline',
  History: 'time-outline',
  Favorites: 'star-outline',
  Settings: 'settings-outline',
  Generate: 'sparkles-outline',
  Copy: 'copy-outline',
  Delete: 'trash-outline',
  Share: 'share-outline',
  Lock: 'lock-closed-outline',
  Unlock: 'lock-open-outline',
} as const satisfies Record<string, IconName>;

export const AppIconNameFilled = {
  Password: 'key',
  History: 'time',
  Favorites: 'star',
  Settings: 'settings',
  Generate: 'sparkles',
  Copy: 'copy',
  Delete: 'trash',
  Share: 'share',
  Lock: 'lock-closed',
  Unlock: 'lock-open',
} as const satisfies Record<string, IconName>;

export type AppIconKey = keyof typeof AppIconName;

export function getAppIcon(
  key: AppIconKey,
  variant: 'outline' | 'filled' = 'outline',
): IconName {
  return variant === 'filled' ? AppIconNameFilled[key] : AppIconName[key];
}

export const appIconAccessibility: Record<AppIconKey, string> = {
  Password: 'Password',
  History: 'History',
  Favorites: 'Favorites',
  Settings: 'Settings',
  Generate: 'Generate password',
  Copy: 'Copy',
  Delete: 'Delete',
  Share: 'Share',
  Lock: 'Lock',
  Unlock: 'Unlock',
};
