export type AppErrorCategory =
  | 'storage'
  | 'export'
  | 'generator'
  | 'clipboard'
  | 'share'
  | 'settings'
  | 'app_lock'
  | 'unknown';

export type AppErrorCode =
  | 'STORAGE_READ_FAILED'
  | 'STORAGE_WRITE_FAILED'
  | 'STORAGE_DELETE_FAILED'
  | 'STORAGE_NOT_FOUND'
  | 'STORAGE_RESTORE_FAILED'
  | 'SETTINGS_READ_FAILED'
  | 'SETTINGS_WRITE_FAILED'
  | 'EXPORT_EMPTY'
  | 'EXPORT_DIRECTORY_UNAVAILABLE'
  | 'EXPORT_WRITE_FAILED'
  | 'EXPORT_SHARE_FAILED'
  | 'EXPORT_SHARE_CANCELLED'
  | 'GENERATOR_INVALID_OPTIONS'
  | 'GENERATOR_RANDOM_UNAVAILABLE'
  | 'CLIPBOARD_FAILED'
  | 'SHARE_CANCELLED'
  | 'SHARE_FAILED'
  | 'UNKNOWN';

export type AppErrorOptions = {
  code: AppErrorCode;
  category: AppErrorCategory;
  message?: string;
  friendlyMessage?: string;
  cause?: unknown;
  isUserCancelled?: boolean;
};
