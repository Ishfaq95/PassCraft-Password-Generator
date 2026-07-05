import type { AppErrorCode } from './types';

export const FRIENDLY_ERROR_MESSAGES: Record<AppErrorCode, string> = {
  STORAGE_READ_FAILED:
    'We could not load your saved passwords. Please restart the app and try again.',
  STORAGE_WRITE_FAILED: 'We could not save your password. Please try again.',
  STORAGE_DELETE_FAILED: 'We could not delete that password. Please try again.',
  STORAGE_NOT_FOUND: 'That password could not be found.',
  STORAGE_RESTORE_FAILED:
    'We could not restore your passwords. Please try again.',
  SETTINGS_READ_FAILED:
    'We could not load your settings. Defaults will be used for now.',
  SETTINGS_WRITE_FAILED: 'We could not save your settings. Please try again.',
  EXPORT_EMPTY:
    'There is nothing to export yet. Generate some passwords first.',
  EXPORT_DIRECTORY_UNAVAILABLE:
    'Export is unavailable on this device right now.',
  EXPORT_WRITE_FAILED: 'We could not save the export file. Please try again.',
  EXPORT_SHARE_FAILED:
    'The export was saved, but sharing failed. Try again from your files app.',
  EXPORT_SHARE_CANCELLED: 'Export saved. Sharing was cancelled.',
  GENERATOR_INVALID_OPTIONS: 'Update your password options and try again.',
  GENERATOR_RANDOM_UNAVAILABLE:
    'Password generation is unavailable on this device.',
  CLIPBOARD_FAILED: 'We could not copy to the clipboard. Please try again.',
  SHARE_CANCELLED: 'Sharing was cancelled.',
  SHARE_FAILED: 'We could not share right now. Please try again.',
  UNKNOWN: 'Something went wrong. Please try again.',
};
