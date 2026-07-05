import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

import type { PasswordExportFileSystem } from './types';

export const blobUtilFileSystem: PasswordExportFileSystem = {
  getExportDirectory: () => {
    const directory =
      ReactNativeBlobUtil.fs.dirs.CacheDir ??
      ReactNativeBlobUtil.fs.dirs.DocumentDir;

    return directory || null;
  },
  writeFile: (path, content) =>
    ReactNativeBlobUtil.fs.writeFile(path, content, 'utf8'),
  registerDownload:
    Platform.OS === 'android'
      ? async (filePath, filename) => {
          await ReactNativeBlobUtil.android.addCompleteDownload({
            title: filename,
            description: 'SecurePass password export',
            mime: 'text/plain',
            path: filePath,
            showNotification: true,
          });
        }
      : undefined,
};
