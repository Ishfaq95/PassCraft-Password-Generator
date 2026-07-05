export type PasswordExportResult = {
  filename: string;
  filePath: string;
  passwordCount: number;
};

export type PasswordExportFileSystem = {
  getExportDirectory: () => string | null;
  writeFile: (path: string, content: string) => Promise<void>;
  registerDownload?: (filePath: string, filename: string) => Promise<void>;
};

export type ShareExportFileFn = (
  result: PasswordExportResult,
) => Promise<boolean>;
