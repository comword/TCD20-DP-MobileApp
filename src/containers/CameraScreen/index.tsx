import React, { useLayoutEffect, useEffect, useState } from 'react';
import { compose, bindActionCreators, Dispatch } from 'redux';
import { Platform } from '@unimodules/react-native-adapter';
import {
  PermissionResponse,
  PermissionStatus,
} from 'unimodules-permissions-interface';
import Constants from 'expo-constants';
import { connect } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppScreens } from 'navigators/ScreenDefs';
import { View, StyleSheet } from 'react-native';
import {
  useTheme,
  Text,
  ActivityIndicator,
  Title,
  Button,
} from 'react-native-paper';
import tailwind from 'tailwind-rn';

import { RootState } from 'store/types';
import CameraGLView from 'services/ml/CameraGLView';
import { MLActionTypes } from 'services/ml/types';

import { NativeModulesProxy } from '@unimodules/core';
import ResultDisplay from 'components/BottomControl/ResultDisplay';
import { selectPCSrv } from 'services/ml';
import DownloadModal from 'components/DownloadModal';
const { CameraGLModule } = NativeModulesProxy;

type ComponentProps = {
  navigation: StackNavigationProp<any, AppScreens.Camera>;
};

type Props = ComponentProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const CameraScreen: React.FC<Props> = ({ navigation, results }) => {
  const theme = useTheme();
  const [permGranted, setPermGranted] = useState(false);
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
  });

  const setupCamera = () => {
    const asyncCamera = async () => {
      const camPermResp =
        (await CameraGLModule.requestCameraPermissionsAsync()) as PermissionResponse;
      await CameraGLModule.requestMicrophonePermissionsAsync();
      if (camPermResp.status === PermissionStatus.GRANTED) {
        setPermGranted(true);
      }
    };
    if (inApp) asyncCamera();
  };

  useEffect(() => {
    const onBack = () => {
      const stopCamera = async () => {
        await CameraGLModule.stopCamera();
      };
      if (inApp) stopCamera();
      return false;
    };
    const asyncCamera = async () => {
      if (permGranted) {
        await CameraGLModule.setCameraSize(640, 640);
        await CameraGLModule.startCamera();
        const unsubscribe = navigation.addListener('beforeRemove', () => {
          unsubscribe();
          return onBack();
        });
      }
    };
    if (inApp) asyncCamera();
  }, [inApp, navigation, permGranted]);

  return (
    <>
      <View style={tailwind('flex h-full w-full')}>
        <View style={styles.container}>
          {!inApp && (
            <View
              style={tailwind(
                'flex bg-blue-300 h-full items-center justify-center'
              )}
            >
              <Text>Native code not available in web or expo-go app</Text>
            </View>
          )}
          {inApp && !permGranted && (
            <View
              style={tailwind(
                'flex bg-blue-300 h-full items-center justify-center'
              )}
            >
              <Title style={tailwind('mb-4')}>
                Camera permission is required.
              </Title>
              <Button mode="contained" onPress={() => setupCamera()}>
                Request again
              </Button>
            </View>
          )}
          {inApp && permGranted && (
            <CameraGLView style={tailwind('flex h-full w-full')} />
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
      <DownloadModal onLoaded={setupCamera} />
    </>
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
