module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
        },
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
      },
    ],
    ...(process.env.BABEL_ENV === 'production' ||
    process.env.NODE_ENV === 'production'
      ? [['transform-remove-console', { exclude: ['error'] }]]
      : []),
    'react-native-reanimated/plugin',
  ],
};
