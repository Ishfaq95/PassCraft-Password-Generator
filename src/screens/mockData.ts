import type { PasswordStrengthLevel } from '@/types';

export type PasswordListItem = {
  id: string;
  title: string;
  username?: string;
  password: string;
  website?: string;
  strength?: PasswordStrengthLevel;
  isFavorite?: boolean;
  generatedAt?: string;
};

export const MOCK_GENERATED_PASSWORD = 'K9#mPx2$vLq@4nRw';

export const MOCK_HISTORY: PasswordListItem[] = [
  {
    id: '1',
    title: 'Gmail',
    username: 'alex@email.com',
    password: 'Tr9#kL2$mNx@7pQw',
    website: 'mail.google.com',
    strength: 4,
    isFavorite: true,
    generatedAt: '2 hours ago',
  },
  {
    id: '2',
    title: 'GitHub',
    username: 'alexdev',
    password: 'Hw5!vB8@nKp#3xLz',
    website: 'github.com',
    strength: 4,
    generatedAt: 'Yesterday',
  },
  {
    id: '3',
    title: 'Netflix',
    username: 'alex@email.com',
    password: 'Qm2$rT9#wKp@5nBx',
    website: 'netflix.com',
    strength: 3,
    generatedAt: '3 days ago',
  },
  {
    id: '4',
    title: 'AWS Console',
    username: 'admin@company.io',
    password: 'Zx8!mN4#kLp@9vQw',
    website: 'aws.amazon.com',
    strength: 4,
    generatedAt: 'Last week',
  },
];

export const MOCK_FAVORITES: PasswordListItem[] = [
  {
    id: 'f1',
    title: 'Gmail',
    username: 'alex@email.com',
    password: 'Tr9#kL2$mNx@7pQw',
    website: 'mail.google.com',
    strength: 4,
    isFavorite: true,
  },
  {
    id: 'f2',
    title: '1Password',
    username: 'alex@email.com',
    password: 'Jp7#kR2$mWx@4nTq',
    website: '1password.com',
    strength: 4,
    isFavorite: true,
  },
  {
    id: 'f3',
    title: 'Banking',
    username: 'alex@email.com',
    password: 'Bn3!vK8@pLx#6mQw',
    website: 'chase.com',
    strength: 4,
    isFavorite: true,
  },
];
