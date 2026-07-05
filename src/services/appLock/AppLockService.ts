import type { AppSettings } from '@/services/appSettings/types';

import { createPinRecord, validatePin, verifyPinHash } from './pinHash';
import type { BiometricAuthProvider, PinStorage } from './types';

export type AppLockSettingsStore = {
  getSettings: () => AppSettings;
  setAppLockEnabled: (enabled: boolean) => void;
  setBiometricUnlockEnabled: (enabled: boolean) => void;
};

export class AppLockService {
  constructor(
    private readonly pinStorage: PinStorage,
    private readonly biometricProvider: BiometricAuthProvider,
    private readonly settingsStore: AppLockSettingsStore,
  ) {}

  isEnabled(): boolean {
    return this.settingsStore.getSettings().appLockEnabled;
  }

  isBiometricUnlockEnabled(): boolean {
    return this.settingsStore.getSettings().biometricUnlockEnabled;
  }

  async hasPin(): Promise<boolean> {
    const record = await this.pinStorage.getPinRecord();
    return record !== null;
  }

  async verifyPin(pin: string): Promise<boolean> {
    const validation = validatePin(pin);
    if (!validation.valid) {
      return false;
    }

    const record = await this.pinStorage.getPinRecord();
    if (!record) {
      return false;
    }

    return verifyPinHash(pin, record.salt, record.hash);
  }

  async setPin(
    pin: string,
  ): Promise<{ success: true } | { success: false; message: string }> {
    const validation = validatePin(pin);
    if (!validation.valid) {
      return { success: false, message: validation.message };
    }

    await this.pinStorage.savePinRecord(createPinRecord(pin));
    return { success: true };
  }

  async enableWithPin(
    pin: string,
  ): Promise<{ success: true } | { success: false; message: string }> {
    const result = await this.setPin(pin);
    if (!result.success) {
      return result;
    }

    this.settingsStore.setAppLockEnabled(true);
    return { success: true };
  }

  async disableWithPin(
    pin: string,
  ): Promise<{ success: true } | { success: false; message: string }> {
    const isValid = await this.verifyPin(pin);
    if (!isValid) {
      return { success: false, message: 'Incorrect PIN' };
    }

    this.settingsStore.setAppLockEnabled(false);
    this.settingsStore.setBiometricUnlockEnabled(false);
    await this.pinStorage.removePinRecord();
    return { success: true };
  }

  async changePin(
    currentPin: string,
    nextPin: string,
  ): Promise<{ success: true } | { success: false; message: string }> {
    const isValid = await this.verifyPin(currentPin);
    if (!isValid) {
      return { success: false, message: 'Current PIN is incorrect' };
    }

    return this.setPin(nextPin);
  }

  async canUseBiometrics(): Promise<boolean> {
    if (!this.isBiometricUnlockEnabled()) {
      return false;
    }

    return this.biometricProvider.isAvailable();
  }

  async authenticateWithBiometrics(): Promise<boolean> {
    if (!(await this.canUseBiometrics())) {
      return false;
    }

    return this.biometricProvider.authenticate('Unlock SecurePass');
  }

  setBiometricUnlockEnabled(enabled: boolean): void {
    this.settingsStore.setBiometricUnlockEnabled(enabled);
  }
}
