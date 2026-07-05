import type { PasswordStrengthLevel } from './password';

export type StoredPassword = {
  id: string;
  password: string;
  title?: string;
  username?: string;
  website?: string;
  strength?: PasswordStrengthLevel;
  isFavorite?: boolean;
  length?: number;
  createdAt: number;
};

export type SavePasswordInput = {
  password: string;
  title: string;
  /** Optional account email, stored as `username` for compatibility. */
  email?: string;
  website?: string;
  strength?: PasswordStrengthLevel;
  isFavorite?: boolean;
  length?: number;
};
