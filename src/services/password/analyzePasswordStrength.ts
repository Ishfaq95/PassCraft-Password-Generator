import type { PasswordStrengthLevel } from '@/types';

import { calculateEntropy, calculateStrengthScore } from './entropy';
import {
  detectCharacterPoolSize,
  getStrengthLabel,
  getStrengthSuggestions,
} from './strength';

export type PasswordStrengthAnalysis = {
  level: PasswordStrengthLevel;
  label: string;
  entropy: number;
  poolSize: number;
  suggestions: string[];
};

export function analyzePasswordStrength(
  password: string,
): PasswordStrengthAnalysis {
  const trimmed = password.trim();

  if (!trimmed) {
    return {
      level: 0,
      label: getStrengthLabel(0),
      entropy: 0,
      poolSize: 0,
      suggestions: getStrengthSuggestions('', 0),
    };
  }

  const poolSize = detectCharacterPoolSize(trimmed);
  const entropy = calculateEntropy(trimmed.length, poolSize);
  const level = calculateStrengthScore(entropy);
  const suggestions = getStrengthSuggestions(trimmed, level);

  return {
    level,
    label: getStrengthLabel(level),
    entropy,
    poolSize,
    suggestions,
  };
}
