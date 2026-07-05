import * as Keychain from 'react-native-keychain';

import { APP_LOCK_KEYCHAIN_SERVICE } from './constants';
import type { PinStorage, StoredPinRecord } from './types';

const KEYCHAIN_USERNAME = 'securepass-pin';

function parsePinRecord(raw: string): StoredPinRecord | null {
  try {
    const parsed: unknown = JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof (parsed as StoredPinRecord).salt !== 'string' ||
      typeof (parsed as StoredPinRecord).hash !== 'string'
    ) {
      return null;
    }

    return parsed as StoredPinRecord;
  } catch {
    return null;
  }
}

export class KeychainPinRepository implements PinStorage {
  async savePinRecord(record: StoredPinRecord): Promise<void> {
    await Keychain.setGenericPassword(
      KEYCHAIN_USERNAME,
      JSON.stringify(record),
      {
        service: APP_LOCK_KEYCHAIN_SERVICE,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      },
    );
  }

  async getPinRecord(): Promise<StoredPinRecord | null> {
    const credentials = await Keychain.getGenericPassword({
      service: APP_LOCK_KEYCHAIN_SERVICE,
    });

    if (!credentials || typeof credentials.password !== 'string') {
      return null;
    }

    return parsePinRecord(credentials.password);
  }

  async removePinRecord(): Promise<void> {
    await Keychain.resetGenericPassword({
      service: APP_LOCK_KEYCHAIN_SERVICE,
    });
  }
}
