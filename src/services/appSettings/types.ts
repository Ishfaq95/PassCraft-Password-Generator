import type { PasswordGeneratorOptions } from '@/services/password';
import type { ThemeMode } from '@/theme';

export const APP_SETTINGS_STORAGE_KEY = 'app.settings';

export const DEFAULT_GENERATOR_OPTIONS: PasswordGeneratorOptions = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  avoidAmbiguous: false,
};

export type AppSettings = {
  themeMode: ThemeMode;
  defaultGeneratorOptions: PasswordGeneratorOptions;
  appLockEnabled: boolean;
  biometricUnlockEnabled: boolean;
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  themeMode: 'system',
  defaultGeneratorOptions: DEFAULT_GENERATOR_OPTIONS,
  appLockEnabled: false,
  biometricUnlockEnabled: false,
};
