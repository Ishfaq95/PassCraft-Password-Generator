import type { StoredPassword } from '@/types';

export interface PasswordRepository {
  save(password: StoredPassword): void;
  getAll(): StoredPassword[];
  deleteById(id: string): boolean;
  setFavorite(id: string, isFavorite: boolean): StoredPassword | null;
  clearHistory(): void;
}
