import { useCallback, useEffect, useState } from 'react';

import { useToast } from '@/components/Toast/ToastContext';
import { useAppLockContext } from '@/context/AppLockContext';
import { appLockService } from '@/services/appLock';
import { appSettingsService, type AppSettings } from '@/services/appSettings';

export function useAppLock() {
  const { showToast } = useToast();
  const { lock, refresh: refreshLockState } = useAppLockContext();
  const [settings, setSettings] = useState<AppSettings>(() =>
    appSettingsService.getSettings(),
  );
  const [pinSheetVisible, setPinSheetVisible] = useState(false);
  const [pinSheetMode, setPinSheetMode] = useState<
    'create' | 'change-current' | 'disable'
  >('create');
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const refresh = useCallback(() => {
    setSettings(appSettingsService.getSettings());
    refreshLockState();
  }, [refreshLockState]);

  useEffect(() => {
    void appLockService.canUseBiometrics().then(setBiometricAvailable);
  }, [settings.biometricUnlockEnabled, settings.appLockEnabled]);

  const openCreatePinSheet = useCallback(() => {
    setPinSheetMode('create');
    setPinSheetVisible(true);
  }, []);

  const openChangePinSheet = useCallback(() => {
    setPinSheetMode('change-current');
    setPinSheetVisible(true);
  }, []);

  const openDisablePinSheet = useCallback(() => {
    setPinSheetMode('disable');
    setPinSheetVisible(true);
  }, []);

  const closePinSheet = useCallback(() => {
    setPinSheetVisible(false);
    refresh();
  }, [refresh]);

  const requestEnableAppLock = useCallback(async () => {
    const hasPin = await appLockService.hasPin();
    if (hasPin) {
      appSettingsService.setAppLockEnabled(true);
      lock();
      refresh();
      showToast({ message: 'App lock enabled', type: 'success' });
      return;
    }

    openCreatePinSheet();
  }, [lock, openCreatePinSheet, refresh, showToast]);

  const requestDisableAppLock = useCallback(() => {
    openDisablePinSheet();
  }, [openDisablePinSheet]);

  const handleAppLockToggle = useCallback(
    (enabled: boolean) => {
      if (enabled) {
        void requestEnableAppLock();
        return;
      }

      requestDisableAppLock();
    },
    [requestDisableAppLock, requestEnableAppLock],
  );

  const createPin = useCallback(
    async (pin: string) => {
      const result = await appLockService.enableWithPin(pin);
      if (result.success) {
        lock();
        showToast({ message: 'App lock enabled', type: 'success' });
      }

      refresh();
      return result;
    },
    [lock, refresh, showToast],
  );

  const changePin = useCallback(
    async (currentPin: string, nextPin: string) => {
      const result = await appLockService.changePin(currentPin, nextPin);
      if (result.success) {
        showToast({ message: 'PIN updated', type: 'success' });
      }

      refresh();
      return result;
    },
    [refresh, showToast],
  );

  const disableWithPin = useCallback(
    async (pin: string) => {
      const result = await appLockService.disableWithPin(pin);
      if (result.success) {
        showToast({ message: 'App lock disabled', type: 'success' });
      }

      refresh();
      return result;
    },
    [refresh, showToast],
  );

  const setBiometricUnlockEnabled = useCallback(
    (enabled: boolean) => {
      if (enabled && !biometricAvailable) {
        showToast({
          message: 'Biometric unlock will be available in a future update',
          type: 'info',
        });
        return;
      }

      appLockService.setBiometricUnlockEnabled(enabled);
      refresh();
    },
    [biometricAvailable, refresh, showToast],
  );

  return {
    settings,
    pinSheetVisible,
    pinSheetMode,
    biometricAvailable,
    closePinSheet,
    handleAppLockToggle,
    openChangePinSheet,
    createPin,
    changePin,
    disableWithPin,
    setBiometricUnlockEnabled,
  };
}
