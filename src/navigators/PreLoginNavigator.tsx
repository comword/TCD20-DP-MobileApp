import React from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';

import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

import { AppScreens } from './ScreenDefs';
import WelcomeScreen from 'containers/WelcomeScreen';
import CameraScreen from 'containers/CameraScreen';
import RegisterScreen from 'containers/RegisterScreen';
import LoginScreen from 'containers/LoginScreen';
import { Platform } from 'react-native';

const PreLoginNavigator: React.FC = () => {
  let Stack: any, TransitionScreenOptions;
  if (Platform.OS === 'web') {
    Stack = createStackNavigator();
    TransitionScreenOptions = {
      ...TransitionPresets.SlideFromRightIOS,
    };
  } else {
    enableScreens();
    Stack = createNativeStackNavigator();
    TransitionScreenOptions = {
      stackAnimation: 'slide_from_right',
    };
  }

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
