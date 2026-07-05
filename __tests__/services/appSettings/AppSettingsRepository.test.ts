import { AppSettingsRepository } from '@/services/appSettings/AppSettingsRepository';
import { DEFAULT_APP_SETTINGS } from '@/services/appSettings/types';

import { createMockMmkv } from '../../helpers/createMockMmkv';

describe('AppSettingsRepository', () => {
  function createRepository() {
    return new AppSettingsRepository(createMockMmkv());
  }

  it('returns default settings when storage is empty', () => {
    const repository = createRepository();

    expect(repository.getSettings()).toEqual(DEFAULT_APP_SETTINGS);
  });

  it('persists theme mode', () => {
    const repository = createRepository();

    repository.setThemeMode('dark');

    expect(repository.getThemeMode()).toBe('dark');
  });

  it('persists default generator options', () => {
    const repository = createRepository();

    repository.updateDefaultGeneratorOptions({
      length: 24,
      symbols: false,
      avoidAmbiguous: true,
    });

    const options = repository.getDefaultGeneratorOptions();

    expect(options.length).toBe(24);
    expect(options.symbols).toBe(false);
    expect(options.avoidAmbiguous).toBe(true);
  });

  it('ensures at least one charset remains enabled', () => {
    const repository = createRepository();

    repository.setDefaultGeneratorOptions({
      length: 16,
      uppercase: false,
      lowercase: false,
      numbers: false,
      symbols: false,
      avoidAmbiguous: false,
    });

    const options = repository.getDefaultGeneratorOptions();

    expect(options.lowercase).toBe(true);
    expect(options.numbers).toBe(true);
  });
});
