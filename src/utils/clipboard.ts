import { Clipboard } from 'react-native';

export async function copyToClipboard(text: string): Promise<void> {
  if (!text) {
    throw new Error('Nothing to copy.');
  }

  Clipboard.setString(text);
}
