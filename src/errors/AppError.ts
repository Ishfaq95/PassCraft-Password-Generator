import { FRIENDLY_ERROR_MESSAGES } from './friendlyMessages';
import type { AppErrorCategory, AppErrorCode, AppErrorOptions } from './types';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly category: AppErrorCategory;
  readonly friendlyMessage: string;
  readonly cause?: unknown;
  readonly isUserCancelled: boolean;

  constructor(options: AppErrorOptions) {
    const friendlyMessage =
      options.friendlyMessage ?? FRIENDLY_ERROR_MESSAGES[options.code];

    super(options.message ?? friendlyMessage);
    this.name = 'AppError';
    this.code = options.code;
    this.category = options.category;
    this.friendlyMessage = friendlyMessage;
    this.cause = options.cause;
    this.isUserCancelled = options.isUserCancelled ?? false;
  }

  static storageRead(cause?: unknown): AppError {
    return new AppError({
      code: 'STORAGE_READ_FAILED',
      category: 'storage',
      message: 'Failed to read stored passwords.',
      cause,
    });
  }

  static storageWrite(cause?: unknown): AppError {
    return new AppError({
      code: 'STORAGE_WRITE_FAILED',
      category: 'storage',
      message: 'Failed to write stored passwords.',
      cause,
    });
  }

  static storageDelete(cause?: unknown): AppError {
    return new AppError({
      code: 'STORAGE_DELETE_FAILED',
      category: 'storage',
      message: 'Failed to delete stored password.',
      cause,
    });
  }

  static storageNotFound(): AppError {
    return new AppError({
      code: 'STORAGE_NOT_FOUND',
      category: 'storage',
      message: 'Stored password not found.',
    });
  }

  static storageRestore(cause?: unknown): AppError {
    return new AppError({
      code: 'STORAGE_RESTORE_FAILED',
      category: 'storage',
      message: 'Failed to restore stored passwords.',
      cause,
    });
  }

  static settingsWrite(cause?: unknown): AppError {
    return new AppError({
      code: 'SETTINGS_WRITE_FAILED',
      category: 'settings',
      message: 'Failed to save app settings.',
      cause,
    });
  }

  static exportEmpty(): AppError {
    return new AppError({
      code: 'EXPORT_EMPTY',
      category: 'export',
      message: 'No passwords to export.',
    });
  }

  static exportDirectoryUnavailable(): AppError {
    return new AppError({
      code: 'EXPORT_DIRECTORY_UNAVAILABLE',
      category: 'export',
      message: 'Export directory is unavailable on this device.',
    });
  }

  static exportWriteFailed(cause?: unknown): AppError {
    return new AppError({
      code: 'EXPORT_WRITE_FAILED',
      category: 'export',
      message: 'Failed to save export file.',
      cause,
    });
  }

  static exportShareFailed(cause?: unknown): AppError {
    return new AppError({
      code: 'EXPORT_SHARE_FAILED',
      category: 'export',
      message: 'Failed to share export file.',
      cause,
    });
  }

  static exportShareCancelled(): AppError {
    return new AppError({
      code: 'EXPORT_SHARE_CANCELLED',
      category: 'export',
      message: 'Export share cancelled.',
      isUserCancelled: true,
    });
  }

  static clipboardFailed(cause?: unknown): AppError {
    return new AppError({
      code: 'CLIPBOARD_FAILED',
      category: 'clipboard',
      message: 'Failed to copy to clipboard.',
      cause,
    });
  }

  static shareCancelled(): AppError {
    return new AppError({
      code: 'SHARE_CANCELLED',
      category: 'share',
      message: 'Share cancelled by user.',
      isUserCancelled: true,
    });
  }

  static shareFailed(cause?: unknown): AppError {
    return new AppError({
      code: 'SHARE_FAILED',
      category: 'share',
      message: 'Failed to share content.',
      cause,
    });
  }

  static generator(
    message: string,
    code: AppErrorCode = 'GENERATOR_INVALID_OPTIONS',
  ): AppError {
    return new AppError({
      code,
      category: 'generator',
      message,
      friendlyMessage: message,
    });
  }

  static unknown(cause?: unknown): AppError {
    return new AppError({
      code: 'UNKNOWN',
      category: 'unknown',
      message: 'An unknown error occurred.',
      cause,
    });
  }
}
