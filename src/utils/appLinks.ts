import { Linking, Platform } from 'react-native';

import { APP_LINKS } from '@/constants/appLinks';

export async function openPrivacyPolicy(): Promise<void> {
  const opened = await Linking.openURL(APP_LINKS.privacyPolicy);

  if (!opened) {
    throw new Error('Unable to open privacy policy.');
  }
}

export async function openRateApp(): Promise<void> {
  const url = Platform.select({
    ios: APP_LINKS.appStore,
    android: APP_LINKS.playStore,
    default: APP_LINKS.shareWeb,
  });

  if (!url) {
    throw new Error('Store link is unavailable.');
  }

  const canOpen = await Linking.canOpenURL(url);

  if (canOpen) {
    await Linking.openURL(url);
    return;
  }

  if (Platform.OS === 'android') {
    await Linking.openURL(APP_LINKS.playStoreWeb);
    return;
  }

  throw new Error('Unable to open app store.');
}
