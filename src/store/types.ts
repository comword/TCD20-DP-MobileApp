import { AuthState } from 'services/auth/state';
import { PCState } from 'services/ml/types';
import { ThemeState } from 'theme/types';

export interface RootState {
  theme?: ThemeState;
  PCSrv: PCState;
  auth?: AuthState;
}
