import { AppError } from '@/errors';
import type { PasswordRepository } from '@/repositories/password';
import type { SavePasswordInput, StoredPassword } from '@/types';
import {
  normalizePasswordEmail,
  normalizePasswordTitle,
  validatePasswordEmail,
  validatePasswordTitle,
} from '@/utils/passwordDetails';

import { createPasswordId } from './createPasswordId';

export class PasswordStorageService {
  constructor(private readonly repository: PasswordRepository) {}

  savePassword(input: SavePasswordInput): StoredPassword {
    const title = normalizePasswordTitle(input.title);
    const titleError = validatePasswordTitle(title);

    if (titleError) {
      throw AppError.generator(titleError);
    }

    const email = normalizePasswordEmail(input.email ?? '');
    const emailError = email ? validatePasswordEmail(email) : undefined;

    if (emailError) {
      throw AppError.generator(emailError);
    }

    const storedPassword: StoredPassword = {
      id: createPasswordId(),
      password: input.password,
      title,
      username: email,
      website: input.website,
      strength: input.strength,
      isFavorite: input.isFavorite ?? false,
      length: input.length ?? input.password.length,
      createdAt: Date.now(),
    };

    this.repository.save(storedPassword);
    return storedPassword;
  }

  getPasswords(): StoredPassword[] {
    return this.repository.getAll();
  }

  getFavorites(): StoredPassword[] {
    return this.repository.getAll().filter(password => password.isFavorite);
  }

  favoritePassword(id: string): StoredPassword | null {
    return this.repository.setFavorite(id, true);
  }

  removeFavorite(id: string): StoredPassword | null {
    return this.repository.setFavorite(id, false);
  }

  deletePassword(id: string): StoredPassword | null {
    const password = this.repository.getAll().find(item => item.id === id);

    if (!password) {
      return null;
    }

    const deleted = this.repository.deleteById(id);
    return deleted ? password : null;
  }

  restorePassword(password: StoredPassword): void {
    this.repository.save(password);
  }

  restorePasswords(passwords: StoredPassword[]): void {
    for (const password of passwords) {
      this.repository.save(password);
    }
  }

  clearHistory(): StoredPassword[] {
    const removed = this.repository
      .getAll()
      .filter(password => !password.isFavorite);

    this.repository.clearHistory();
    return removed;
  }
}
