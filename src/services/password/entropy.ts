import type { PasswordStrengthLevel } from '@/types';

export function calculateEntropy(length: number, poolSize: number): number {
  if (length <= 0 || poolSize <= 0) {
    return 0;
  }

  return length * Math.log2(poolSize);
}

export function calculateStrengthScore(entropy: number): PasswordStrengthLevel {
  if (entropy < 28) {
    return 0;
  }
  if (entropy < 36) {
    return 1;
  }
  if (entropy < 60) {
    return 2;
  }
  if (entropy < 128) {
    return 3;
  }
  return 4;
}
