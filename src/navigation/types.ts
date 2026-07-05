import type { NavigatorScreenParams } from '@react-navigation/native';

export type GenerateStackParamList = {
  GenerateMain: undefined;
};

export type HistoryStackParamList = {
  HistoryMain: undefined;
};

export type FavoritesStackParamList = {
  FavoritesMain: undefined;
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
  PrivacyPolicy: undefined;
};

export type MainTabParamList = {
  Generate: NavigatorScreenParams<GenerateStackParamList>;
  History: NavigatorScreenParams<HistoryStackParamList>;
  Favorites: NavigatorScreenParams<FavoritesStackParamList>;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

export type RootStackParamList = MainTabParamList;
