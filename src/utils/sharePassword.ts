import Share from 'react-native-share';

export async function sharePassword(password: string): Promise<void> {
  if (!password) {
    throw new Error('Nothing to share.');
  }

  await Share.open({
    message: password,
    title: 'Share password',
  });
}
