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
  Caption,
} from 'react-native-paper';
import tailwind from 'tailwind-rn';

import { BeforeStart, ResultDisplay } from 'components/BottomControl';
import DownloadModal from 'components/DownloadModal';
import InfoBanner, { getInfoLevel } from 'components/InfoBanner';
import { RootState } from 'store/types';
import { selectPreference } from 'store/preferences';
import { PCSlice, selectPCSrv, startInvigilateAction } from 'services/ml';
import CameraGLView from 'services/ml/CameraGLView';
import { MLActionTypes } from 'services/ml/types';
import { NativeModulesProxy } from '@unimodules/core';
const { CameraGLModule } = NativeModulesProxy;

type ComponentProps = {
  navigation: StackNavigationProp<any, AppScreens.Camera>;
};

type Props = ComponentProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const CameraScreen: React.FC<Props> = ({
  navigation,
  status,
  results,
  fps,
  cameraId,
  lastError,
  setError,
  startInvigilateAction,
}) => {
  const theme = useTheme();
  const [permGranted, setPermGranted] = useState(false);
  const [isCameraRun, setIsCameraRun] = useState(false);
  const styles = StyleSheet.create({
    container: {
      ...tailwind('flex h-1/2 w-full'),
      backgroundColor: theme.colors.surface,
    },
    fpsText: tailwind('absolute bottom-0'),
  });
  const inApp = Platform.OS !== 'web' && Constants.appOwnership !== 'expo';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <View style={tailwind('flex flex-row')} />,
    });
    const onBack = () => {
      const stopCamera = async () => {
        await CameraGLModule.stopCamera();
        setIsCameraRun(false);
      };
      if (inApp && isCameraRun) stopCamera();
      return false;
    };
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      unsubscribe();
      return onBack();
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
    const setupCamera = async () => {
      if (permGranted) {
        await CameraGLModule.setCameraSize(640, 640);
        await CameraGLModule.startCamera();
        setIsCameraRun(true);
      }
    };
    const indexCamera = async () => {
      if (permGranted) {
        await CameraGLModule.setCameraIndex(parseInt(cameraId, 10));
      }
    };
    if (inApp) indexCamera();
    if (inApp && !isCameraRun) setupCamera();
  }, [cameraId, inApp, isCameraRun, permGranted]);

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
          {status === 'UNLOAD' && (
            <View style={tailwind('flex h-full justify-end')}>
              <InfoBanner
                level={lastError ? getInfoLevel(lastError?.code) : 1}
                msg={lastError ? lastError.msg : ''}
                show={lastError ? lastError.show : false}
                onDismiss={() => setError({ ...lastError!!, show: false })}
              />
            </View>
          )}
          {status === 'LOAD' && (
            <View style={tailwind('flex h-full items-center justify-center')}>
              <BeforeStart onClickStart={() => startInvigilateAction()} />
            </View>
          )}
          {status === 'RUNNING' && !results && (
            <View style={tailwind('flex h-full items-center justify-center')}>
              <ActivityIndicator
                animating
                color={theme.colors.primary}
                size="large"
              />
              <Title>Waiting results...</Title>
            </View>
          )}
          {status === 'RUNNING' && results && (
            <ResultDisplay
              results={Object.keys(MLActionTypes).map((it, idx) => ({
                type: MLActionTypes[it as keyof typeof MLActionTypes],
                prob: results[idx],
              }))}
            />
          )}
          <Caption style={styles.fpsText}>FPS: {fps}</Caption>
        </View>
      </View>
      <DownloadModal onLoaded={setupCamera} />
    </>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    lastError: selectPCSrv(state).lastError,
    status: selectPCSrv(state).status,
    results: selectPCSrv(state).result,
    fps: selectPCSrv(state).fps,
    cameraId: selectPreference(state).useCamera,
  };
};

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      ...PCSlice.actions,
      startInvigilateAction,
    },
    dispatch
  );
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(
  CameraScreen
) as React.ComponentType<ComponentProps>;
