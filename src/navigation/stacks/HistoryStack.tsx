import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useStackScreenOptions } from '@/navigation/screenOptions';
import { HistoryScreen } from '@/screens';

import type { HistoryStackParamList } from '../types';

const Stack = createNativeStackNavigator<HistoryStackParamList>();

export function HistoryStack() {
  const screenOptions = useStackScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="HistoryMain" component={HistoryScreen} />
    </Stack.Navigator>
  );
}
