import type { AppSettings } from './types';
import { AppSettingsRepository } from './AppSettingsRepository';
import { storage } from '@/storage';

import type { PasswordGeneratorOptions } from '@/services/password';
import type { ThemeMode } from '@/theme';

export {
  APP_SETTINGS_STORAGE_KEY,
  DEFAULT_APP_SETTINGS,
  DEFAULT_GENERATOR_OPTIONS,
} from './types';
export type { AppSettings } from './types';

const repository = new AppSettingsRepository(storage);

let defaultsRevision = 0;

export class AppSettingsService {
  constructor(private readonly settingsRepository: AppSettingsRepository) {}

  getSettings(): AppSettings {
    return this.settingsRepository.getSettings();
  }

  getThemeMode(): ThemeMode {
    return this.settingsRepository.getThemeMode();
  }

  setThemeMode(themeMode: ThemeMode): void {
    this.settingsRepository.setThemeMode(themeMode);
  }

  getDefaultGeneratorOptions(): PasswordGeneratorOptions {
    return this.settingsRepository.getDefaultGeneratorOptions();
  }

  setDefaultGeneratorOptions(
    options: PasswordGeneratorOptions,
  ): PasswordGeneratorOptions {
    const next = this.settingsRepository.setDefaultGeneratorOptions(options);
    defaultsRevision += 1;
    return next;
  }

  updateDefaultGeneratorOptions(
    patch: Partial<PasswordGeneratorOptions>,
  ): PasswordGeneratorOptions {
    const next = this.settingsRepository.updateDefaultGeneratorOptions(patch);
    defaultsRevision += 1;
    return next;
  }

  getDefaultsRevision(): number {
    return defaultsRevision;
  }

  setAppLockEnabled(appLockEnabled: boolean): void {
    this.settingsRepository.setAppLockEnabled(appLockEnabled);
  }

  setBiometricUnlockEnabled(biometricUnlockEnabled: boolean): void {
    this.settingsRepository.setBiometricUnlockEnabled(biometricUnlockEnabled);
  }
}

export const appSettingsService = new AppSettingsService(repository);
