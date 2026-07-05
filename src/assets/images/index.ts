export const images = {
  logo: require('./securepass-logo.png'),
} as const;

export type ImageAsset = keyof typeof images;
