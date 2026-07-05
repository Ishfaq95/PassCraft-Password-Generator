import type { StoredPinRecord } from '@/services/appLock/types';

export function createMockPinStorage() {
  let record: StoredPinRecord | null = null;

  return {
    savePinRecord: jest.fn(async (next: StoredPinRecord) => {
      record = next;
    }),
    getPinRecord: jest.fn(async () => record),
    removePinRecord: jest.fn(async () => {
      record = null;
    }),
  };
}
