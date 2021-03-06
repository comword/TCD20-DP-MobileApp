import React from 'react';

import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { AppScreens } from './ScreenDefs';
import WelcomeScreen from 'containers/WelcomeScreen';
import RegisterScreen from 'containers/RegisterScreen';
import LoginScreen from 'containers/LoginScreen';

const PreLoginNavigator: React.FC = () => {
  enableScreens();
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ stackAnimation: 'slide_from_right' }}>
      <Stack.Screen
        name={AppScreens.Welcome}
        options={{ headerShown: false }}
        component={WelcomeScreen}
      />
      <Stack.Screen name={AppScreens.Register} component={RegisterScreen} />
      <Stack.Screen name={AppScreens.Login} component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default PreLoginNavigator;
