import type { PasswordStrengthLevel } from '@/types';

export const STRENGTH_LABELS = [
  'Very Weak',
  'Weak',
  'Medium',
  'Strong',
  'Very Strong',
] as const;

export type StrengthLabel = (typeof STRENGTH_LABELS)[number];

export function getStrengthLabel(level: PasswordStrengthLevel): StrengthLabel {
  return STRENGTH_LABELS[level];
}

export function detectCharacterPoolSize(password: string): number {
  let poolSize = 0;

  if (/[a-z]/.test(password)) {
    poolSize += 26;
  }
  if (/[A-Z]/.test(password)) {
    poolSize += 26;
  }
  if (/[0-9]/.test(password)) {
    poolSize += 10;
  }
  if (/[^a-zA-Z0-9]/.test(password)) {
    poolSize += 32;
  }

  return poolSize;
}

export function hasRepeatedCharacters(password: string): boolean {
  return /(.)\1{2,}/.test(password);
}

export function hasSequentialPattern(password: string): boolean {
  const lower = password.toLowerCase();
  const sequences = ['0123456789', 'abcdefghijklmnopqrstuvwxyz', 'qwertyuiop'];

  return sequences.some(sequence => {
    for (let index = 0; index <= sequence.length - 4; index += 1) {
      const chunk = sequence.slice(index, index + 4);
      if (
        lower.includes(chunk) ||
        lower.includes([...chunk].reverse().join(''))
      ) {
        return true;
      }
    }
    return false;
  });
}

export function getStrengthSuggestions(
  password: string,
  level: PasswordStrengthLevel,
): string[] {
  if (!password) {
    return ['Enter a password to analyze its strength.'];
  }

  const suggestions: string[] = [];

  if (password.length < 8) {
    suggestions.push('Use at least 8 characters.');
  } else if (password.length < 12) {
    suggestions.push('Use at least 12 characters for better security.');
  } else if (password.length < 16) {
    suggestions.push('Increase length to 16 or more characters.');
  }

  if (!/[a-z]/.test(password)) {
    suggestions.push('Add lowercase letters.');
  }

  if (!/[A-Z]/.test(password)) {
    suggestions.push('Add uppercase letters.');
  }

  if (!/[0-9]/.test(password)) {
    suggestions.push('Add numbers.');
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    suggestions.push('Add special characters.');
  }

  if (hasRepeatedCharacters(password)) {
    suggestions.push('Avoid repeating the same character multiple times.');
  }

  if (hasSequentialPattern(password)) {
    suggestions.push('Avoid sequential or keyboard patterns.');
  }

  if (/^(password|admin|letmein|welcome)$/i.test(password)) {
    suggestions.push('Avoid common and easily guessed passwords.');
  }

  if (level >= 3 && suggestions.length === 0) {
    return [];
  }

  if (suggestions.length === 0 && level < 3) {
    suggestions.push('Combine length with mixed character types.');
  }

  return suggestions;
}
