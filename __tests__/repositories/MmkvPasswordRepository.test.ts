import { MmkvPasswordRepository } from '@/repositories/password/MmkvPasswordRepository';
import { PASSWORDS_STORAGE_KEY } from '@/repositories/password/constants';
import { AppError } from '@/errors';
import type { StoredPassword } from '@/types';

import { createMockMmkv } from '../helpers/createMockMmkv';

function createPassword(
  overrides: Partial<StoredPassword> = {},
): StoredPassword {
  return {
    id: overrides.id ?? 'password-id',
    password: overrides.password ?? 'secret',
    createdAt: overrides.createdAt ?? Date.now(),
    ...overrides,
  };
}

describe('MmkvPasswordRepository', () => {
  function createRepository(storageKey = PASSWORDS_STORAGE_KEY) {
    return new MmkvPasswordRepository(createMockMmkv(), storageKey);
  }

  it('returns an empty list when storage is empty', () => {
    const repository = createRepository();

    expect(repository.getAll()).toEqual([]);
  });

  it('saves and retrieves passwords', () => {
    const repository = createRepository();
    const password = createPassword({ id: '1', password: 'alpha' });

    repository.save(password);

    expect(repository.getAll()).toEqual([password]);
  });

  it('updates an existing password by id', () => {
    const repository = createRepository();
    const original = createPassword({
      id: '1',
      password: 'old-password',
      createdAt: 100,
    });
    const updated = createPassword({
      id: '1',
      password: 'new-password',
      createdAt: 200,
      isFavorite: true,
    });

    repository.save(original);
    repository.save(updated);

    expect(repository.getAll()).toEqual([updated]);
  });

  it('returns passwords sorted by newest first', () => {
    const repository = createRepository();

    repository.save(createPassword({ id: 'older', createdAt: 1 }));
    repository.save(createPassword({ id: 'newer', createdAt: 2 }));

    expect(repository.getAll().map(item => item.id)).toEqual([
      'newer',
      'older',
    ]);
  });

  it('deletes a password by id', () => {
    const repository = createRepository();
    repository.save(createPassword({ id: '1' }));

    expect(repository.deleteById('1')).toBe(true);
    expect(repository.getAll()).toEqual([]);
  });

  it('returns false when deleting a missing password', () => {
    const repository = createRepository();

    expect(repository.deleteById('missing')).toBe(false);
  });

  it('favorites and unfavorites passwords', () => {
    const repository = createRepository();
    repository.save(createPassword({ id: '1', isFavorite: false }));

    const favorited = repository.setFavorite('1', true);
    expect(favorited?.isFavorite).toBe(true);
    expect(repository.getAll()[0].isFavorite).toBe(true);

    const unfavorited = repository.setFavorite('1', false);
    expect(unfavorited?.isFavorite).toBe(false);
    expect(repository.getAll()[0].isFavorite).toBe(false);
  });

  it('returns null when favoriting a missing password', () => {
    const repository = createRepository();

    expect(repository.setFavorite('missing', true)).toBeNull();
  });

  it('clears history while keeping favorites', () => {
    const repository = createRepository();

    repository.save(createPassword({ id: 'history-1', isFavorite: false }));
    repository.save(createPassword({ id: 'history-2', isFavorite: false }));
    repository.save(createPassword({ id: 'favorite-1', isFavorite: true }));

    repository.clearHistory();

    expect(repository.getAll()).toEqual([
      createPassword({ id: 'favorite-1', isFavorite: true }),
    ]);
  });

  it('ignores corrupt stored JSON', () => {
    const mmkv = createMockMmkv();
    const repository = new MmkvPasswordRepository(mmkv);

    mmkv.set(PASSWORDS_STORAGE_KEY, '{not-json');

    expect(repository.getAll()).toEqual([]);
  });

  it('filters invalid password records', () => {
    const mmkv = createMockMmkv();
    const repository = new MmkvPasswordRepository(mmkv);

    mmkv.set(
      PASSWORDS_STORAGE_KEY,
      JSON.stringify([
        { id: 'valid', password: 'ok', createdAt: 1 },
        { id: 123, password: 'bad-id' },
        { password: 'missing-id', createdAt: 2 },
        null,
      ]),
    );

    expect(repository.getAll()).toEqual([
      { id: 'valid', password: 'ok', createdAt: 1 },
    ]);
  });

  it('uses a custom storage key when provided', () => {
    const mmkv = createMockMmkv();
    const repository = new MmkvPasswordRepository(mmkv, 'custom.history');

    repository.save(createPassword({ id: '1', password: 'scoped' }));

    expect(mmkv.getString('custom.history')).toContain('scoped');
    expect(mmkv.getString(PASSWORDS_STORAGE_KEY)).toBeUndefined();
  });

  it('throws AppError when writing passwords fails', () => {
    const mmkv = createMockMmkv();
    const repository = new MmkvPasswordRepository(mmkv);

    jest.spyOn(mmkv, 'set').mockImplementation(() => {
      throw new Error('disk full');
    });

    expect(() => repository.save(createPassword({ id: '1' }))).toThrow(
      AppError,
    );

    try {
      repository.save(createPassword({ id: '2' }));
    } catch (error) {
      expect(error).toMatchObject({
        code: 'STORAGE_WRITE_FAILED',
        category: 'storage',
      });
      expect((error as AppError).friendlyMessage).toBe(
        'We could not save your password. Please try again.',
      );
    }
  });

  it('throws AppError when reading passwords fails', () => {
    const mmkv = createMockMmkv();
    const repository = new MmkvPasswordRepository(mmkv);

    jest.spyOn(mmkv, 'getString').mockImplementation(() => {
      throw new Error('read failed');
    });

    expect(() => repository.getAll()).toThrow(AppError);

    try {
      repository.getAll();
    } catch (error) {
      expect(error).toMatchObject({
        code: 'STORAGE_READ_FAILED',
        category: 'storage',
      });
    }
  });
});
