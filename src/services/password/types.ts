import type { PasswordStrengthLevel } from '@/types';

export type PasswordGeneratorOptions = {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  avoidAmbiguous: boolean;
  noRepeatedCharacters?: boolean;
};

export type GeneratedPassword = {
  password: string;
  entropy: number;
  strength: PasswordStrengthLevel;
  poolSize: number;
};

export type RandomSource = {
  nextUint32: () => number;
};

export const PASSWORD_LENGTH_MIN = 8;
export const PASSWORD_LENGTH_MAX = 64;
