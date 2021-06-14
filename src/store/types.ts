// import { AuthState } from 'services/auth/state';
import { CameraState } from 'services/camera/slice';
import { PCState } from 'services/ml/types';
import { ThemeState } from 'theme/types';

export interface RootState {
  theme?: ThemeState;
  PCSrv: PCState;
  CameraSrv: CameraState;
  // auth?: AuthState;
}
