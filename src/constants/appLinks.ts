import { brand } from '@/assets/branding';

export const APP_LINKS = {
  privacyPolicy: 'https://securepass.app/privacy',
  playStore: 'market://details?id=com.securepass',
  playStoreWeb: 'https://play.google.com/store/apps/details?id=com.securepass',
  appStore: 'https://apps.apple.com/app/securepass',
  shareWeb: 'https://securepass.app',
} as const;

export const APP_SHARE_MESSAGE = `Check out ${brand.name} — ${brand.tagline} ${APP_LINKS.shareWeb}`;
