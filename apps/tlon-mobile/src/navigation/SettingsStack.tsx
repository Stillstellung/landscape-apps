import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useScreenOptions } from '@tloncorp/app/hooks/useScreenOptions';
import { useContacts } from '@tloncorp/shared/dist';
import { AppDataContextProvider } from '@tloncorp/ui';

import { FeatureFlagScreenController } from '../controllers/FeatureFlagScreenController';
import { ProfileScreenController } from '../controllers/ProfileScreenController';
import { RootStackParamList, SettingsStackParamList } from '../types';

type Props = BottomTabScreenProps<RootStackParamList, 'Profile'>;
const Stack = createNativeStackNavigator<SettingsStackParamList>();

export const SettingsStack = ({ navigation }: Props) => {
  const screenOptions = useScreenOptions({
    overrides: {
      headerShown: false,
    },
  });

  const { data: contacts } = useContacts();

  return (
    <AppDataContextProvider contacts={contacts ?? []}>
      <Stack.Navigator
        initialRouteName="Settings"
        screenOptions={screenOptions}
      >
        <Stack.Screen name="Settings" component={ProfileScreenController} />
        <Stack.Screen
          name="FeatureFlags"
          component={FeatureFlagScreenController}
        />
      </Stack.Navigator>
    </AppDataContextProvider>
  );
};
