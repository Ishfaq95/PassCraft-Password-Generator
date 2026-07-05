import { MmkvPasswordRepository } from '@/repositories/password';
import { AppError } from '@/errors';
import { PasswordStorageService } from '@/services/passwordStorage/PasswordStorageService';

import { createMockMmkv } from '../../helpers/createMockMmkv';

describe('PasswordStorageService', () => {
  function createService() {
    const mmkv = createMockMmkv();
    const repository = new MmkvPasswordRepository(mmkv);
    return {
      mmkv,
      repository,
      service: new PasswordStorageService(repository),
    };
  }

  it('saves and retrieves passwords', () => {
    const { service } = createService();

    const saved = service.savePassword({
      password: 'Tr9#kL2$mNx@7pQw',
      title: 'Gmail',
      email: 'alex@email.com',
      strength: 4,
    });

    expect(saved.id).toBeTruthy();
    expect(saved.password).toBe('Tr9#kL2$mNx@7pQw');
    expect(saved.title).toBe('Gmail');
    expect(saved.username).toBe('alex@email.com');
    expect(saved.strength).toBe(4);
    expect(saved.isFavorite).toBe(false);
    expect(saved.length).toBe(16);
    expect(saved.createdAt).toBeGreaterThan(0);

    const passwords = service.getPasswords();
    expect(passwords).toHaveLength(1);
    expect(passwords[0]).toEqual(saved);
  });

  it('defaults optional fields when saving', () => {
    const { service } = createService();

    const saved = service.savePassword({
      password: 'short',
      title: 'Test account',
    });

    expect(saved.isFavorite).toBe(false);
    expect(saved.length).toBe(5);
    expect(saved.title).toBe('Test account');
    expect(saved.username).toBeUndefined();
    expect(saved.website).toBeUndefined();
    expect(saved.strength).toBeUndefined();
  });

  it('requires a non-empty title', () => {
    const { service } = createService();

    expect(() =>
      service.savePassword({
        password: 'short',
        title: '   ',
      }),
    ).toThrow(AppError);
  });

  it('rejects invalid email addresses', () => {
    const { service } = createService();

    expect(() =>
      service.savePassword({
        password: 'short',
        title: 'Gmail',
        email: 'not-an-email',
      }),
    ).toThrow(AppError);
  });

  it('generates unique ids for each saved password', () => {
    const { service } = createService();

    const first = service.savePassword({ password: 'one', title: 'First' });
    const second = service.savePassword({ password: 'two', title: 'Second' });

    expect(first.id).not.toBe(second.id);
  });

  it('returns passwords sorted by newest first', () => {
    const { repository, service } = createService();

    repository.save({
      id: 'older',
      password: 'older-password',
      createdAt: 1,
    });
    repository.save({
      id: 'newer',
      password: 'newer-password',
      createdAt: 2,
    });

    const [first, second] = service.getPasswords();

    expect(first.id).toBe('newer');
    expect(second.id).toBe('older');
  });

  it('deletes a password by id', () => {
    const { service } = createService();

    const saved = service.savePassword({
      password: 'delete-me',
      title: 'Delete me',
    });

    expect(service.deletePassword(saved.id)).toEqual(saved);
    expect(service.getPasswords()).toHaveLength(0);
    expect(service.deletePassword('missing-id')).toBeNull();
  });

  it('restores deleted passwords', () => {
    const { service } = createService();
    const saved = service.savePassword({
      password: 'restore-me',
      title: 'Restore me',
    });

    const removed = service.deletePassword(saved.id);
    expect(removed).toEqual(saved);
    expect(service.getPasswords()).toHaveLength(0);

    service.restorePassword(saved);
    expect(service.getPasswords()).toHaveLength(1);
    expect(service.getPasswords()[0]).toEqual(saved);
  });

  it('restores multiple cleared passwords', () => {
    const { service } = createService();

    const first = service.savePassword({ password: 'one', title: 'One' });
    const second = service.savePassword({ password: 'two', title: 'Two' });
    const removed = service.clearHistory();

    expect(removed).toHaveLength(2);
    expect(service.getPasswords()).toHaveLength(0);

    service.restorePasswords(removed);

    expect(service.getPasswords()).toHaveLength(2);
    expect(
      service
        .getPasswords()
        .map(item => item.id)
        .sort(),
    ).toEqual([first.id, second.id].sort());
  });

  it('clears history while keeping favorites', () => {
    const { service } = createService();

    service.savePassword({ password: 'history-1', title: 'History 1' });
    service.savePassword({ password: 'history-2', title: 'History 2' });
    service.savePassword({
      password: 'favorite-1',
      title: 'Banking',
      isFavorite: true,
    });

    const removed = service.clearHistory();

    expect(removed).toHaveLength(2);
    const passwords = service.getPasswords();
    expect(passwords).toHaveLength(1);
    expect(passwords[0].password).toBe('favorite-1');
    expect(passwords[0].isFavorite).toBe(true);
  });

  it('returns only favorites from getFavorites', () => {
    const { service } = createService();

    const favorite = service.savePassword({
      password: 'starred',
      title: 'Starred',
      isFavorite: true,
    });
    service.savePassword({ password: 'plain', title: 'Plain' });

    expect(service.getFavorites()).toEqual([favorite]);
  });

  it('favorites and unfavorites passwords', () => {
    const { service } = createService();

    const saved = service.savePassword({
      password: 'star-me',
      title: 'Star me',
    });

    expect(service.getFavorites()).toHaveLength(0);

    const favorited = service.favoritePassword(saved.id);
    expect(favorited?.isFavorite).toBe(true);
    expect(service.getFavorites()).toHaveLength(1);
    expect(service.getFavorites()[0].id).toBe(saved.id);

    const unfavorited = service.removeFavorite(saved.id);
    expect(unfavorited?.isFavorite).toBe(false);
    expect(service.getFavorites()).toHaveLength(0);
    expect(service.getPasswords()).toHaveLength(1);
  });

  it('returns null when favoriting a missing password', () => {
    const { service } = createService();

    expect(service.favoritePassword('missing')).toBeNull();
    expect(service.removeFavorite('missing')).toBeNull();
  });

  it('propagates storage write errors', () => {
    const { mmkv, service } = createService();

    jest.spyOn(mmkv, 'set').mockImplementation(() => {
      throw new Error('disk full');
    });

    expect(() =>
      service.savePassword({ password: 'fail', title: 'Fail' }),
    ).toThrow(AppError);
  });
});
