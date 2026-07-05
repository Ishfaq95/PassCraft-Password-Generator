import { type ReactNode } from 'react';

import { Snackbar } from './Snackbar';
import { SnackbarProvider } from './SnackbarContext';

export function SnackbarHost({ children }: { children: ReactNode }) {
  return (
    <SnackbarProvider>
      {children}
      <Snackbar />
    </SnackbarProvider>
  );
}

export { Snackbar } from './Snackbar';
export { SnackbarProvider, useSnackbar } from './SnackbarContext';
export type { ShowSnackbarOptions, SnackbarMessage } from './SnackbarContext';
