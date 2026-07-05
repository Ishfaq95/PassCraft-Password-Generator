import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { PrimaryButton } from '@/components/PrimaryButton';
import { PIN_MIN_LENGTH } from '@/services/appLock';
import { useTheme } from '@/theme';

import { PinEntry } from './PinEntry';

export type PinSetupMode =
  | 'create'
  | 'change-current'
  | 'change-new'
  | 'change-confirm'
  | 'disable';

export type PinSetupSheetProps = {
  visible: boolean;
  mode: PinSetupMode;
  onClose: () => void;
  onCreatePin: (
    pin: string,
  ) => Promise<{ success: true } | { success: false; message: string }>;
  onChangePin: (
    currentPin: string,
    nextPin: string,
  ) => Promise<{ success: true } | { success: false; message: string }>;
  onDisableWithPin: (
    pin: string,
  ) => Promise<{ success: true } | { success: false; message: string }>;
};

type StepConfig = {
  title: string;
  subtitle?: string;
};

function getStepConfig(step: PinSetupMode, flowMode: PinSetupMode): StepConfig {
  switch (step) {
    case 'create':
      return {
        title: 'Create a PIN',
        subtitle: `Choose a ${PIN_MIN_LENGTH}-digit PIN or longer`,
      };
    case 'change-current':
      return {
        title: 'Enter current PIN',
        subtitle: 'Verify your existing PIN',
      };
    case 'change-new':
      return {
        title: 'Enter new PIN',
        subtitle: `Choose a ${PIN_MIN_LENGTH}-digit PIN or longer`,
      };
    case 'change-confirm':
      return flowMode === 'create'
        ? {
            title: 'Confirm PIN',
            subtitle: 'Re-enter your PIN',
          }
        : {
            title: 'Confirm new PIN',
            subtitle: 'Re-enter your new PIN',
          };
    case 'disable':
      return {
        title: 'Enter PIN to disable',
        subtitle: 'Confirm you want to turn off app lock',
      };
    default:
      return { title: 'Enter PIN' };
  }
}

export function PinSetupSheet({
  visible,
  mode,
  onClose,
  onCreatePin,
  onChangePin,
  onDisableWithPin,
}: PinSetupSheetProps) {
  const { theme } = useTheme();
  const [step, setStep] = useState<PinSetupMode>(mode);
  const [draftPin, setDraftPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        content: {
          gap: theme.spacing.lg,
        },
        actions: {
          gap: theme.spacing.md,
        },
        hint: {
          ...theme.typography.bodySmall,
          color: theme.colors.textSecondary,
          textAlign: 'center',
        },
      }),
    [theme],
  );

  useEffect(() => {
    if (visible) {
      setStep(mode);
      setDraftPin('');
      setCurrentPin('');
      setError(undefined);
      setIsSubmitting(false);
    }
  }, [mode, visible]);

  const resetAndClose = useCallback(() => {
    setDraftPin('');
    setCurrentPin('');
    setError(undefined);
    onClose();
  }, [onClose]);

  const handlePinComplete = useCallback(
    async (pin: string) => {
      setIsSubmitting(true);
      setError(undefined);

      if (step === 'create') {
        if (draftPin.length === 0) {
          setDraftPin(pin);
          setStep('change-confirm');
          setIsSubmitting(false);
          return;
        }

        if (pin !== draftPin) {
          setError('PINs do not match. Try again.');
          setDraftPin('');
          setStep('create');
          setIsSubmitting(false);
          return;
        }

        const result = await onCreatePin(pin);
        if (!result.success) {
          setError(result.message);
          setDraftPin('');
          setStep('create');
          setIsSubmitting(false);
          return;
        }

        resetAndClose();
        return;
      }

      if (step === 'change-current') {
        setCurrentPin(pin);
        setStep('change-new');
        setIsSubmitting(false);
        return;
      }

      if (step === 'change-new') {
        setDraftPin(pin);
        setStep('change-confirm');
        setIsSubmitting(false);
        return;
      }

      if (step === 'change-confirm') {
        if (pin !== draftPin) {
          setError('PINs do not match. Try again.');
          setDraftPin('');
          setStep('change-new');
          setIsSubmitting(false);
          return;
        }

        const result = await onChangePin(currentPin, pin);
        if (!result.success) {
          setError(result.message);
          setCurrentPin('');
          setDraftPin('');
          setStep('change-current');
          setIsSubmitting(false);
          return;
        }

        resetAndClose();
        return;
      }

      if (step === 'disable') {
        const result = await onDisableWithPin(pin);
        if (!result.success) {
          setError(result.message);
          setIsSubmitting(false);
          return;
        }

        resetAndClose();
      }
    },
    [
      currentPin,
      draftPin,
      onChangePin,
      onCreatePin,
      onDisableWithPin,
      resetAndClose,
      step,
    ],
  );

  const stepConfig = getStepConfig(step, mode);

  return (
    <BottomSheet
      visible={visible}
      onClose={resetAndClose}
      title={
        mode === 'create'
          ? 'Set up app lock'
          : mode === 'disable'
          ? 'Disable app lock'
          : 'Change PIN'
      }
      accessibilityLabel="PIN setup sheet"
    >
      <View style={styles.content}>
        <PinEntry
          title={stepConfig.title}
          subtitle={stepConfig.subtitle}
          error={error}
          disabled={isSubmitting}
          onComplete={handlePinComplete}
          onChange={() => setError(undefined)}
        />

        <View style={styles.actions}>
          <Text style={styles.hint}>
            Your PIN is stored securely on this device only.
          </Text>
          <PrimaryButton title="Cancel" onPress={resetAndClose} fullWidth />
        </View>
      </View>
    </BottomSheet>
  );
}
