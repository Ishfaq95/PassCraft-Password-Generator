import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AnimatedScreen } from '@/components/AnimatedScreen';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import {
  DefaultLengthSheet,
  DefaultOptionsSheet,
} from '@/components/DefaultGeneratorSheets';
import { PinSetupSheet } from '@/components/AppLock/PinSetupSheet';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SettingsGroup } from '@/components/SettingsGroup';
import { SettingsRow } from '@/components/SettingsRow';
import { ThemeModeSelector } from '@/components/ThemeModeSelector';
import { brand } from '@/assets/branding';
import {
  useAppLock,
  useAppSettings,
  usePasswordDeletion,
  usePasswordExport,
} from '@/hooks';
import type { SettingsStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import {
  formatDefaultLengthValue,
  formatDefaultOptionsSummary,
} from '@/utils/formatAppSettings';

export function SettingsScreen() {
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();
  const { exportPasswords, isExporting } = usePasswordExport();
  const { requestDeleteAll, confirmDialogProps } = usePasswordDeletion();
  const {
    settings,
    themeMode,
    setThemeMode,
    updateDefaultLength,
    updateDefaultOptions,
    saveDefaultOptions,
    rateApp,
    shareApplication,
  } = useAppSettings();
  const {
    settings: lockSettings,
    pinSheetVisible,
    pinSheetMode,
    biometricAvailable,
    closePinSheet,
    handleAppLockToggle,
    openChangePinSheet,
    createPin,
    changePin,
    disableWithPin,
    setBiometricUnlockEnabled,
  } = useAppLock();

  const [lengthSheetVisible, setLengthSheetVisible] = useState(false);
  const [optionsSheetVisible, setOptionsSheetVisible] = useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        screen: {
          flex: 1,
        },
        content: {
          padding: theme.spacing.lg,
          gap: theme.spacing.xl,
          paddingBottom: theme.spacing['4xl'],
        },
        version: {
          ...theme.typography.bodySmall,
          color: theme.colors.textTertiary,
          textAlign: 'center',
          marginTop: theme.spacing.md,
        },
      }),
    [theme],
  );

  const defaultLengthLabel = formatDefaultLengthValue(
    settings.defaultGeneratorOptions.length,
  );
  const defaultOptionsLabel = formatDefaultOptionsSummary(
    settings.defaultGeneratorOptions,
  );

  return (
    <View style={styles.container}>
      <AnimatedScreen style={styles.screen}>
        <ScreenHeader title="Settings" showBorder={false} />
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <SettingsGroup title="Appearance">
            <ThemeModeSelector value={themeMode} onChange={setThemeMode} />
          </SettingsGroup>

          <SettingsGroup title="Security">
            <SettingsRow
              icon="lock-closed-outline"
              label="App lock"
              description={
                lockSettings.appLockEnabled
                  ? 'Require PIN when opening the app'
                  : 'Protect the app with a PIN'
              }
              rightElement="toggle"
              toggleValue={lockSettings.appLockEnabled}
              onToggleChange={handleAppLockToggle}
            />
            <SettingsRow
              icon="key-outline"
              label="Change PIN"
              description="Update your app lock PIN"
              onPress={openChangePinSheet}
              disabled={!lockSettings.appLockEnabled}
            />
            <SettingsRow
              icon="finger-print-outline"
              label="Biometric unlock"
              description={
                biometricAvailable
                  ? 'Unlock with Face ID or fingerprint'
                  : 'Coming in a future update'
              }
              rightElement="toggle"
              toggleValue={lockSettings.biometricUnlockEnabled}
              onToggleChange={setBiometricUnlockEnabled}
              disabled={!lockSettings.appLockEnabled || !biometricAvailable}
              showDivider={false}
            />
          </SettingsGroup>

          <SettingsGroup title="Generator">
            <SettingsRow
              icon="resize-outline"
              label="Default password length"
              description={defaultLengthLabel}
              onPress={() => setLengthSheetVisible(true)}
            />
            <SettingsRow
              icon="options-outline"
              label="Default options"
              description={defaultOptionsLabel}
              onPress={() => setOptionsSheetVisible(true)}
              showDivider={false}
            />
          </SettingsGroup>

          <SettingsGroup title="Data">
            <SettingsRow
              icon="document-text-outline"
              label="Export passwords"
              description={
                isExporting
                  ? 'Preparing TXT export…'
                  : 'Save and share password history as TXT'
              }
              onPress={exportPasswords}
              disabled={isExporting}
            />
            <SettingsRow
              icon="trash-outline"
              label="Delete all"
              description="Remove all non-favorite history"
              destructive
              onPress={requestDeleteAll}
              showDivider={false}
            />
          </SettingsGroup>

          <SettingsGroup title="About">
            <SettingsRow
              icon="shield-checkmark-outline"
              label="Privacy policy"
              onPress={() => navigation.navigate('PrivacyPolicy')}
            />
            <SettingsRow
              icon="star-outline"
              label="Rate app"
              onPress={rateApp}
            />
            <SettingsRow
              icon="share-social-outline"
              label="Share app"
              onPress={shareApplication}
            />
            <SettingsRow
              icon="information-circle-outline"
              label="Version"
              rightElement="value"
              value={brand.version}
              showDivider={false}
            />
          </SettingsGroup>

          <Text style={styles.version}>
            {brand.name} v{brand.version}
          </Text>
        </ScrollView>
      </AnimatedScreen>

      <DefaultLengthSheet
        visible={lengthSheetVisible}
        length={settings.defaultGeneratorOptions.length}
        onClose={() => setLengthSheetVisible(false)}
        onChange={updateDefaultLength}
      />

      <DefaultOptionsSheet
        visible={optionsSheetVisible}
        options={settings.defaultGeneratorOptions}
        onClose={() => setOptionsSheetVisible(false)}
        onOptionsChange={updateDefaultOptions}
        onSave={saveDefaultOptions}
      />

      <PinSetupSheet
        visible={pinSheetVisible}
        mode={pinSheetMode}
        onClose={closePinSheet}
        onCreatePin={createPin}
        onChangePin={changePin}
        onDisableWithPin={disableWithPin}
      />

      {confirmDialogProps ? <ConfirmDialog {...confirmDialogProps} /> : null}
    </View>
  );
}
