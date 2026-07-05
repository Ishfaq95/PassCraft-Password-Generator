import { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Logo } from '@/components/branding/Logo';
import { SecondaryButton } from '@/components/SecondaryButton';
import { useAppLockContext } from '@/context/AppLockContext';
import { useTheme } from '@/theme';

import { PinEntry } from './PinEntry';

export function AppLockOverlay() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    isLocked,
    isReady,
    unlockWithPin,
    unlockWithBiometrics,
    canUseBiometrics,
  } = useAppLockContext();
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: theme.colors.background,
          paddingTop: insets.top + theme.spacing['3xl'],
          paddingBottom: insets.bottom + theme.spacing.xl,
          paddingHorizontal: theme.spacing.lg,
          justifyContent: 'space-between',
        },
        header: {
          alignItems: 'center',
          gap: theme.spacing.lg,
        },
        footer: {
          alignItems: 'center',
        },
      }),
    [insets.bottom, insets.top, theme],
  );

  useEffect(() => {
    if (!isLocked) {
      setError(undefined);
      setIsSubmitting(false);
    }
  }, [isLocked]);

  const handleComplete = useCallback(
    async (pin: string) => {
      setIsSubmitting(true);
      setError(undefined);

      const unlocked = await unlockWithPin(pin);
      if (!unlocked) {
        setError('Incorrect PIN. Try again.');
      }

      setIsSubmitting(false);
    },
    [unlockWithPin],
  );

  const handleBiometricPress = useCallback(async () => {
    setIsSubmitting(true);
    setError(undefined);

    const unlocked = await unlockWithBiometrics();
    if (!unlocked) {
      setError('Biometric unlock failed. Enter your PIN.');
    }

    setIsSubmitting(false);
  }, [unlockWithBiometrics]);

  if (!isReady || !isLocked) {
    return null;
  }

  return (
    <Modal
      visible
      animationType="fade"
      presentationStyle="fullScreen"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Logo size="lg" />
        </View>

        <PinEntry
          title="Enter your PIN"
          subtitle="Unlock SecurePass to continue"
          error={error}
          disabled={isSubmitting}
          onComplete={handleComplete}
          onChange={() => setError(undefined)}
        />

        <View style={styles.footer}>
          {canUseBiometrics ? (
            <SecondaryButton
              title="Unlock with biometrics"
              onPress={handleBiometricPress}
              disabled={isSubmitting}
            />
          ) : null}
        </View>
      </View>
    </Modal>
  );
}
