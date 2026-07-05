import { AppLockService } from '@/services/appLock/AppLockService';
import { StubBiometricAuthProvider } from '@/services/appLock/StubBiometricAuthProvider';
import {
  createPinRecord,
  validatePin,
  verifyPinHash,
} from '@/services/appLock/pinHash';
import { AppSettingsRepository } from '@/services/appSettings/AppSettingsRepository';

import { createMockMmkv } from '../../helpers/createMockMmkv';
import { createMockPinStorage } from '../../helpers/createMockPinStorage';

describe('pinHash', () => {
  it('validates PIN length and digits', () => {
    expect(validatePin('123')).toEqual({
      valid: false,
      message: 'PIN must be at least 4 digits',
    });
    expect(validatePin('12ab')).toEqual({
      valid: false,
      message: 'PIN must contain digits only',
    });
    expect(validatePin('1234')).toEqual({ valid: true });
  });

  it('creates and verifies a salted hash', () => {
    const record = createPinRecord('2580');
    expect(verifyPinHash('2580', record.salt, record.hash)).toBe(true);
    expect(verifyPinHash('0000', record.salt, record.hash)).toBe(false);
  });
});

describe('AppLockService', () => {
  function createService() {
    const settingsRepository = new AppSettingsRepository(createMockMmkv());
    const pinStorage = createMockPinStorage();
    const settingsStore = {
      getSettings: () => settingsRepository.getSettings(),
      setAppLockEnabled: (enabled: boolean) =>
        settingsRepository.setAppLockEnabled(enabled),
      setBiometricUnlockEnabled: (enabled: boolean) =>
        settingsRepository.setBiometricUnlockEnabled(enabled),
    };

    return {
      settingsRepository,
      pinStorage,
      service: new AppLockService(
        pinStorage,
        new StubBiometricAuthProvider(),
        settingsStore,
      ),
    };
  }

  it('enables app lock with a PIN and verifies it', async () => {
    const { service } = createService();

    const result = await service.enableWithPin('4321');
    expect(result).toEqual({ success: true });
    expect(service.isEnabled()).toBe(true);
    expect(await service.verifyPin('4321')).toBe(true);
    expect(await service.verifyPin('1111')).toBe(false);
  });

  it('disables app lock after verifying the PIN', async () => {
    const { service, pinStorage } = createService();

    await service.enableWithPin('9876');
    const result = await service.disableWithPin('9876');

    expect(result).toEqual({ success: true });
    expect(service.isEnabled()).toBe(false);
    expect(await service.hasPin()).toBe(false);
    expect(pinStorage.removePinRecord).toHaveBeenCalled();
  });

  it('changes the PIN after verifying the current one', async () => {
    const { service } = createService();

    await service.enableWithPin('1111');
    const result = await service.changePin('1111', '2222');

    expect(result).toEqual({ success: true });
    expect(await service.verifyPin('2222')).toBe(true);
    expect(await service.verifyPin('1111')).toBe(false);
  });
});
