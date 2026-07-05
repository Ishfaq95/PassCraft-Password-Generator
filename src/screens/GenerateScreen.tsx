import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AnimatedScreen } from '@/components/AnimatedScreen';
import { HeroSection } from '@/components/HeroSection';
import { PasswordDetailsFields } from '@/components/PasswordDetailsFields';
import { PasswordOptionsPanel } from '@/components/PasswordOptionsPanel';
import { PasswordPreviewCard } from '@/components/PasswordPreviewCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SecondaryButton } from '@/components/SecondaryButton';
import { useToast } from '@/components/Toast/ToastContext';
import { usePasswordActions, usePasswordGenerator } from '@/hooks';
import { useAppError } from '@/hooks/useAppError';
import { passwordStorageService } from '@/services/passwordStorage';
import { useTheme } from '@/theme';
import { triggerImpactHaptic } from '@/utils/haptics';
import {
  normalizePasswordEmail,
  normalizePasswordTitle,
  validatePasswordEmail,
  validatePasswordTitle,
} from '@/utils/passwordDetails';

export function GenerateScreen() {
  const { theme } = useTheme();
  const { showError } = useAppError();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [titleTouched, setTitleTouched] = useState(false);
  const { options, password, error, isValid, generate, updateOptions } =
    usePasswordGenerator();
  const { copyPassword, sharePassword } = usePasswordActions();

  const titleError = titleTouched ? validatePasswordTitle(title) : undefined;
  const emailError = validatePasswordEmail(email);
  const canGenerate = isValid && !validatePasswordTitle(title) && !emailError;

  const handleGenerate = useCallback(() => {
    setTitleTouched(true);

    if (!canGenerate) {
      return;
    }

    const { result, error: generateError } = generate();

    if (result) {
      const savedTitle = normalizePasswordTitle(title);

      try {
        passwordStorageService.savePassword({
          password: result.password,
          title: savedTitle,
          email: normalizePasswordEmail(email ?? ''),
          strength: result.strength,
          length: options.length,
        });
        triggerImpactHaptic();
        showToast({
          message: `Password generated for ${savedTitle}`,
          type: 'success',
        });
        setTitle('');
        setEmail('');
        setTitleTouched(false);
      } catch (error) {
        showError(error);
      }
      return;
    }

    if (generateError) {
      showError(generateError);
    }
  }, [
    canGenerate,
    email,
    generate,
    options.length,
    showError,
    showToast,
    title,
  ]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        content: {
          padding: theme.spacing.lg,
          gap: theme.spacing.xl,
          paddingBottom: theme.spacing['4xl'],
        },
        footer: {
          gap: theme.spacing.md,
        },
        actions: {
          flexDirection: 'row',
          gap: theme.spacing.md,
        },
        actionButton: {
          flex: 1,
        },
      }),
    [theme],
  );

  return (
    <AnimatedScreen style={styles.container}>
      <ScreenHeader
        title="Generate"
        subtitle="Create strong, unique passwords"
        showBorder={false}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <HeroSection
          title="Secure passwords in one tap"
          subtitle="Generate cryptographically strong passwords tailored to your security needs."
        />

        <PasswordDetailsFields
          title={title}
          email={email}
          onTitleChange={setTitle}
          onEmailChange={setEmail}
          onTitleBlur={() => setTitleTouched(true)}
          titleError={titleError}
          emailError={emailError}
        />

        <PasswordPreviewCard
          password={password}
          onCopyPress={() => copyPassword(password)}
          onSharePress={() => sharePassword(password)}
          onRegeneratePress={handleGenerate}
          regenerateDisabled={!canGenerate}
        />

        <PasswordOptionsPanel
          options={options}
          onOptionsChange={updateOptions}
          error={error}
        />

        <View style={styles.footer}>
          <PrimaryButton
            title="Generate Password"
            fullWidth
            disabled={!canGenerate}
            onPress={handleGenerate}
            accessibilityLabel="Generate new password"
          />
          <View style={styles.actions}>
            <SecondaryButton
              title="Copy"
              disabled={!password}
              onPress={() => copyPassword(password)}
              accessibilityLabel="Copy password"
              style={styles.actionButton}
            />
            <SecondaryButton
              title="Share"
              disabled={!password}
              onPress={() => sharePassword(password)}
              accessibilityLabel="Share password"
              style={styles.actionButton}
            />
          </View>
        </View>
      </ScrollView>
    </AnimatedScreen>
  );
}
