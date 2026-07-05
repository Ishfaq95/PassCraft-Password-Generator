import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { PasswordOptionsPanel } from '@/components/PasswordOptionsPanel';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Slider } from '@/components/Slider';
import {
  PASSWORD_LENGTH_MAX,
  PASSWORD_LENGTH_MIN,
  type PasswordGeneratorOptions,
} from '@/services/password';
import { useTheme } from '@/theme';

type DefaultLengthSheetProps = {
  visible: boolean;
  length: number;
  onClose: () => void;
  onChange: (length: number) => void;
};

export function DefaultLengthSheet({
  visible,
  length,
  onClose,
  onChange,
}: DefaultLengthSheetProps) {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        content: {
          gap: theme.spacing.lg,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        label: {
          ...theme.typography.bodyMedium,
          color: theme.colors.text,
        },
        value: {
          ...theme.typography.titleMedium,
          color: theme.colors.primary,
        },
        footer: {
          paddingTop: theme.spacing.sm,
        },
      }),
    [theme],
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Default password length"
      accessibilityLabel="Default password length settings"
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.label}>Length</Text>
          <Text style={styles.value}>{length}</Text>
        </View>
        <Slider
          value={length}
          onValueChange={onChange}
          minimumValue={PASSWORD_LENGTH_MIN}
          maximumValue={PASSWORD_LENGTH_MAX}
          step={1}
          accessibilityLabel="Default password length"
        />
        <View style={styles.footer}>
          <PrimaryButton title="Done" fullWidth onPress={onClose} />
        </View>
      </View>
    </BottomSheet>
  );
}

type DefaultOptionsSheetProps = {
  visible: boolean;
  options: PasswordGeneratorOptions;
  onClose: () => void;
  onOptionsChange: (patch: Partial<PasswordGeneratorOptions>) => void;
  onSave: () => void;
};

export function DefaultOptionsSheet({
  visible,
  options,
  onClose,
  onOptionsChange,
  onSave,
}: DefaultOptionsSheetProps) {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        footer: {
          paddingTop: theme.spacing.lg,
        },
      }),
    [theme],
  );

  const handleSave = () => {
    onSave();
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Default options"
      accessibilityLabel="Default password options settings"
    >
      <PasswordOptionsPanel
        options={options}
        onOptionsChange={onOptionsChange}
      />
      <View style={styles.footer}>
        <PrimaryButton title="Save defaults" fullWidth onPress={handleSave} />
      </View>
    </BottomSheet>
  );
}
