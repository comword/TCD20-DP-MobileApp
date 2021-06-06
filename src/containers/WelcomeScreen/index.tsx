import React, { useEffect, useLayoutEffect } from 'react';
import { compose, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppScreens } from 'navigators/ScreenDefs';
import { View } from 'react-native';
import tailwind from 'tailwind-rn';

import { useTheme } from 'styled-components/native';
import Text from 'components/Text';
import { Button } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { selectDisplay, themeSliceKey, reducer } from 'theme/slice';
import { RootState } from 'store/types';
import { injectReducer } from 'redux-injectors';
import CameraGLView from 'services/camera/CameraGLView';

import { NativeModulesProxy } from '@unimodules/core';
const { CameraGLModule } = NativeModulesProxy;

type ComponentProps = {
  navigation: StackNavigationProp<any, AppScreens.Welcome>;
};

type Props = ComponentProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const WelcomeScreen: React.FC<Props> = ({ navigation, themeDisplay }) => {
  const theme = useTheme();

  useLayoutEffect(() => {
    const setupCamera = async () => {
      await CameraGLModule.requestCameraPermissionsAsync();
      await CameraGLModule.requestMicrophonePermissionsAsync();
    };
    setupCamera();
  });

  useEffect(() => {
    const setupCamera = async () => {
      await CameraGLModule.startCamera();
    };
    setupCamera();
  });

  return (
    <View style={tailwind('flex h-full w-full')}>
      <StatusBar
        backgroundColor="transparent"
        animated
        translucent
        style={themeDisplay === 'dark' ? 'light' : 'dark'}
      />
      <View style={tailwind('flex-1 pt-16 px-8')}>
        <Button
          mode="contained"
          uppercase={false}
          onPress={() => {
            navigation.navigate(AppScreens.Register);
          }}
          color={theme.colors.primary}
          style={tailwind('mt-6')}
        >
          <Text style={tailwind('text-lg')}>Sign up</Text>
        </Button>
        <Button
          mode="outlined"
          uppercase={false}
          onPress={() => {
            navigation.navigate(AppScreens.Login);
          }}
          style={tailwind('mt-6')}
        >
          <Text style={tailwind('text-lg')}>Log in</Text>
        </Button>
      </View>
      <CameraGLView style={tailwind('flex h-1/2')} />
    </View>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    themeDisplay: selectDisplay(state),
  };
};

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators({}, dispatch);
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: themeSliceKey, reducer: reducer });

export default compose(
  withConnect,
  withReducer
)(WelcomeScreen) as React.ComponentType<ComponentProps>;
