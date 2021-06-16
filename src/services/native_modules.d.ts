import '@unimodules/core';
import { NativeModule } from '@unimodules/react-native-adapter';
import { PermissionResponse } from 'expo-permissions';

export type IPostureClassify = {
  initTFLite: (path: string) => Promise<boolean>;
  deInitTFLite: () => Promise<boolean>;
  getTFLiteInitialised: () => Promise<boolean>;
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
  setCameraSize: (width: number, height: number) => Promise<boolean>;
  initCamera: (haarCascade: string, modelLBF: string) => Promise<boolean>;
};

declare module '@unimodules/core' {
  declare const NativeModulesProxy: {
    PostureClassify: NativeModule & IPostureClassify;
    CameraGLModule: NativeModule & ICameraGLModule;
  };
}
