import type { StoredPassword } from '@/types';

import { AppError, getFriendlyErrorMessage } from '@/errors';

import { createExportFilename } from './createExportFilename';
import { formatPasswordExport } from './formatPasswordExport';
import type { PasswordExportFileSystem, PasswordExportResult } from './types';

function getDefaultFileSystem(): PasswordExportFileSystem {
  const { blobUtilFileSystem } =
    require('./fileSystem') as typeof import('./fileSystem');

  return blobUtilFileSystem;
}

export async function exportPasswordsToTxt(
  passwords: StoredPassword[],
  fileSystem: PasswordExportFileSystem = getDefaultFileSystem(),
): Promise<PasswordExportResult> {
  if (passwords.length === 0) {
    throw AppError.exportEmpty();
  }

  const exportDirectory = fileSystem.getExportDirectory();

  if (!exportDirectory) {
    throw AppError.exportDirectoryUnavailable();
  }

  const filename = createExportFilename();
  const filePath = `${exportDirectory}/${filename}`;
  const content = formatPasswordExport(passwords);

  try {
    await fileSystem.writeFile(filePath, content);
  } catch (cause) {
    throw AppError.exportWriteFailed(cause);
  }

  if (fileSystem.registerDownload) {
    try {
      await fileSystem.registerDownload(filePath, filename);
    } catch {
      // Download registration is best-effort on Android; sharing still works.
    }
  }

  return {
    filename,
    filePath,
    passwordCount: passwords.length,
  };
}

export function getPasswordExportErrorMessage(error: unknown): string {
  return getFriendlyErrorMessage(error);
}
