import { useEffect, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { SplashView } from '@/components/branding/SplashView';
import { useAppLockContext } from '@/context/AppLockContext';

const MIN_SPLASH_MS = 450;

type AppBootstrapProps = {
  children: ReactNode;
};

export function AppBootstrap({ children }: AppBootstrapProps) {
  const { isReady } = useAppLockContext();
  const [minDurationElapsed, setMinDurationElapsed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setMinDurationElapsed(true), MIN_SPLASH_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isReady && minDurationElapsed) {
      setIsVisible(false);
    }
  }, [isReady, minDurationElapsed]);

  return (
    <View style={styles.root}>
      {children}
      {isVisible ? (
        <View style={styles.overlay} pointerEvents="auto">
          <SplashView />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
  },
});
