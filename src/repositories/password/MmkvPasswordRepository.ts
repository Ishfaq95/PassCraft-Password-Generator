import type { MMKV } from 'react-native-mmkv';

import { AppError } from '@/errors';
import type { StoredPassword } from '@/types';

import { PASSWORDS_STORAGE_KEY } from './constants';
import type { PasswordRepository } from './PasswordRepository';

function parsePasswords(raw: string | undefined): StoredPassword[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isStoredPassword);
  } catch {
    return [];
  }
}

function isStoredPassword(value: unknown): value is StoredPassword {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.id === 'string' &&
    typeof record.password === 'string' &&
    typeof record.createdAt === 'number'
  );
}

function sortByNewest(passwords: StoredPassword[]): StoredPassword[] {
  return [...passwords].sort((left, right) => right.createdAt - left.createdAt);
}

export class MmkvPasswordRepository implements PasswordRepository {
  constructor(
    private readonly mmkv: MMKV,
    private readonly storageKey: string = PASSWORDS_STORAGE_KEY,
  ) {}

  private readPasswords(): StoredPassword[] {
    try {
      return parsePasswords(this.mmkv.getString(this.storageKey));
    } catch (cause) {
      throw AppError.storageRead(cause);
    }
  }

  private writePasswords(passwords: StoredPassword[]): void {
    try {
      this.mmkv.set(this.storageKey, JSON.stringify(passwords));
    } catch (cause) {
      throw AppError.storageWrite(cause);
    }
  }

  save(password: StoredPassword): void {
    const passwords = this.readPasswords();
    const existingIndex = passwords.findIndex(item => item.id === password.id);

    if (existingIndex >= 0) {
      passwords[existingIndex] = password;
    } else {
      passwords.push(password);
    }

    this.writePasswords(passwords);
  }

  getAll(): StoredPassword[] {
    return sortByNewest(this.readPasswords());
  }

  deleteById(id: string): boolean {
    const passwords = this.readPasswords();
    const nextPasswords = passwords.filter(item => item.id !== id);

    if (nextPasswords.length === passwords.length) {
      return false;
    }

    this.writePasswords(nextPasswords);
    return true;
  }

  setFavorite(id: string, isFavorite: boolean): StoredPassword | null {
    const passwords = this.readPasswords();
    const index = passwords.findIndex(item => item.id === id);

    if (index < 0) {
      return null;
    }

    const updated: StoredPassword = {
      ...passwords[index],
      isFavorite,
    };

    passwords[index] = updated;
    this.writePasswords(passwords);
    return updated;
  }

  clearHistory(): void {
    const favorites = this.readPasswords().filter(item => item.isFavorite);
    this.writePasswords(favorites);
  }
}
