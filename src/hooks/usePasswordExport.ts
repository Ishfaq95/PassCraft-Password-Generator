import { useCallback, useState } from 'react';

import { useToast } from '@/components/Toast/ToastContext';
import { useAppError } from '@/hooks/useAppError';
import {
  exportPasswordsToTxt,
  shareExportedFile,
} from '@/services/passwordExport';
import { passwordStorageService } from '@/services/passwordStorage';
import { triggerImpactHaptic } from '@/utils/haptics';

export function usePasswordExport() {
  const { showToast } = useToast();
  const { showError } = useAppError();
  const [isExporting, setIsExporting] = useState(false);

  const exportPasswords = useCallback(async () => {
    if (isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      const passwords = passwordStorageService.getPasswords();
      const result = await exportPasswordsToTxt(passwords);
      const shared = await shareExportedFile(result);

      triggerImpactHaptic();
      showToast({
        message: shared
          ? `Shared ${result.passwordCount} passwords as ${result.filename}`
          : `Saved ${result.filename}. Share cancelled.`,
        type: 'success',
      });
    } catch (error) {
      showError(error);
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, showError, showToast]);

  return {
    exportPasswords,
    isExporting,
  };
}
