import type { BiometricAuthProvider } from './types';

export class StubBiometricAuthProvider implements BiometricAuthProvider {
  async isAvailable(): Promise<boolean> {
    return false;
  }

  async authenticate(): Promise<boolean> {
    return false;
  }
}
