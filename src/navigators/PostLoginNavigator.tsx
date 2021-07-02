import React, { useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AppScreens } from './ScreenDefs';
import { ThemeContext } from 'styled-components/native';
import DrawerContent from 'containers/DrawerContent';
import ExamsScreen from 'containers/ExamsScreen';
import ProfileScreen from 'containers/ProfileScreen';
import CameraScreen from 'containers/CameraScreen';

const PostLoginNavigator: React.FC = () => {
  const themeContext = useContext(ThemeContext);
  const dimensions = useWindowDimensions();
  const Drawer = createDrawerNavigator();
  const navOptions = {
    headerStyle: {
      backgroundColor: themeContext.colors.primary,
    },
  };
  const isLargeScreen = dimensions.width >= 768;
  return (
    <Drawer.Navigator
      drawerType={isLargeScreen ? 'permanent' : 'back'}
      drawerContent={props => <DrawerContent {...props} />}
    >
      <Drawer.Screen
        name={AppScreens.Exams}
        options={navOptions}
        component={ExamsScreen}
      />
      <Drawer.Screen
        name={AppScreens.Profile}
        options={navOptions}
        component={ProfileScreen}
      />
      <Drawer.Screen
        name={AppScreens.Camera}
        options={navOptions}
        component={CameraScreen}
      />
    </Drawer.Navigator>
  );
};

export default PostLoginNavigator;
