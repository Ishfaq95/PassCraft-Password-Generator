import { useMemo } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { useTheme } from '@/theme';

export type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
  style,
}: ConfirmDialogProps) {
  const { theme } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const dialogWidth = Math.min(windowWidth - theme.spacing.xl * 2, 420);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: theme.colors.overlay,
          justifyContent: 'center',
          alignItems: 'center',
          padding: theme.spacing.xl,
        },
        dialog: {
          width: dialogWidth,
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.xl,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.xl,
          gap: theme.spacing.lg,
          ...theme.elevation.lg,
        },
        title: {
          ...theme.typography.titleLarge,
          color: theme.colors.text,
        },
        message: {
          ...theme.typography.bodyMedium,
          color: theme.colors.textSecondary,
        },
        actions: {
          flexDirection: 'row',
          gap: theme.spacing.md,
        },
        actionButton: {
          flex: 1,
        },
        destructiveButton: {
          backgroundColor: theme.colors.error,
        },
        destructivePressed: {
          backgroundColor: theme.colors.error,
          opacity: 0.9,
        },
        destructiveLabel: {
          ...theme.typography.labelLarge,
          color: theme.colors.onPrimary,
        },
      }),
    [dialogWidth, theme],
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable
          style={[styles.dialog, style]}
          onPress={event => event.stopPropagation()}
        >
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <SecondaryButton
              title={cancelLabel}
              onPress={onCancel}
              style={styles.actionButton}
              accessibilityLabel={cancelLabel}
            />
            {destructive ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={confirmLabel}
                onPress={onConfirm}
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.destructiveButton,
                  {
                    minHeight: 44,
                    borderRadius: theme.borderRadius.md,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  pressed && styles.destructivePressed,
                ]}
              >
                <Text style={styles.destructiveLabel}>{confirmLabel}</Text>
              </Pressable>
            ) : (
              <PrimaryButton
                title={confirmLabel}
                onPress={onConfirm}
                style={styles.actionButton}
                accessibilityLabel={confirmLabel}
              />
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
