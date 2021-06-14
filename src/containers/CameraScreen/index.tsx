import React, { useEffect, useLayoutEffect } from 'react';
import { compose, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppScreens } from 'navigators/ScreenDefs';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import tailwind from 'tailwind-rn';

import { StatusBar } from 'expo-status-bar';
import { selectDisplay, themeSliceKey, reducer } from 'theme/slice';
import { RootState } from 'store/types';
import { injectReducer } from 'redux-injectors';
import CameraGLView from 'services/ml/CameraGLView';
import { MLActionTypes } from 'services/ml/types';

import { NativeModulesProxy } from '@unimodules/core';
import ResultDisplay from 'components/ResultDisplay';
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

  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {
      ...tailwind('flex h-1/2 w-full'),
      backgroundColor: theme.colors.surface,
    },
  });

  return (
    <View style={tailwind('flex h-full w-full')}>
      <StatusBar
        backgroundColor="transparent"
        animated
        translucent
        style={themeDisplay === 'dark' ? 'light' : 'dark'}
      />
      <View style={styles.container}>
        <CameraGLView style={tailwind('flex h-full w-full')} />
      </View>
      <View style={styles.container}>
        <ResultDisplay
          results={[
            {
              type: MLActionTypes.Unknown,
              prob: 0.6,
            },
            {
              type: MLActionTypes.LookScreen,
              prob: 0.4,
            },
          ]}
        />
      </View>
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
