import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useStackScreenOptions } from '@/navigation/screenOptions';
import { SettingsScreen, PrivacyPolicyScreen } from '@/screens';

import type { SettingsStackParamList } from '../types';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export function SettingsStack() {
  const screenOptions = useStackScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    </Stack.Navigator>
  );
}
