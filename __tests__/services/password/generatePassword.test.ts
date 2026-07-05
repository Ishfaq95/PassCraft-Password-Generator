import {
  buildCharacterPool,
  calculateEntropy,
  calculateStrengthScore,
  createSeededRandomSource,
  generatePassword,
  PASSWORD_LENGTH_MAX,
  PASSWORD_LENGTH_MIN,
  PasswordGeneratorError,
  stripAmbiguousCharacters,
} from '@/services/password';

const defaultOptions = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  avoidAmbiguous: false,
} as const;

describe('password charset', () => {
  it('removes ambiguous characters when requested', () => {
    expect(stripAmbiguousCharacters('0O1lI|abc')).toBe('abc');
  });

  it('builds a combined pool from enabled sets', () => {
    const { pool, pools } = buildCharacterPool({
      uppercase: true,
      lowercase: true,
      numbers: false,
      symbols: false,
      avoidAmbiguous: false,
    });

    expect(pools).toHaveLength(2);
    expect(pool.length).toBeGreaterThan(50);
  });

  it('builds a numbers-only pool when other sets are disabled', () => {
    const { pool, pools } = buildCharacterPool({
      uppercase: false,
      lowercase: false,
      numbers: true,
      symbols: false,
      avoidAmbiguous: false,
    });

    expect(pools).toHaveLength(1);
    expect(pool).toMatch(/^[0-9]+$/);
    expect(pool).toHaveLength(10);
  });
});

describe('entropy and strength', () => {
  it('returns zero entropy for invalid inputs', () => {
    expect(calculateEntropy(0, 62)).toBe(0);
    expect(calculateEntropy(16, 0)).toBe(0);
  });

  it('calculates entropy from length and pool size', () => {
    expect(calculateEntropy(16, 62)).toBeCloseTo(16 * Math.log2(62), 5);
  });

  it('maps entropy to strength levels at boundaries', () => {
    expect(calculateStrengthScore(0)).toBe(0);
    expect(calculateStrengthScore(27.9)).toBe(0);
    expect(calculateStrengthScore(28)).toBe(1);
    expect(calculateStrengthScore(35.9)).toBe(1);
    expect(calculateStrengthScore(36)).toBe(2);
    expect(calculateStrengthScore(59.9)).toBe(2);
    expect(calculateStrengthScore(60)).toBe(3);
    expect(calculateStrengthScore(127.9)).toBe(3);
    expect(calculateStrengthScore(128)).toBe(4);
  });
});

describe('generatePassword', () => {
  const random = createSeededRandomSource(42);

  it('generates a password with requested length', () => {
    const result = generatePassword({ ...defaultOptions, length: 20 }, random);

    expect(result.password).toHaveLength(20);
    expect(result.poolSize).toBeGreaterThan(0);
    expect(result.entropy).toBeGreaterThan(0);
    expect(result.strength).toBeGreaterThanOrEqual(0);
    expect(result.strength).toBeLessThanOrEqual(4);
  });

  it('supports minimum and maximum allowed lengths', () => {
    const minResult = generatePassword(
      { ...defaultOptions, length: PASSWORD_LENGTH_MIN },
      createSeededRandomSource(1),
    );
    const maxResult = generatePassword(
      { ...defaultOptions, length: PASSWORD_LENGTH_MAX },
      createSeededRandomSource(2),
    );

    expect(minResult.password).toHaveLength(PASSWORD_LENGTH_MIN);
    expect(maxResult.password).toHaveLength(PASSWORD_LENGTH_MAX);
  });

  it('derives strength from generated entropy', () => {
    const result = generatePassword(
      defaultOptions,
      createSeededRandomSource(55),
    );

    expect(result.strength).toBe(
      calculateStrengthScore(
        calculateEntropy(result.password.length, result.poolSize),
      ),
    );
  });

  it('includes characters from each enabled set', () => {
    const result = generatePassword(
      { ...defaultOptions, length: 32, noRepeatedCharacters: false },
      createSeededRandomSource(7),
    );

    expect(/[A-Z]/.test(result.password)).toBe(true);
    expect(/[a-z]/.test(result.password)).toBe(true);
    expect(/[0-9]/.test(result.password)).toBe(true);
    expect(/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(result.password)).toBe(true);
  });

  it('avoids ambiguous characters when enabled', () => {
    const result = generatePassword(
      { ...defaultOptions, length: 24, avoidAmbiguous: true },
      createSeededRandomSource(99),
    );

    expect(result.password).not.toMatch(/[0O1lI|]/);
  });

  it('does not repeat characters when option is enabled', () => {
    const result = generatePassword(
      { ...defaultOptions, length: 16, noRepeatedCharacters: true },
      createSeededRandomSource(15),
    );

    const uniqueChars = new Set(result.password.split(''));
    expect(uniqueChars.size).toBe(result.password.length);
  });

  it('is deterministic with a seeded random source', () => {
    const first = generatePassword(
      defaultOptions,
      createSeededRandomSource(123),
    );
    const second = generatePassword(
      defaultOptions,
      createSeededRandomSource(123),
    );

    expect(first.password).toBe(second.password);
    expect(first.entropy).toBe(second.entropy);
    expect(first.strength).toBe(second.strength);
  });

  it('throws when no character sets are enabled', () => {
    expect(() =>
      generatePassword(
        {
          ...defaultOptions,
          uppercase: false,
          lowercase: false,
          numbers: false,
          symbols: false,
        },
        random,
      ),
    ).toThrow(PasswordGeneratorError);
  });

  it('throws when length is not an integer', () => {
    expect(() =>
      generatePassword({ ...defaultOptions, length: 12.5 }, random),
    ).toThrow('Password length must be an integer.');
  });

  it('throws when length is outside the allowed range', () => {
    expect(() =>
      generatePassword(
        { ...defaultOptions, length: PASSWORD_LENGTH_MIN - 1 },
        random,
      ),
    ).toThrow(PasswordGeneratorError);

    expect(() =>
      generatePassword(
        { ...defaultOptions, length: PASSWORD_LENGTH_MAX + 1 },
        random,
      ),
    ).toThrow(PasswordGeneratorError);
  });

  it('throws when unique length exceeds pool size', () => {
    expect(() =>
      generatePassword(
        {
          length: 10,
          uppercase: false,
          lowercase: false,
          numbers: true,
          symbols: false,
          avoidAmbiguous: true,
          noRepeatedCharacters: true,
        },
        random,
      ),
    ).toThrow(PasswordGeneratorError);
  });
});
