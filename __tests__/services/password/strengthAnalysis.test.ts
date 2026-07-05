import {
  analyzePasswordStrength,
  detectCharacterPoolSize,
  getStrengthLabel,
  getStrengthSuggestions,
  hasRepeatedCharacters,
  hasSequentialPattern,
  STRENGTH_LABELS,
} from '@/services/password';

describe('password strength analysis', () => {
  it('exposes the expected strength labels', () => {
    expect(STRENGTH_LABELS).toEqual([
      'Very Weak',
      'Weak',
      'Medium',
      'Strong',
      'Very Strong',
    ]);
  });

  it('analyzes an empty password as very weak', () => {
    const result = analyzePasswordStrength('');

    expect(result.level).toBe(0);
    expect(result.label).toBe('Very Weak');
    expect(result.entropy).toBe(0);
    expect(result.poolSize).toBe(0);
    expect(result.suggestions).toEqual([
      'Enter a password to analyze its strength.',
    ]);
  });

  it('trims whitespace before analysis', () => {
    const result = analyzePasswordStrength('  abc123  ');

    expect(result.poolSize).toBeGreaterThan(0);
    expect(result.entropy).toBeGreaterThan(0);
  });

  it('analyzes a strong mixed password highly', () => {
    const result = analyzePasswordStrength('K9#mPx2$vLq@4nRw!');

    expect(result.level).toBeGreaterThanOrEqual(3);
    expect(result.label).toMatch(/Strong|Very Strong/);
    expect(result.entropy).toBeGreaterThan(60);
    expect(result.poolSize).toBe(94);
  });

  it('rates numeric-only passwords as weak', () => {
    const result = analyzePasswordStrength('12345678');

    expect(result.level).toBeLessThanOrEqual(2);
    expect(result.poolSize).toBe(10);
  });

  it('rates lowercase-only passwords as weak', () => {
    const result = analyzePasswordStrength('abcdefgh');

    expect(result.level).toBeLessThanOrEqual(2);
    expect(result.poolSize).toBe(26);
  });

  it('detects character pool size from mixed types', () => {
    expect(detectCharacterPoolSize('abc')).toBe(26);
    expect(detectCharacterPoolSize('ABC')).toBe(26);
    expect(detectCharacterPoolSize('123')).toBe(10);
    expect(detectCharacterPoolSize('!@#')).toBe(32);
    expect(detectCharacterPoolSize('Aa1!')).toBe(94);
  });

  it('detects repeated characters', () => {
    expect(hasRepeatedCharacters('abc')).toBe(false);
    expect(hasRepeatedCharacters('aaabbb')).toBe(true);
  });

  it('detects sequential and keyboard patterns', () => {
    expect(hasSequentialPattern('abcdef')).toBe(true);
    expect(hasSequentialPattern('fedcba')).toBe(true);
    expect(hasSequentialPattern('1234')).toBe(true);
    expect(hasSequentialPattern('qwerty')).toBe(true);
    expect(hasSequentialPattern('K9#mPx2$')).toBe(false);
  });

  it('suggests improvements for a weak password', () => {
    const suggestions = getStrengthSuggestions('abc', 0);

    expect(suggestions).toEqual(
      expect.arrayContaining([
        'Use at least 8 characters.',
        'Add uppercase letters.',
        'Add numbers.',
        'Add special characters.',
      ]),
    );
  });

  it('suggests avoiding common passwords', () => {
    const suggestions = getStrengthSuggestions('password', 0);

    expect(suggestions).toContain('Avoid common and easily guessed passwords.');
  });

  it('suggests longer length for medium passwords', () => {
    const suggestions = getStrengthSuggestions('Abcdefgh1!Xy', 2);

    expect(suggestions).toContain('Increase length to 16 or more characters.');
  });

  it('returns no suggestions for a strong password', () => {
    const suggestions = getStrengthSuggestions('K9#mPx2$vLq@4nRw!', 4);

    expect(suggestions).toHaveLength(0);
  });

  it('maps levels to labels', () => {
    expect(getStrengthLabel(0)).toBe('Very Weak');
    expect(getStrengthLabel(2)).toBe('Medium');
    expect(getStrengthLabel(4)).toBe('Very Strong');
  });
});
