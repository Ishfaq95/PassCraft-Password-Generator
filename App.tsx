import { useMemo } from 'react';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from '@/navigation/AppNavigator';
import { AppLockOverlay } from '@/components/AppLock';
import { AppBootstrap } from '@/components/AppBootstrap';
import { ToastHost } from '@/components/Toast';
import { AppLockProvider } from '@/context/AppLockContext';
import { ThemeProvider, useTheme } from '@/theme';

function AppContent() {
  const { theme, isDark } = useTheme();

  const navigationTheme = useMemo<NavigationTheme>(
    () => ({
      ...(isDark ? DarkTheme : DefaultTheme),
      dark: isDark,
      colors: {
        ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.text,
        border: theme.colors.border,
        notification: theme.colors.secondary,
      },
    }),
    [isDark, theme.colors],
  );

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={navigationTheme}>
        <ToastHost>
          <AppNavigator />
        </ToastHost>
      </NavigationContainer>
    </>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppLockProvider>
            <AppBootstrap>
              <AppContent />
              <AppLockOverlay />
            </AppBootstrap>
          </AppLockProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
