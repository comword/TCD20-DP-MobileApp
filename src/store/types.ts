import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExamDetailState } from 'containers/ExamsScreen/slice';
import { AuthState } from 'services/auth/state';
import { PCState } from 'services/ml/types';
import { UserDetailState } from 'services/userdetail';
import { ThemeState } from 'theme/types';
import { UserPreferenceState } from './preferences';

export interface RootState {
  auth: AuthState;
  PCSrv: PCState;
  pref: UserPreferenceState;
  theme?: ThemeState;
  user?: UserDetailState;
  exams?: ExamDetailState;
}

export const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['theme', 'auth', 'pref'],
  version: 1,
};
