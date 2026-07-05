import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useStackScreenOptions } from '@/navigation/screenOptions';
import { GenerateScreen } from '@/screens';

import type { GenerateStackParamList } from '../types';

const Stack = createNativeStackNavigator<GenerateStackParamList>();

export function GenerateStack() {
  const screenOptions = useStackScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="GenerateMain" component={GenerateScreen} />
    </Stack.Navigator>
  );
}
