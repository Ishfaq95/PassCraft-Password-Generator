import type { MMKV } from 'react-native-mmkv';

import { AppError } from '@/errors';
import {
  PASSWORD_LENGTH_MAX,
  PASSWORD_LENGTH_MIN,
  type PasswordGeneratorOptions,
} from '@/services/password';
import type { ThemeMode } from '@/theme';

import {
  APP_SETTINGS_STORAGE_KEY,
  DEFAULT_APP_SETTINGS,
  type AppSettings,
} from './types';

function clampLength(length: number): number {
  return Math.min(
    PASSWORD_LENGTH_MAX,
    Math.max(PASSWORD_LENGTH_MIN, Math.round(length)),
  );
}

function normalizeGeneratorOptions(
  options: Partial<PasswordGeneratorOptions> | undefined,
): PasswordGeneratorOptions {
  const defaults = DEFAULT_APP_SETTINGS.defaultGeneratorOptions;

  const normalized: PasswordGeneratorOptions = {
    length: clampLength(options?.length ?? defaults.length),
    uppercase: options?.uppercase ?? defaults.uppercase,
    lowercase: options?.lowercase ?? defaults.lowercase,
    numbers: options?.numbers ?? defaults.numbers,
    symbols: options?.symbols ?? defaults.symbols,
    avoidAmbiguous: options?.avoidAmbiguous ?? defaults.avoidAmbiguous,
    noRepeatedCharacters:
      options?.noRepeatedCharacters ?? defaults.noRepeatedCharacters,
  };

  const hasCharset =
    normalized.uppercase ||
    normalized.lowercase ||
    normalized.numbers ||
    normalized.symbols;

  if (!hasCharset) {
    return {
      ...normalized,
      lowercase: true,
      numbers: true,
    };
  }

  return normalized;
}

function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system';
}

function parseSettings(raw: string | undefined): AppSettings {
  if (!raw) {
    return DEFAULT_APP_SETTINGS;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== 'object') {
      return DEFAULT_APP_SETTINGS;
    }

    const record = parsed as Record<string, unknown>;

    return {
      themeMode: isThemeMode(record.themeMode)
        ? record.themeMode
        : DEFAULT_APP_SETTINGS.themeMode,
      defaultGeneratorOptions: normalizeGeneratorOptions(
        record.defaultGeneratorOptions as
          | Partial<PasswordGeneratorOptions>
          | undefined,
      ),
      appLockEnabled:
        typeof record.appLockEnabled === 'boolean'
          ? record.appLockEnabled
          : DEFAULT_APP_SETTINGS.appLockEnabled,
      biometricUnlockEnabled:
        typeof record.biometricUnlockEnabled === 'boolean'
          ? record.biometricUnlockEnabled
          : DEFAULT_APP_SETTINGS.biometricUnlockEnabled,
    };
  } catch {
    return DEFAULT_APP_SETTINGS;
  }
}

export class AppSettingsRepository {
  constructor(
    private readonly mmkv: MMKV,
    private readonly storageKey: string = APP_SETTINGS_STORAGE_KEY,
  ) {}

  getSettings(): AppSettings {
    return parseSettings(this.mmkv.getString(this.storageKey));
  }

  saveSettings(settings: AppSettings): void {
    try {
      this.mmkv.set(this.storageKey, JSON.stringify(settings));
    } catch (cause) {
      throw AppError.settingsWrite(cause);
    }
  }

  getThemeMode(): ThemeMode {
    return this.getSettings().themeMode;
  }

  setThemeMode(themeMode: ThemeMode): void {
    const settings = this.getSettings();
    this.saveSettings({ ...settings, themeMode });
  }

  getDefaultGeneratorOptions(): PasswordGeneratorOptions {
    return this.getSettings().defaultGeneratorOptions;
  }

  setDefaultGeneratorOptions(
    options: PasswordGeneratorOptions,
  ): PasswordGeneratorOptions {
    const settings = this.getSettings();
    const next = normalizeGeneratorOptions(options);
    this.saveSettings({
      ...settings,
      defaultGeneratorOptions: next,
    });
    return next;
  }

  updateDefaultGeneratorOptions(
    patch: Partial<PasswordGeneratorOptions>,
  ): PasswordGeneratorOptions {
    const next = normalizeGeneratorOptions({
      ...this.getSettings().defaultGeneratorOptions,
      ...patch,
    });

    this.setDefaultGeneratorOptions(next);
    return next;
  }

  setAppLockEnabled(appLockEnabled: boolean): void {
    const settings = this.getSettings();
    this.saveSettings({ ...settings, appLockEnabled });
  }

  setBiometricUnlockEnabled(biometricUnlockEnabled: boolean): void {
    const settings = this.getSettings();
    this.saveSettings({ ...settings, biometricUnlockEnabled });
  }
}
