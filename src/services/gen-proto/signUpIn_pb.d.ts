// package: signUpIn
// file: signUpIn.proto

import * as jspb from "google-protobuf";

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

export class SignUpRequest extends jspb.Message {
  getFirstname(): string;
  setFirstname(value: string): void;

  getLastname(): string;
  setLastname(value: string): void;

  getEmail(): string;
  setEmail(value: string): void;

  getPassword(): string;
  setPassword(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignUpRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SignUpRequest): SignUpRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SignUpRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignUpRequest;
  static deserializeBinaryFromReader(message: SignUpRequest, reader: jspb.BinaryReader): SignUpRequest;
}

export namespace SignUpRequest {
  export type AsObject = {
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  }
}

export class SignUpInResponse extends jspb.Message {
  getCode(): number;
  setCode(value: number): void;

  getMsg(): string;
  setMsg(value: string): void;

  getAuthkey(): string;
  setAuthkey(value: string): void;

  getRefreshkey(): string;
  setRefreshkey(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignUpInResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SignUpInResponse): SignUpInResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SignUpInResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignUpInResponse;
  static deserializeBinaryFromReader(message: SignUpInResponse, reader: jspb.BinaryReader): SignUpInResponse;
}

export namespace SignUpInResponse {
  export type AsObject = {
    code: number,
    msg: string,
    authkey: string,
    refreshkey: string,
  }
}

export class SignInRequest extends jspb.Message {
  getEmail(): string;
  setEmail(value: string): void;

  getPassword(): string;
  setPassword(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignInRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SignInRequest): SignInRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SignInRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignInRequest;
  static deserializeBinaryFromReader(message: SignInRequest, reader: jspb.BinaryReader): SignInRequest;
}

export namespace SignInRequest {
  export type AsObject = {
    email: string,
    password: string,
  }
}

export class SignOutRequest extends jspb.Message {
  getAuthkey(): string;
  setAuthkey(value: string): void;

  getRefreshkey(): string;
  setRefreshkey(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignOutRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SignOutRequest): SignOutRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SignOutRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignOutRequest;
  static deserializeBinaryFromReader(message: SignOutRequest, reader: jspb.BinaryReader): SignOutRequest;
}

export namespace SignOutRequest {
  export type AsObject = {
    authkey: string,
    refreshkey: string,
  }
}

