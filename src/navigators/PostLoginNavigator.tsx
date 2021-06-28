import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AppScreens } from './ScreenDefs';
import { ThemeContext } from 'styled-components/native';
import DrawerContent from 'containers/DrawerContent';
import ExamsScreen from 'containers/ExamsScreen';
import { useWindowDimensions } from 'react-native';

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
      drawerStyle={isLargeScreen ? null : { width: '100%' }}
      drawerContent={props => <DrawerContent {...props} />}
    >
      <Drawer.Screen
        name={AppScreens.Exams}
        options={navOptions}
        component={ExamsScreen}
      />
    </Drawer.Navigator>
  );
};

export default PostLoginNavigator;
