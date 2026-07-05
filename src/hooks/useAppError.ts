import { useCallback } from 'react';

import { useToast } from '@/components/Toast/ToastContext';
import {
  getFriendlyErrorMessage,
  isUserCancelledError,
  toAppError,
} from '@/errors';

export type ShowAppErrorOptions = {
  silentIfCancelled?: boolean;
};

export function useAppError() {
  const { showToast } = useToast();

  const showError = useCallback(
    (error: unknown, options?: ShowAppErrorOptions) => {
      const appError = toAppError(error);

      if (options?.silentIfCancelled !== false && appError.isUserCancelled) {
        return appError;
      }

      showToast({
        message: appError.friendlyMessage,
        type: 'error',
      });

      return appError;
    },
    [showToast],
  );

  return {
    showError,
    toAppError,
    getFriendlyErrorMessage,
    isUserCancelledError,
  };
}
