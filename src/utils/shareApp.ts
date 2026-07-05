import Share from 'react-native-share';

import { APP_SHARE_MESSAGE } from '@/constants/appLinks';
import { brand } from '@/assets/branding';

export async function shareApp(): Promise<void> {
  await Share.open({
    title: `Share ${brand.name}`,
    message: APP_SHARE_MESSAGE,
  });
}

export function isShareAppCancelled(error: unknown): boolean {
  if (!error || typeof error !== 'object' || !('message' in error)) {
    return false;
  }

  const message = String(error.message).toLowerCase();

  return message.includes('user did not share') || message.includes('cancel');
}
