// package: signUpIn
// file: signUpIn.proto

import * as signUpIn_pb from "./signUpIn_pb";
import {grpc} from "@improbable-eng/grpc-web";

type SignUpInSignUp = {
  readonly methodName: string;
  readonly service: typeof SignUpIn;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof signUpIn_pb.SignUpRequest;
  readonly responseType: typeof signUpIn_pb.SignUpInResponse;
};

type SignUpInSignIn = {
  readonly methodName: string;
  readonly service: typeof SignUpIn;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof signUpIn_pb.SignInRequest;
  readonly responseType: typeof signUpIn_pb.SignUpInResponse;
};

type SignUpInSignOut = {
  readonly methodName: string;
  readonly service: typeof SignUpIn;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof signUpIn_pb.SignOutRequest;
  readonly responseType: typeof signUpIn_pb.CommonGetResponse;
};

type SignUpInRefreshToken = {
  readonly methodName: string;
  readonly service: typeof SignUpIn;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof signUpIn_pb.CommonGetRequest;
  readonly responseType: typeof signUpIn_pb.SignUpInResponse;
};

export class SignUpIn {
  static readonly serviceName: string;
  static readonly SignUp: SignUpInSignUp;
  static readonly SignIn: SignUpInSignIn;
  static readonly SignOut: SignUpInSignOut;
  static readonly RefreshToken: SignUpInRefreshToken;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class SignUpInClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  signUp(
    requestMessage: signUpIn_pb.SignUpRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: signUpIn_pb.SignUpInResponse|null) => void
  ): UnaryResponse;
  signUp(
    requestMessage: signUpIn_pb.SignUpRequest,
    callback: (error: ServiceError|null, responseMessage: signUpIn_pb.SignUpInResponse|null) => void
  ): UnaryResponse;
  signIn(
    requestMessage: signUpIn_pb.SignInRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: signUpIn_pb.SignUpInResponse|null) => void
  ): UnaryResponse;
  signIn(
    requestMessage: signUpIn_pb.SignInRequest,
    callback: (error: ServiceError|null, responseMessage: signUpIn_pb.SignUpInResponse|null) => void
  ): UnaryResponse;
  signOut(
    requestMessage: signUpIn_pb.SignOutRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: signUpIn_pb.CommonGetResponse|null) => void
  ): UnaryResponse;
  signOut(
    requestMessage: signUpIn_pb.SignOutRequest,
    callback: (error: ServiceError|null, responseMessage: signUpIn_pb.CommonGetResponse|null) => void
  ): UnaryResponse;
  refreshToken(
    requestMessage: signUpIn_pb.CommonGetRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: signUpIn_pb.SignUpInResponse|null) => void
  ): UnaryResponse;
  refreshToken(
    requestMessage: signUpIn_pb.CommonGetRequest,
    callback: (error: ServiceError|null, responseMessage: signUpIn_pb.SignUpInResponse|null) => void
  ): UnaryResponse;
}

