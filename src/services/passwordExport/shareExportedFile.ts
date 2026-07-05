import { Platform } from 'react-native';

import { AppError, isUserCancelledError } from '@/errors';

import type { PasswordExportResult, ShareExportFileFn } from './types';

const EXPORT_MIME_TYPE = 'text/plain';

function buildShareFileUrl(filePath: string): string {
  if (filePath.startsWith('file://')) {
    return filePath;
  }

  return `file://${filePath}`;
}

function getDefaultShareModule(): ShareExportFileFn {
  const Share = require('react-native-share').default as {
    open: (
      options: Record<string, unknown>,
    ) => Promise<{ dismissedAction?: boolean }>;
  };

  return async result => {
    const shareResult = await Share.open({
      title: 'Share password export',
      subject: result.filename,
      message:
        Platform.OS === 'android' ? undefined : 'SecurePass password export',
      url: buildShareFileUrl(result.filePath),
      type: EXPORT_MIME_TYPE,
      filename: result.filename,
      failOnCancel: false,
      saveToFiles: Platform.OS === 'ios',
      showAppsToView: true,
    });

    return !shareResult.dismissedAction;
  };
}

export async function shareExportedFile(
  result: PasswordExportResult,
  shareFile: ShareExportFileFn = getDefaultShareModule(),
): Promise<boolean> {
  try {
    return await shareFile(result);
  } catch (error) {
    if (isUserCancelledError(error)) {
      return false;
    }

    if (error instanceof AppError) {
      throw error;
    }

    throw AppError.exportShareFailed(error);
  }
}
