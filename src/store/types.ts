import { AuthState } from 'services/auth/state';
import { BleState } from 'services/ble/slice';
import { WorkOutState } from 'services/workout/types';
import { ThemeState } from 'theme/types';

export interface RootState {
  theme?: ThemeState;
  auth?: AuthState;
  ble?: BleState;
  workout?: WorkOutState;
}
