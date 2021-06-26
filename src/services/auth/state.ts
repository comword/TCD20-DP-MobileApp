import { ErrorMsg } from 'services/types';

export interface AuthState {
  lastError?: ErrorMsg;
  authKey: string;
  refreshKey: string;
}
