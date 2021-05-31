import React, { useContext } from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { AppScreens } from './ScreenDefs';
import { ThemeContext } from 'styled-components/native';
import WelcomeScreen from 'containers/WelcomeScreen';

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
    </Stack.Navigator>
  );
};

export default AppNavigator;
