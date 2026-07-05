import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useStackScreenOptions } from '@/navigation/screenOptions';
import { FavoritesScreen } from '@/screens';

import type { FavoritesStackParamList } from '../types';

const Stack = createNativeStackNavigator<FavoritesStackParamList>();

export function FavoritesStack() {
  const screenOptions = useStackScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="FavoritesMain" component={FavoritesScreen} />
    </Stack.Navigator>
  );
}
