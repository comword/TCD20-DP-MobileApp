import { ErrorMsg } from 'services/types';

export interface UserDetailState {
  lastError?: ErrorMsg;
  firstName: string;
  lastName: string;
  studentId: string;
  birthday: string;
  email: string;
  avatar: string;
}
