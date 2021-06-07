import React, { useEffect, useLayoutEffect } from 'react';
import { compose, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppScreens } from 'navigators/ScreenDefs';
import { View } from 'react-native';
import tailwind from 'tailwind-rn';

import { StatusBar } from 'expo-status-bar';
import { selectDisplay, themeSliceKey, reducer } from 'theme/slice';
import { RootState } from 'store/types';
import { injectReducer } from 'redux-injectors';
import CameraGLView from 'services/camera/CameraGLView';

import { NativeModulesProxy } from '@unimodules/core';
const { CameraGLModule } = NativeModulesProxy;

type ComponentProps = {
  navigation: StackNavigationProp<any, AppScreens.Camera>;
};

type Props = ComponentProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const CameraScreen: React.FC<Props> = ({ navigation, themeDisplay }) => {
  useLayoutEffect(() => {
    const setupCamera = async () => {
      await CameraGLModule.requestCameraPermissionsAsync();
      await CameraGLModule.requestMicrophonePermissionsAsync();
    };
    setupCamera();
  });

  useEffect(() =>
    navigation.addListener('beforeRemove', () => {
      return onBack();
    })
  );

  useEffect(() => {
    const setupCamera = async () => {
      await CameraGLModule.setCameraSize(640, 640);
      await CameraGLModule.startCamera();
    };
    setupCamera();
  });

  const onBack = () => {
    const stopCamera = async () => {
      await CameraGLModule.stopCamera();
    };
    stopCamera();
    return false;
  };

  return (
    <View style={tailwind('flex h-full w-full')}>
      <StatusBar
        backgroundColor="transparent"
        animated
        translucent
        style={themeDisplay === 'dark' ? 'light' : 'dark'}
      />
      <CameraGLView style={tailwind('h-full w-full')} />
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
)(CameraScreen) as React.ComponentType<ComponentProps>;
