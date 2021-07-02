// package: student
// file: student.proto

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class CommonGetRequest extends jspb.Message {
  getContent(): string;
  setContent(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CommonGetRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CommonGetRequest): CommonGetRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CommonGetRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CommonGetRequest;
  static deserializeBinaryFromReader(message: CommonGetRequest, reader: jspb.BinaryReader): CommonGetRequest;
}

export namespace CommonGetRequest {
  export type AsObject = {
    content: string,
  }
}

export class CommonGetResponse extends jspb.Message {
  getCode(): number;
  setCode(value: number): void;

  getMsg(): string;
  setMsg(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CommonGetResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CommonGetResponse): CommonGetResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CommonGetResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CommonGetResponse;
  static deserializeBinaryFromReader(message: CommonGetResponse, reader: jspb.BinaryReader): CommonGetResponse;
}

export namespace CommonGetResponse {
  export type AsObject = {
    code: number,
    msg: string,
  }
}

export class ExamDetail extends jspb.Message {
  getExamid(): string;
  setExamid(value: string): void;

  getExamname(): string;
  setExamname(value: string): void;

  hasStarttime(): boolean;
  clearStarttime(): void;
  getStarttime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStarttime(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasEndtime(): boolean;
  clearEndtime(): void;
  getEndtime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setEndtime(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getAdditioninfoMap(): jspb.Map<string, string>;
  clearAdditioninfoMap(): void;
  clearPredictidList(): void;
  getPredictidList(): Array<string>;
  setPredictidList(value: Array<string>): void;
  addPredictid(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExamDetail.AsObject;
  static toObject(includeInstance: boolean, msg: ExamDetail): ExamDetail.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExamDetail, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExamDetail;
  static deserializeBinaryFromReader(message: ExamDetail, reader: jspb.BinaryReader): ExamDetail;
}

export namespace ExamDetail {
  export type AsObject = {
    examid: string,
    examname: string,
    starttime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    endtime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    additioninfoMap: Array<[string, string]>,
    predictidList: Array<string>,
  }
}

export class ExamResponse extends jspb.Message {
  getCode(): number;
  setCode(value: number): void;

  getMsg(): string;
  setMsg(value: string): void;

  clearExamsList(): void;
  getExamsList(): Array<ExamDetail>;
  setExamsList(value: Array<ExamDetail>): void;
  addExams(value?: ExamDetail, index?: number): ExamDetail;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExamResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ExamResponse): ExamResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExamResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExamResponse;
  static deserializeBinaryFromReader(message: ExamResponse, reader: jspb.BinaryReader): ExamResponse;
}

export namespace ExamResponse {
  export type AsObject = {
    code: number,
    msg: string,
    examsList: Array<ExamDetail.AsObject>,
  }
}

export class ModelPredict extends jspb.Message {
  getExamid(): string;
  setExamid(value: string): void;

  getStudentid(): string;
  setStudentid(value: string): void;

  hasTime(): boolean;
  clearTime(): void;
  getTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setTime(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getResultMap(): jspb.Map<string, number>;
  clearResultMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ModelPredict.AsObject;
  static toObject(includeInstance: boolean, msg: ModelPredict): ModelPredict.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ModelPredict, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ModelPredict;
  static deserializeBinaryFromReader(message: ModelPredict, reader: jspb.BinaryReader): ModelPredict;
}

export namespace ModelPredict {
  export type AsObject = {
    examid: string,
    studentid: string,
    time?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    resultMap: Array<[string, number]>,
  }
}

export class GetPredictRequest extends jspb.Message {
  clearPredictidList(): void;
  getPredictidList(): Array<string>;
  setPredictidList(value: Array<string>): void;
  addPredictid(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPredictRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetPredictRequest): GetPredictRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetPredictRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPredictRequest;
  static deserializeBinaryFromReader(message: GetPredictRequest, reader: jspb.BinaryReader): GetPredictRequest;
}

export namespace GetPredictRequest {
  export type AsObject = {
    predictidList: Array<string>,
  }
}

export class GetPredictResponse extends jspb.Message {
  getCode(): number;
  setCode(value: number): void;

  getMsg(): string;
  setMsg(value: string): void;

  getResultMap(): jspb.Map<string, ModelPredict>;
  clearResultMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPredictResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetPredictResponse): GetPredictResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetPredictResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPredictResponse;
  static deserializeBinaryFromReader(message: GetPredictResponse, reader: jspb.BinaryReader): GetPredictResponse;
}

export namespace GetPredictResponse {
  export type AsObject = {
    code: number,
    msg: string,
    resultMap: Array<[string, ModelPredict.AsObject]>,
  }
}

export class MetaData extends jspb.Message {
  getExamid(): string;
  setExamid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MetaData.AsObject;
  static toObject(includeInstance: boolean, msg: MetaData): MetaData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MetaData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MetaData;
  static deserializeBinaryFromReader(message: MetaData, reader: jspb.BinaryReader): MetaData;
}

export namespace MetaData {
  export type AsObject = {
    examid: string,
  }
}

export class StreamVideoRequest extends jspb.Message {
  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): MetaData | undefined;
  setMetadata(value?: MetaData): void;

  hasChunkdata(): boolean;
  clearChunkdata(): void;
  getChunkdata(): Uint8Array | string;
  getChunkdata_asU8(): Uint8Array;
  getChunkdata_asB64(): string;
  setChunkdata(value: Uint8Array | string): void;

  getRequestCase(): StreamVideoRequest.RequestCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StreamVideoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StreamVideoRequest): StreamVideoRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StreamVideoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StreamVideoRequest;
  static deserializeBinaryFromReader(message: StreamVideoRequest, reader: jspb.BinaryReader): StreamVideoRequest;
}

export namespace StreamVideoRequest {
  export type AsObject = {
    metadata?: MetaData.AsObject,
    chunkdata: Uint8Array | string,
  }

  export enum RequestCase {
    REQUEST_NOT_SET = 0,
    METADATA = 1,
    CHUNKDATA = 2,
  }
}

