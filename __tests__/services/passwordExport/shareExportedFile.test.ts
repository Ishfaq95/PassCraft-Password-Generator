import { shareExportedFile } from '@/services/passwordExport/shareExportedFile';
import { AppError } from '@/errors';

describe('shareExportedFile', () => {
  const result = {
    filename: 'securepass-export-2026-07-05-153045.txt',
    filePath: '/mock/cache/securepass-export-2026-07-05-153045.txt',
    passwordCount: 2,
  };

  it('opens the native share sheet with a file url', async () => {
    const shareFile = jest.fn(async () => true);

    const shared = await shareExportedFile(result, shareFile);

    expect(shared).toBe(true);
    expect(shareFile).toHaveBeenCalledWith(result);
  });

  it('returns false when the user cancels sharing', async () => {
    const shareFile = jest.fn(async () => false);

    const shared = await shareExportedFile(result, shareFile);

    expect(shared).toBe(false);
  });

  it('treats user cancellation errors as a dismissed share', async () => {
    const shareFile = jest.fn(async () => {
      throw new Error('User did not share');
    });

    const shared = await shareExportedFile(result, shareFile);

    expect(shared).toBe(false);
  });

  it('throws when sharing fails for other reasons', async () => {
    const shareFile = jest.fn(async () => {
      throw new Error('Share unavailable');
    });

    await expect(shareExportedFile(result, shareFile)).rejects.toMatchObject({
      code: 'EXPORT_SHARE_FAILED',
    });
  });

  it('rethrows AppError instances unchanged', async () => {
    const shareFile = jest.fn(async () => {
      throw AppError.exportShareFailed();
    });

    await expect(shareExportedFile(result, shareFile)).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
