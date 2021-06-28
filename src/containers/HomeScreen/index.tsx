import React from 'react';
import { compose, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppScreens } from 'navigators/ScreenDefs';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { View } from 'react-native';
import tailwind from 'tailwind-rn';

import { Button } from 'react-native-paper';
import { RootState } from 'store/types';
import { injectReducer } from 'redux-injectors';
import { useEffect } from 'react';

type ComponentProps = {
  navigation: DrawerNavigationProp<any, AppScreens.Home>;
};

type Props = ComponentProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    navigation.openDrawer();
  });
  return <View />;
};

const mapStateToProps = (state: RootState) => {
  return {};
};

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators({}, dispatch);
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(
  HomeScreen
) as React.ComponentType<ComponentProps>;
