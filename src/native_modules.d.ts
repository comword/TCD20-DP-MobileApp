import '@unimodules/core';
import { ProxyNativeModule } from '@unimodules/react-native-adapter';
import { PermissionResponse } from 'expo-permissions';

export type IPostureClassify = {
  initTFLite: (path: string) => Promise<boolean>;
  deInitTFLite: () => Promise<boolean>;
  getTFInitialised: () => Promise<boolean>;
  getReporterInitialised: () => Promise<boolean>;
  initReporter: (address: string) => Promise<boolean>;
  deinitReporter: () => Promise<boolean>;
  reporterSetAuth: (authKey: string) => Promise<boolean>;
  reporterSetExamId: (examId: string) => Promise<boolean>;
};

export type ICameraGLModule = {
  requestPermissionsAsync: () => Promise<PermissionResponse>;
  requestCameraPermissionsAsync: () => Promise<PermissionResponse>;
  requestMicrophonePermissionsAsync: () => Promise<PermissionResponse>;
  getPermissionsAsync: () => Promise<PermissionResponse>;
  getCameraPermissionsAsync: () => Promise<PermissionResponse>;
  getMicrophonePermissionsAsync: () => Promise<PermissionResponse>;
  setCameraIndex: (camIdx: number) => Promise<boolean>;
  startCamera: () => Promise<boolean>;
  stopCamera: () => Promise<boolean>;
  startInvigilate: () => Promise<boolean>;
  stopInvigilate: () => Promise<boolean>;
  setCameraSize: (width: number, height: number) => Promise<boolean>;
  initCamera: (haarCascade: string, modelLBF: string) => Promise<boolean>;
};

declare module '@unimodules/core' {
  declare const NativeModulesProxy: {
    PostureClassify: ProxyNativeModule & IPostureClassify;
    CameraGLModule: ProxyNativeModule & ICameraGLModule;
  };
}
