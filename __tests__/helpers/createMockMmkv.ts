import type { MMKV } from 'react-native-mmkv';

export function createMockMmkv(): MMKV {
  const values = new Map<string, string | number | boolean>();

  return {
    set: (key: string, value: boolean | string | number | ArrayBuffer) => {
      if (value instanceof ArrayBuffer) {
        throw new Error('ArrayBuffer not supported in mock MMKV');
      }

      values.set(key, value);
    },
    getString: (key: string) => {
      const value = values.get(key);
      return typeof value === 'string' ? value : undefined;
    },
    getBoolean: (key: string) => {
      const value = values.get(key);
      return typeof value === 'boolean' ? value : undefined;
    },
    getNumber: (key: string) => {
      const value = values.get(key);
      return typeof value === 'number' ? value : undefined;
    },
    getBuffer: () => undefined,
    contains: (key: string) => values.has(key),
    remove: (key: string) => values.delete(key),
    getAllKeys: () => [...values.keys()],
    clearAll: () => values.clear(),
    trim: () => undefined,
    checkContentChanged: () => undefined,
    addOnValueChangedListener: () => ({ remove: () => undefined }),
    importAllFrom: () => 0,
    recrypt: () => undefined,
    encrypt: () => undefined,
    decrypt: () => undefined,
    id: 'mock-mmkv',
    length: 0,
    size: 0,
    byteSize: 0,
    isReadOnly: false,
    isEncrypted: false,
  } as unknown as MMKV;
}
