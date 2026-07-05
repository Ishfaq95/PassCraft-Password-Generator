import { type ReactNode } from 'react';

import { SnackbarHost } from '@/components/Snackbar';
import { Toast } from './Toast';
import { ToastProvider } from './ToastContext';

export function ToastHost({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <SnackbarHost>
        {children}
        <Toast />
      </SnackbarHost>
    </ToastProvider>
  );
}

export { Toast } from './Toast';
export { ToastProvider, useToast } from './ToastContext';
export type { ShowToastOptions, ToastMessage, ToastType } from './ToastContext';
