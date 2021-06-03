import { NativeModules } from 'react-native';
const { PostureClassify } = NativeModules;

interface IPostureClassify {
  initTFLite: (callback: (result: boolean) => void) => void;
  deInitTFLite: () => void;
}

export default PostureClassify as IPostureClassify;
