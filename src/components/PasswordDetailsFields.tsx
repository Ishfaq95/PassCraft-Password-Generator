import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Input } from './Input';
import { SectionHeader } from './SectionHeader';
import { useTheme } from '@/theme';

export type PasswordDetailsFieldsProps = {
  title: string;
  email: string;
  onTitleChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  titleError?: string;
  emailError?: string;
  onTitleBlur?: () => void;
};

export function PasswordDetailsFields({
  title,
  email,
  onTitleChange,
  onEmailChange,
  titleError,
  emailError,
  onTitleBlur,
}: PasswordDetailsFieldsProps) {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          gap: theme.spacing.xs,
        },
        card: {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.lg,
          gap: theme.spacing.lg,
          ...theme.elevation.xs,
        },
      }),
    [theme],
  );

  return (
    <View style={styles.container}>
      <SectionHeader title="What is this for?" />
      <View style={styles.card}>
        <Input
          label="Title"
          value={title}
          onChangeText={onTitleChange}
          onBlur={onTitleBlur}
          placeholder="e.g. Gmail, Netflix, Work VPN"
          leftIcon="bookmark-outline"
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="next"
          error={titleError}
          helperText="Required — helps you remember where this password is used"
          accessibilityLabel="Password title"
        />
        <Input
          label="Email"
          value={email}
          onChangeText={onEmailChange}
          placeholder="e.g. alex@email.com"
          leftIcon="mail-outline"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          error={emailError}
          helperText="Optional — account email or username"
          accessibilityLabel="Account email"
        />
      </View>
    </View>
  );
}
