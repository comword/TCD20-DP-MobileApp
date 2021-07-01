import { ExamDetailState } from 'containers/ExamsScreen/slice';
import { AuthState } from 'services/auth/state';
import { PCState } from 'services/ml/types';
import { ThemeState } from 'theme/types';
import { UserDetailState } from './UserDetail';

export interface RootState {
  auth: AuthState;
  PCSrv: PCState;
  theme?: ThemeState;
  user?: UserDetailState;
  exams?: ExamDetailState;
}
