import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { appSettingsService } from '@/services/appSettings';
import { darkTheme } from './darkTheme';
import { lightTheme } from './lightTheme';
import { ThemeContext } from './ThemeContext';
import type { ThemeMode } from './types';

type ThemeProviderProps = {
  children: ReactNode;
  initialMode?: ThemeMode;
};

export function ThemeProvider({ children, initialMode }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(
    () => initialMode ?? appSettingsService.getThemeMode(),
  );

  const isDark = useMemo(() => {
    if (mode === 'system') {
      return systemScheme === 'dark';
    }

    return mode === 'dark';
  }, [mode, systemScheme]);

  const theme = isDark ? darkTheme : lightTheme;

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    appSettingsService.setThemeMode(next);
  }, []);

  const toggleTheme = useCallback(() => {
    const resolved =
      mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;

    setMode(resolved === 'dark' ? 'light' : 'dark');
  }, [mode, setMode, systemScheme]);

  const value = useMemo(
    () => ({
      theme,
      mode,
      isDark,
      setMode,
      toggleTheme,
    }),
    [theme, mode, isDark, setMode, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
