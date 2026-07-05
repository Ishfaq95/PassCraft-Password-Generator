import { AppError } from '@/errors/AppError';
import {
  getFriendlyErrorMessage,
  isUserCancelledError,
  toAppError,
} from '@/errors/toAppError';

describe('AppError', () => {
  it('uses friendly messages by default', () => {
    const error = AppError.exportEmpty();

    expect(error.code).toBe('EXPORT_EMPTY');
    expect(error.category).toBe('export');
    expect(error.friendlyMessage).toBe(
      'There is nothing to export yet. Generate some passwords first.',
    );
  });

  it('allows custom friendly messages', () => {
    const error = new AppError({
      code: 'UNKNOWN',
      category: 'unknown',
      friendlyMessage: 'Custom message',
    });

    expect(error.friendlyMessage).toBe('Custom message');
  });
});

describe('toAppError', () => {
  it('returns the same AppError instance', () => {
    const error = AppError.storageWrite();
    expect(toAppError(error)).toBe(error);
  });

  it('maps password generator errors', () => {
    const { PasswordGeneratorError } =
      require('@/services/password') as typeof import('@/services/password');
    const error = toAppError(
      new PasswordGeneratorError('At least one character set must be enabled.'),
    );

    expect(error.category).toBe('generator');
    expect(error.friendlyMessage).toBe(
      'At least one character set must be enabled.',
    );
  });

  it('maps legacy export error codes', () => {
    const error = toAppError({
      name: 'PasswordExportError',
      code: 'WRITE_FAILED',
      message: 'Failed to save export file.',
    });

    expect(error.code).toBe('EXPORT_WRITE_FAILED');
    expect(getFriendlyErrorMessage(error)).toBe(
      'We could not save the export file. Please try again.',
    );
  });

  it('detects user-cancelled share errors', () => {
    expect(isUserCancelledError(new Error('User did not share'))).toBe(true);
    expect(toAppError(new Error('User did not share')).isUserCancelled).toBe(
      true,
    );
  });

  it('maps unknown errors to a friendly fallback', () => {
    expect(getFriendlyErrorMessage(new Error('boom'))).toBe(
      'Something went wrong. Please try again.',
    );
  });
});
