import React, { useContext } from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { AppScreens } from './ScreenDefs';
import { ThemeContext } from 'styled-components/native';
import WelcomeScreen from 'containers/WelcomeScreen';
import CameraScreen from 'containers/CameraScreen';
import RegisterScreen from 'containers/RegisterScreen';
import LoginScreen from 'containers/LoginScreen';

const TransitionScreenOptions = {
  ...TransitionPresets.SlideFromRightIOS,
};

const AppNavigator: React.FC = () => {
  const themeContext = useContext(ThemeContext);
  const Stack = createStackNavigator();
  const navOptions = {
    headerStyle: {
      backgroundColor: themeContext.colors.primary,
    },
  };
  return (
    <Stack.Navigator screenOptions={TransitionScreenOptions}>
      <Stack.Screen
        name={AppScreens.Welcome}
        options={{ headerShown: false, ...navOptions }}
        component={WelcomeScreen}
      />
      <Stack.Screen name={AppScreens.Camera} component={CameraScreen} />
      <Stack.Screen
        name={AppScreens.Register}
        options={navOptions}
        component={RegisterScreen}
      />
      <Stack.Screen
        name={AppScreens.Login}
        options={navOptions}
        component={LoginScreen}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
