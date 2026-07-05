export type StoredPinRecord = {
  salt: string;
  hash: string;
};

export type PinValidationResult =
  | { valid: true }
  | { valid: false; message: string };

export type BiometricAuthProvider = {
  isAvailable: () => Promise<boolean>;
  authenticate: (reason: string) => Promise<boolean>;
};

export type PinStorage = {
  savePinRecord: (record: StoredPinRecord) => Promise<void>;
  getPinRecord: () => Promise<StoredPinRecord | null>;
  removePinRecord: () => Promise<void>;
};
