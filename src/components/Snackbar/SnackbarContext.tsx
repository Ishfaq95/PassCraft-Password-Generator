import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type SnackbarMessage = {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export type ShowSnackbarOptions = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
};

type SnackbarContextValue = {
  snackbar: SnackbarMessage | null;
  showSnackbar: (options: ShowSnackbarOptions) => void;
  hideSnackbar: () => void;
};

const DEFAULT_DURATION = 5000;

export const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const actionRef = useRef<(() => void) | undefined>(undefined);

  const hideSnackbar = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    actionRef.current = undefined;
    setSnackbar(null);
  }, []);

  const showSnackbar = useCallback(
    ({
      message,
      actionLabel,
      onAction,
      duration = DEFAULT_DURATION,
    }: ShowSnackbarOptions) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      actionRef.current = onAction;
      setSnackbar({
        id: `${Date.now()}`,
        message,
        actionLabel,
        onAction,
      });

      timeoutRef.current = setTimeout(() => {
        setSnackbar(null);
        actionRef.current = undefined;
        timeoutRef.current = null;
      }, duration);
    },
    [],
  );

  const value = useMemo(
    () => ({
      snackbar,
      showSnackbar,
      hideSnackbar,
    }),
    [snackbar, showSnackbar, hideSnackbar],
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }

  return context;
}
