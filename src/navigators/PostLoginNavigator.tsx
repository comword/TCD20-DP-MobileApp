import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AppScreens } from './ScreenDefs';
import { ThemeContext } from 'styled-components/native';
import DrawerContent from 'containers/DrawerContent';
import HomeScreen from 'containers/HomeScreen';

const PostLoginNavigator: React.FC = () => {
  const themeContext = useContext(ThemeContext);
  const Drawer = createDrawerNavigator();
  const navOptions = {
    headerStyle: {
      backgroundColor: themeContext.colors.primary,
    },
  };
  return (
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name={AppScreens.Home}
        options={navOptions}
        component={HomeScreen}
      />
    </Drawer.Navigator>
  );
};

export default PostLoginNavigator;
