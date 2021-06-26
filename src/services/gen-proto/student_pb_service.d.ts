// package: student
// file: student.proto

import * as student_pb from "./student_pb";
import {grpc} from "@improbable-eng/grpc-web";

type StudentAppUpPredictResult = {
  readonly methodName: string;
  readonly service: typeof StudentApp;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof student_pb.ModelPredict;
  readonly responseType: typeof student_pb.CommonGetResponse;
};

type StudentAppGetExams = {
  readonly methodName: string;
  readonly service: typeof StudentApp;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof student_pb.CommonGetRequest;
  readonly responseType: typeof student_pb.ExamResponse;
};

type StudentAppGetPredicts = {
  readonly methodName: string;
  readonly service: typeof StudentApp;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof student_pb.GetPredictRequest;
  readonly responseType: typeof student_pb.GetPredictResponse;
};

type StudentAppStreamVideo = {
  readonly methodName: string;
  readonly service: typeof StudentApp;
  readonly requestStream: true;
  readonly responseStream: true;
  readonly requestType: typeof student_pb.StreamVideoRequest;
  readonly responseType: typeof student_pb.CommonGetResponse;
};

type StudentAppGetUserDetail = {
  readonly methodName: string;
  readonly service: typeof StudentApp;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof student_pb.CommonGetRequest;
  readonly responseType: typeof student_pb.CommonGetResponse;
};

type StudentAppPutUserDetail = {
  readonly methodName: string;
  readonly service: typeof StudentApp;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof student_pb.CommonGetRequest;
  readonly responseType: typeof student_pb.CommonGetResponse;
};

export class StudentApp {
  static readonly serviceName: string;
  static readonly UpPredictResult: StudentAppUpPredictResult;
  static readonly GetExams: StudentAppGetExams;
  static readonly GetPredicts: StudentAppGetPredicts;
  static readonly StreamVideo: StudentAppStreamVideo;
  static readonly GetUserDetail: StudentAppGetUserDetail;
  static readonly PutUserDetail: StudentAppPutUserDetail;
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

export class StudentAppClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  upPredictResult(
    requestMessage: student_pb.ModelPredict,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: student_pb.CommonGetResponse|null) => void
  ): UnaryResponse;
  upPredictResult(
    requestMessage: student_pb.ModelPredict,
    callback: (error: ServiceError|null, responseMessage: student_pb.CommonGetResponse|null) => void
  ): UnaryResponse;
  getExams(
    requestMessage: student_pb.CommonGetRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: student_pb.ExamResponse|null) => void
  ): UnaryResponse;
  getExams(
    requestMessage: student_pb.CommonGetRequest,
    callback: (error: ServiceError|null, responseMessage: student_pb.ExamResponse|null) => void
  ): UnaryResponse;
  getPredicts(
    requestMessage: student_pb.GetPredictRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: student_pb.GetPredictResponse|null) => void
  ): UnaryResponse;
  getPredicts(
    requestMessage: student_pb.GetPredictRequest,
    callback: (error: ServiceError|null, responseMessage: student_pb.GetPredictResponse|null) => void
  ): UnaryResponse;
  streamVideo(metadata?: grpc.Metadata): BidirectionalStream<student_pb.StreamVideoRequest, student_pb.CommonGetResponse>;
  getUserDetail(
    requestMessage: student_pb.CommonGetRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: student_pb.CommonGetResponse|null) => void
  ): UnaryResponse;
  getUserDetail(
    requestMessage: student_pb.CommonGetRequest,
    callback: (error: ServiceError|null, responseMessage: student_pb.CommonGetResponse|null) => void
  ): UnaryResponse;
  putUserDetail(
    requestMessage: student_pb.CommonGetRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: student_pb.CommonGetResponse|null) => void
  ): UnaryResponse;
  putUserDetail(
    requestMessage: student_pb.CommonGetRequest,
    callback: (error: ServiceError|null, responseMessage: student_pb.CommonGetResponse|null) => void
  ): UnaryResponse;
}

