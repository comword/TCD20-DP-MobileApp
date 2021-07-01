import React, { useEffect, useLayoutEffect } from 'react';
import { compose, bindActionCreators, Dispatch } from 'redux';
import { Platform } from '@unimodules/react-native-adapter';
import Constants from 'expo-constants';
import { connect } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppScreens } from 'navigators/ScreenDefs';
import { View, StyleSheet } from 'react-native';
import { useTheme, Text, ActivityIndicator, Title } from 'react-native-paper';
import tailwind from 'tailwind-rn';

import { RootState } from 'store/types';
// import { injectReducer } from 'redux-injectors';
import CameraGLView from 'services/ml/CameraGLView';
import { MLActionTypes } from 'services/ml/types';

import { NativeModulesProxy } from '@unimodules/core';
import ResultDisplay from 'components/BottomControl/ResultDisplay';
import { selectPCSrv } from 'services/ml';
const { CameraGLModule } = NativeModulesProxy;

type ComponentProps = {
  navigation: StackNavigationProp<any, AppScreens.Camera>;
};

type Props = ComponentProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const CameraScreen: React.FC<Props> = ({ navigation, results }) => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {
      ...tailwind('flex h-1/2 w-full'),
      backgroundColor: theme.colors.surface,
    },
    toolbar: tailwind('absolute w-full top-0 left-0 right-0'),
  });
  const inApp = Platform.OS !== 'web' && Constants.appOwnership !== 'expo';
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <View style={tailwind('flex flex-row')} />,
    });
    const setupCamera = async () => {
      await CameraGLModule.requestCameraPermissionsAsync();
      await CameraGLModule.requestMicrophonePermissionsAsync();
    };
    if (inApp) setupCamera();
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
    if (inApp) setupCamera();
  });

  const onBack = () => {
    const stopCamera = async () => {
      await CameraGLModule.stopCamera();
    };
    if (inApp) stopCamera();
    return false;
  };

  return (
    <View style={tailwind('flex h-full w-full')}>
      <View style={styles.container}>
        {inApp && <CameraGLView style={tailwind('flex h-full w-full')} />}
        {!inApp && (
          <View
            style={tailwind(
              'flex bg-blue-300 h-full items-center justify-center'
            )}
          >
            <Text>Native code not available in web or expo-go app</Text>
          </View>
        )}
      </View>
      <View style={styles.container}>
        {!results && (
          <View style={tailwind('flex h-full items-center justify-center')}>
            <ActivityIndicator
              animating
              color={theme.colors.primary}
              size="large"
            />
            <Title>Waiting results...</Title>
          </View>
        )}
        {results && results.length === Object.keys(MLActionTypes).length && (
          <ResultDisplay
            results={Object.keys(MLActionTypes).map((it, idx) => ({
              type: MLActionTypes[it as keyof typeof MLActionTypes],
              prob: results[idx],
            }))}
          />
        )}
      </View>
    </View>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    results: selectPCSrv(state).result,
  };
};

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators({}, dispatch);
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(
  CameraScreen
) as React.ComponentType<ComponentProps>;
