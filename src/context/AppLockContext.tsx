import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AppState } from 'react-native';

import { appLockService } from '@/services/appLock';

export type AppLockContextValue = {
  isReady: boolean;
  isLocked: boolean;
  isEnabled: boolean;
  canUseBiometrics: boolean;
  lock: () => void;
  unlockWithPin: (pin: string) => Promise<boolean>;
  unlockWithBiometrics: () => Promise<boolean>;
  refresh: () => void;
};

const AppLockContext = createContext<AppLockContextValue | null>(null);

export type AppLockProviderProps = {
  children: ReactNode;
};

export function AppLockProvider({ children }: AppLockProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const [canUseBiometrics, setCanUseBiometrics] = useState(false);

  const refresh = useCallback(() => {
    setIsEnabled(appLockService.isEnabled());
  }, []);

  const initialize = useCallback(async () => {
    const enabled = appLockService.isEnabled();
    setIsEnabled(enabled);

    if (enabled) {
      const hasPin = await appLockService.hasPin();
      setIsLocked(hasPin);
      setCanUseBiometrics(await appLockService.canUseBiometrics());
    } else {
      setIsLocked(false);
      setCanUseBiometrics(false);
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (
        (nextState === 'background' || nextState === 'inactive') &&
        appLockService.isEnabled()
      ) {
        setIsLocked(true);
      }
    });

    return () => subscription.remove();
  }, []);

  const lock = useCallback(() => {
    if (appLockService.isEnabled()) {
      setIsLocked(true);
    }
  }, []);

  const unlockWithPin = useCallback(async (pin: string) => {
    const isValid = await appLockService.verifyPin(pin);
    if (isValid) {
      setIsLocked(false);
      return true;
    }

    return false;
  }, []);

  const unlockWithBiometrics = useCallback(async () => {
    const unlocked = await appLockService.authenticateWithBiometrics();
    if (unlocked) {
      setIsLocked(false);
    }

    return unlocked;
  }, []);

  const value = useMemo(
    () => ({
      isReady,
      isLocked,
      isEnabled,
      canUseBiometrics,
      lock,
      unlockWithPin,
      unlockWithBiometrics,
      refresh,
    }),
    [
      canUseBiometrics,
      isEnabled,
      isLocked,
      isReady,
      lock,
      refresh,
      unlockWithBiometrics,
      unlockWithPin,
    ],
  );

  return (
    <AppLockContext.Provider value={value}>{children}</AppLockContext.Provider>
  );
}

export function useAppLockContext(): AppLockContextValue {
  const context = useContext(AppLockContext);

  if (!context) {
    throw new Error('useAppLockContext must be used within AppLockProvider');
  }

  return context;
}
