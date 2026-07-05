import { PIN_LENGTH_REGEX, PIN_MAX_LENGTH, PIN_MIN_LENGTH } from './constants';
import type { PinValidationResult } from './types';

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

function encodePinWithSalt(pin: string, salt: Uint8Array): Uint8Array {
  const pinBytes = new Uint8Array(pin.length);
  for (let index = 0; index < pin.length; index += 1) {
    pinBytes[index] = pin.charCodeAt(index);
  }

  const payload = new Uint8Array(pinBytes.length + salt.length);
  payload.set(pinBytes, 0);
  payload.set(salt, pinBytes.length);
  return payload;
}

function sha256(message: Uint8Array): Uint8Array {
  const K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
    0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
    0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
    0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ]);

  const H = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
    0x1f83d9ab, 0x5be0cd19,
  ]);

  const bitLength = message.length * 8;
  const withPadding = new Uint8Array(((message.length + 9 + 63) >> 6) << 6);
  withPadding.set(message);
  withPadding[message.length] = 0x80;

  const view = new DataView(withPadding.buffer);
  view.setUint32(withPadding.length - 4, bitLength, false);

  const W = new Uint32Array(64);

  for (let offset = 0; offset < withPadding.length; offset += 64) {
    for (let i = 0; i < 16; i += 1) {
      W[i] = view.getUint32(offset + i * 4, false);
    }

    for (let i = 16; i < 64; i += 1) {
      const s0 =
        rightRotate(W[i - 15], 7) ^
        rightRotate(W[i - 15], 18) ^
        (W[i - 15] >>> 3);
      const s1 =
        rightRotate(W[i - 2], 17) ^
        rightRotate(W[i - 2], 19) ^
        (W[i - 2] >>> 10);
      W[i] = (W[i - 16] + s0 + W[i - 7] + s1) >>> 0;
    }

    let a = H[0];
    let b = H[1];
    let c = H[2];
    let d = H[3];
    let e = H[4];
    let f = H[5];
    let g = H[6];
    let h = H[7];

    for (let i = 0; i < 64; i += 1) {
      const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[i] + W[i]) >>> 0;
      const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    H[0] = (H[0] + a) >>> 0;
    H[1] = (H[1] + b) >>> 0;
    H[2] = (H[2] + c) >>> 0;
    H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0;
    H[5] = (H[5] + f) >>> 0;
    H[6] = (H[6] + g) >>> 0;
    H[7] = (H[7] + h) >>> 0;
  }

  const digest = new Uint8Array(32);
  const digestView = new DataView(digest.buffer);
  for (let i = 0; i < 8; i += 1) {
    digestView.setUint32(i * 4, H[i], false);
  }

  return digest;
}

function rightRotate(value: number, amount: number): number {
  return (value >>> amount) | (value << (32 - amount));
}

function getRandomValues(buffer: Uint8Array): Uint8Array {
  const cryptoObject = (
    globalThis as {
      crypto?: { getRandomValues: (bytes: Uint8Array) => Uint8Array };
    }
  ).crypto;

  if (!cryptoObject?.getRandomValues) {
    throw new Error('Secure random values are unavailable');
  }

  return cryptoObject.getRandomValues(buffer);
}

export function createSalt(byteLength = 16): Uint8Array {
  const salt = new Uint8Array(byteLength);
  getRandomValues(salt);
  return salt;
}

export function hashPin(pin: string, salt: Uint8Array): string {
  return bytesToHex(sha256(encodePinWithSalt(pin, salt)));
}

export function validatePin(pin: string): PinValidationResult {
  if (!PIN_LENGTH_REGEX.test(pin)) {
    return { valid: false, message: 'PIN must contain digits only' };
  }

  if (pin.length < PIN_MIN_LENGTH) {
    return {
      valid: false,
      message: `PIN must be at least ${PIN_MIN_LENGTH} digits`,
    };
  }

  if (pin.length > PIN_MAX_LENGTH) {
    return {
      valid: false,
      message: `PIN must be at most ${PIN_MAX_LENGTH} digits`,
    };
  }

  return { valid: true };
}

export function verifyPinHash(
  pin: string,
  saltHex: string,
  expectedHash: string,
): boolean {
  const validation = validatePin(pin);
  if (!validation.valid) {
    return false;
  }

  const salt = hexToBytes(saltHex);
  return hashPin(pin, salt) === expectedHash;
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

export function createPinRecord(pin: string): { salt: string; hash: string } {
  const salt = createSalt();
  return {
    salt: bytesToHex(salt),
    hash: hashPin(pin, salt),
  };
}
