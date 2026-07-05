import { buildCharacterPool } from './charset';
import { calculateEntropy, calculateStrengthScore } from './entropy';
import type {
  GeneratedPassword,
  PasswordGeneratorOptions,
  RandomSource,
} from './types';
import { PASSWORD_LENGTH_MAX, PASSWORD_LENGTH_MIN } from './types';

export class PasswordGeneratorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PasswordGeneratorError';
  }
}

function randomIndex(max: number, random: RandomSource): number {
  if (max <= 0) {
    throw new PasswordGeneratorError('Random range must be greater than zero.');
  }

  const range = 0x1_0000_0000;
  const limit = range - (range % max);

  let value = random.nextUint32();
  while (value >= limit) {
    value = random.nextUint32();
  }

  return value % max;
}

function pickCharacter(pool: string, random: RandomSource): string {
  return pool[randomIndex(pool.length, random)];
}

function shuffle<T>(items: T[], random: RandomSource): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1, random);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

function validateOptions(
  options: PasswordGeneratorOptions,
  poolSize: number,
): void {
  const { length, uppercase, lowercase, numbers, symbols } = options;

  if (!Number.isInteger(length)) {
    throw new PasswordGeneratorError('Password length must be an integer.');
  }

  if (length < PASSWORD_LENGTH_MIN || length > PASSWORD_LENGTH_MAX) {
    throw new PasswordGeneratorError(
      `Password length must be between ${PASSWORD_LENGTH_MIN} and ${PASSWORD_LENGTH_MAX}.`,
    );
  }

  if (!uppercase && !lowercase && !numbers && !symbols) {
    throw new PasswordGeneratorError(
      'At least one character set must be enabled.',
    );
  }

  if (poolSize === 0) {
    throw new PasswordGeneratorError(
      'Character pool is empty after applying options.',
    );
  }

  if (options.noRepeatedCharacters && length > poolSize) {
    throw new PasswordGeneratorError(
      'Password length exceeds available unique characters for the selected options.',
    );
  }
}

function buildRequiredCharacters(
  pools: string[],
  random: RandomSource,
): string[] {
  return pools.map(pool => pickCharacter(pool, random));
}

function buildPasswordCharacters(
  options: PasswordGeneratorOptions,
  pool: string,
  pools: string[],
  random: RandomSource,
): string[] {
  const required = buildRequiredCharacters(pools, random);
  const remainingLength = options.length - required.length;

  if (options.noRepeatedCharacters) {
    const available = [...new Set(pool.split(''))].filter(
      char => !required.includes(char),
    );
    const uniqueFill = shuffle(available, random).slice(0, remainingLength);

    if (uniqueFill.length < remainingLength) {
      throw new PasswordGeneratorError(
        'Not enough unique characters available to satisfy password length.',
      );
    }

    return shuffle([...required, ...uniqueFill], random);
  }

  const filler = Array.from({ length: remainingLength }, () =>
    pickCharacter(pool, random),
  );

  return shuffle([...required, ...filler], random);
}

export function generatePassword(
  options: PasswordGeneratorOptions,
  random: RandomSource,
): GeneratedPassword {
  const { pool, pools } = buildCharacterPool(options);

  validateOptions(options, pool.length);

  const password = buildPasswordCharacters(options, pool, pools, random).join(
    '',
  );
  const entropy = calculateEntropy(password.length, pool.length);
  const strength = calculateStrengthScore(entropy);

  return {
    password,
    entropy,
    strength,
    poolSize: pool.length,
  };
}

type CryptoRandom = {
  getRandomValues: (array: Uint32Array) => Uint32Array;
};

export function createCryptoRandomSource(): RandomSource {
  const cryptoApi = (
    globalThis as typeof globalThis & {
      crypto?: CryptoRandom;
    }
  ).crypto;

  if (!cryptoApi?.getRandomValues) {
    throw new PasswordGeneratorError(
      'Cryptographic random source is unavailable.',
    );
  }

  return {
    nextUint32: () => {
      const buffer = new Uint32Array(1);
      cryptoApi.getRandomValues(buffer);
      return buffer[0];
    },
  };
}

export function createSeededRandomSource(seed: number): RandomSource {
  let state = seed >>> 0;

  return {
    nextUint32: () => {
      state = (state * 1_664_525 + 1_013_904_223) >>> 0;
      return state;
    },
  };
}

export function generatePasswordWithCrypto(
  options: PasswordGeneratorOptions,
): GeneratedPassword {
  return generatePassword(options, createCryptoRandomSource());
}
