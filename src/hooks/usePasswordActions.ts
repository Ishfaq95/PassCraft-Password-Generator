import { useCallback } from 'react';

import { useAppError } from '@/hooks/useAppError';
import { copyToClipboard } from '@/utils/clipboard';
import { triggerCopyHaptic } from '@/utils/haptics';
import { sharePassword as sharePasswordText } from '@/utils/sharePassword';
import { useToast } from '@/components/Toast/ToastContext';
import { AppError } from '@/errors';

export function usePasswordActions() {
  const { showToast } = useToast();
  const { showError, isUserCancelledError } = useAppError();

  const copyPassword = useCallback(
    async (password: string) => {
      if (!password) {
        return;
      }

      try {
        await copyToClipboard(password);
        triggerCopyHaptic();
        showToast({
          message: 'Password copied to clipboard',
          type: 'success',
        });
      } catch (error) {
        showError(AppError.clipboardFailed(error));
      }
    },
    [showError, showToast],
  );

  const sharePassword = useCallback(
    async (password: string) => {
      if (!password) {
        return;
      }

      try {
        await sharePasswordText(password);
      } catch (error) {
        if (isUserCancelledError(error)) {
          return;
        }

        showError(AppError.shareFailed(error));
      }
    },
    [isUserCancelledError, showError],
  );

  return {
    copyPassword,
    sharePassword,
  };
}
