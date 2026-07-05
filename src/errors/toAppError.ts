import { PasswordGeneratorError } from '@/services/password';

import { AppError } from './AppError';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

function getErrorMessage(error: unknown): string | undefined {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (isRecord(error) && typeof error.message === 'string') {
    return error.message;
  }

  return undefined;
}

export function isUserCancelledError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.isUserCancelled;
  }

  const message = getErrorMessage(error)?.toLowerCase() ?? '';

  return (
    message.includes('user did not share') ||
    message.includes('cancel') ||
    message.includes('dismiss')
  );
}

function mapLegacyExportError(error: {
  code?: string;
  message?: string;
}): AppError | null {
  switch (error.code) {
    case 'EMPTY':
      return AppError.exportEmpty();
    case 'DIRECTORY_UNAVAILABLE':
      return AppError.exportDirectoryUnavailable();
    case 'WRITE_FAILED':
      return AppError.exportWriteFailed(error);
    case 'SHARE_FAILED':
      return AppError.exportShareFailed(error);
    default:
      return null;
  }
}

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof PasswordGeneratorError) {
    return AppError.generator(error.message);
  }

  if (isRecord(error) && error.name === 'PasswordExportError') {
    const mapped = mapLegacyExportError(error);
    if (mapped) {
      return mapped;
    }
  }

  if (isUserCancelledError(error)) {
    return AppError.shareCancelled();
  }

  const message = getErrorMessage(error);

  if (message?.toLowerCase().includes('clipboard')) {
    return AppError.clipboardFailed(error);
  }

  return AppError.unknown(error);
}

export function getFriendlyErrorMessage(error: unknown): string {
  return toAppError(error).friendlyMessage;
}
