import React from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';

import { AppScreens } from './ScreenDefs';
import WelcomeScreen from 'containers/WelcomeScreen';
import CameraScreen from 'containers/CameraScreen';
import RegisterScreen from 'containers/RegisterScreen';
import LoginScreen from 'containers/LoginScreen';

const PreLoginNavigator: React.FC = () => {
  const Stack = createStackNavigator();
  const TransitionScreenOptions = {
    ...TransitionPresets.SlideFromRightIOS,
  };

  return (
    <Stack.Navigator screenOptions={TransitionScreenOptions}>
      <Stack.Screen
        name={AppScreens.Welcome}
        options={{ headerShown: false }}
        component={WelcomeScreen}
      />
      <Stack.Screen name={AppScreens.Camera} component={CameraScreen} />
      <Stack.Screen name={AppScreens.Register} component={RegisterScreen} />
      <Stack.Screen name={AppScreens.Login} component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default PreLoginNavigator;
