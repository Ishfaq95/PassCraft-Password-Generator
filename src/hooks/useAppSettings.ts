import { useCallback, useState } from 'react';

import { useToast } from '@/components/Toast/ToastContext';
import { appSettingsService, type AppSettings } from '@/services/appSettings';
import type { PasswordGeneratorOptions } from '@/services/password';
import type { ThemeMode } from '@/theme';
import { useTheme } from '@/theme';
import { useAppError } from '@/hooks/useAppError';
import { AppError } from '@/errors';
import { openRateApp } from '@/utils/appLinks';
import { isShareAppCancelled, shareApp } from '@/utils/shareApp';

export function useAppSettings() {
  const { showToast } = useToast();
  const { showError } = useAppError();
  const { setMode, mode } = useTheme();
  const [settings, setSettings] = useState<AppSettings>(() =>
    appSettingsService.getSettings(),
  );

  const refresh = useCallback(() => {
    setSettings(appSettingsService.getSettings());
  }, []);

  const setThemeMode = useCallback(
    (themeMode: ThemeMode) => {
      try {
        setMode(themeMode);
        refresh();
      } catch (error) {
        showError(error);
      }
    },
    [refresh, setMode, showError],
  );

  const updateDefaultLength = useCallback(
    (length: number) => {
      try {
        appSettingsService.updateDefaultGeneratorOptions({ length });
        refresh();
        showToast({
          message: 'Default password length updated',
          type: 'success',
        });
      } catch (error) {
        showError(error);
      }
    },
    [refresh, showError, showToast],
  );

  const updateDefaultOptions = useCallback(
    (patch: Partial<PasswordGeneratorOptions>) => {
      try {
        appSettingsService.updateDefaultGeneratorOptions(patch);
        refresh();
      } catch (error) {
        showError(error);
      }
    },
    [refresh, showError],
  );

  const saveDefaultOptions = useCallback(() => {
    showToast({
      message: 'Default options saved',
      type: 'success',
    });
  }, [showToast]);

  const rateApp = useCallback(async () => {
    try {
      await openRateApp();
    } catch (error) {
      showError(AppError.unknown(error));
    }
  }, [showError]);

  const shareApplication = useCallback(async () => {
    try {
      await shareApp();
    } catch (error) {
      if (isShareAppCancelled(error)) {
        return;
      }

      showError(AppError.shareFailed(error));
    }
  }, [showError]);

  return {
    settings,
    themeMode: mode,
    refresh,
    setThemeMode,
    updateDefaultLength,
    updateDefaultOptions,
    saveDefaultOptions,
    rateApp,
    shareApplication,
  };
}
