import '@unimodules/core';
import { NativeModule } from '@unimodules/react-native-adapter';

export type PostureClassifyInterface = {
  initTFLite: (path: string) => Promise<boolean>;
  deInitTFLite: () => Promise<boolean>;
  getTFLiteInitialised: () => Promise<boolean>;
};

declare module '@unimodules/core' {
  declare const NativeModulesProxy: {
    PostureClassify: NativeModule | PostureClassifyInterface;
  };
}
