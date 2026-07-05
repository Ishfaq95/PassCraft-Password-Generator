export {
  APP_LOCK_KEYCHAIN_SERVICE,
  PIN_MAX_LENGTH,
  PIN_MIN_LENGTH,
} from './constants';
export { AppLockService } from './AppLockService';
export { KeychainPinRepository } from './KeychainPinRepository';
export {
  createPinRecord,
  hashPin,
  validatePin,
  verifyPinHash,
} from './pinHash';
export { StubBiometricAuthProvider } from './StubBiometricAuthProvider';
export type { AppLockSettingsStore } from './AppLockService';
export type {
  BiometricAuthProvider,
  PinStorage,
  PinValidationResult,
  StoredPinRecord,
} from './types';

import { appSettingsService } from '@/services/appSettings';

import { AppLockService } from './AppLockService';
import { KeychainPinRepository } from './KeychainPinRepository';
import { StubBiometricAuthProvider } from './StubBiometricAuthProvider';

const pinStorage = new KeychainPinRepository();
const biometricProvider = new StubBiometricAuthProvider();

export const appLockService = new AppLockService(
  pinStorage,
  biometricProvider,
  appSettingsService,
);
