import { SignUpInClient } from 'services/gen-proto/signUpIn_pb_service';
import { StudentAppClient } from 'services/gen-proto/student_pb_service';
import { RpcClient } from './rpcClient';

type Fn = undefined | ((...args: any[]) => any);

class TypeStudentApp {
  upPredictResult: Fn = undefined;
  getExams: Fn = undefined;
  getPredicts: Fn = undefined;
  getUserDetail: Fn = undefined;
  putUserDetail: Fn = undefined;
}

class TypeSignUpInClient {
  signUp: Fn = undefined;
  signIn: Fn = undefined;
  signOut: Fn = undefined;
  refreshToken: Fn = undefined;
}

export const rpcSignUpInClient = new RpcClient(
  SignUpInClient,
  new TypeSignUpInClient()
);
export const rpcStudentAppClient = new RpcClient(
  StudentAppClient,
  new TypeStudentApp()
);
