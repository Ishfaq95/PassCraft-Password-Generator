import { createExportFilename } from '@/services/passwordExport/createExportFilename';
import {
  exportPasswordsToTxt,
  getPasswordExportErrorMessage,
} from '@/services/passwordExport/exportPasswordsToTxt';
import { formatPasswordExport } from '@/services/passwordExport/formatPasswordExport';
import { AppError } from '@/errors';
import type { StoredPassword } from '@/types';

describe('password export', () => {
  const passwords: StoredPassword[] = [
    {
      id: '1',
      password: 'Tr9#kL2$mNx@7pQw',
      strength: 4,
      isFavorite: true,
      length: 16,
      createdAt: new Date('2026-07-05T10:15:00Z').getTime(),
    },
    {
      id: '2',
      password: 'abc123',
      strength: 1,
      isFavorite: false,
      length: 6,
      createdAt: new Date('2026-07-05T11:00:00Z').getTime(),
    },
  ];

  it('creates timestamped filenames', () => {
    const filename = createExportFilename(new Date(2026, 6, 5, 15, 30, 45));

    expect(filename).toBe('securepass-export-2026-07-05-153045.txt');
  });

  it('formats password export content', () => {
    const content = formatPasswordExport(
      passwords,
      new Date('2026-07-05T12:00:00Z'),
    );

    expect(content).toContain('SecurePass Password Export');
    expect(content).toContain('Total passwords: 2');
    expect(content).toContain('Title: Untitled');
    expect(content).toContain('Password: Tr9#kL2$mNx@7pQw');
    expect(content).toContain('Strength: Very Strong');
    expect(content).toContain('Favorite: Yes');
    expect(content).toContain('Password: abc123');
    expect(content).toContain('Strength: Weak');
  });

  it('exports passwords to a local txt file', async () => {
    const writes: Array<{ path: string; content: string }> = [];
    const fileSystem = {
      getExportDirectory: () => '/mock/downloads',
      writeFile: async (path: string, content: string) => {
        writes.push({ path, content });
      },
    };

    const result = await exportPasswordsToTxt(passwords, fileSystem);

    expect(result.passwordCount).toBe(2);
    expect(result.filename).toMatch(
      /^securepass-export-\d{4}-\d{2}-\d{2}-\d{6}\.txt$/,
    );
    expect(result.filePath).toBe(`/mock/downloads/${result.filename}`);
    expect(writes).toHaveLength(1);
    expect(writes[0].content).toContain('Password: abc123');
  });

  it('throws when there are no passwords to export', async () => {
    await expect(
      exportPasswordsToTxt([], {
        getExportDirectory: () => '/mock/downloads',
        writeFile: async () => undefined,
      }),
    ).rejects.toMatchObject({
      code: 'EXPORT_EMPTY',
    });
  });

  it('throws when export directory is unavailable', async () => {
    await expect(
      exportPasswordsToTxt(passwords, {
        getExportDirectory: () => null,
        writeFile: async () => undefined,
      }),
    ).rejects.toMatchObject({
      code: 'EXPORT_DIRECTORY_UNAVAILABLE',
    });
  });

  it('throws when file write fails', async () => {
    await expect(
      exportPasswordsToTxt(passwords, {
        getExportDirectory: () => '/mock/downloads',
        writeFile: async () => {
          throw new Error('disk full');
        },
      }),
    ).rejects.toMatchObject({
      code: 'EXPORT_WRITE_FAILED',
    });
  });

  it('registers android downloads when supported', async () => {
    const registerDownload = jest.fn(async () => undefined);
    const fileSystem = {
      getExportDirectory: () => '/mock/cache',
      writeFile: async () => undefined,
      registerDownload,
    };

    await exportPasswordsToTxt(passwords, fileSystem);

    expect(registerDownload).toHaveBeenCalledTimes(1);
  });

  it('maps export errors to friendly messages', () => {
    expect(getPasswordExportErrorMessage(AppError.exportEmpty())).toBe(
      'There is nothing to export yet. Generate some passwords first.',
    );
    expect(getPasswordExportErrorMessage(new Error('boom'))).toBe(
      'Something went wrong. Please try again.',
    );
  });
});
