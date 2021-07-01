import { ErrorMsg } from 'services/types';

export enum MLActionTypes {
  LookScreen = 'Look screen',
  Typing = 'Typing',
  // alerting actions
  Unknown = 'Unknown',
  LookSide = 'Look side',
  LookBack = 'Look back',
  Leave = 'Leave',
  // prohibited actions
  Speaking = 'Speaking',
  MultiPersons = 'Multi persons',
  UsePhone = 'Use phone',
}

export const DefaultAlertMap = new Map<MLActionTypes, number>([
  [MLActionTypes.LookScreen, 0],
  [MLActionTypes.Typing, 0],
  [MLActionTypes.Unknown, 1],
  [MLActionTypes.LookSide, 1],
  [MLActionTypes.LookBack, 1],
  [MLActionTypes.Leave, 1],
  [MLActionTypes.Speaking, 2],
  [MLActionTypes.MultiPersons, 2],
  [MLActionTypes.UsePhone, 2],
]);

export type InferResult = {
  type: MLActionTypes;
  prob: number;
};

export type ModelPath = {
  name: string;
  path: string;
  loaded: boolean;
};

export type ProgressMap = {
  name: string;
  totalBytesWritten?: number;
  totalBytesExpectedToWrite?: number;
  percent?: number;
};

export interface PCState {
  lastError?: ErrorMsg;
  status: 'UNLOAD' | 'LOAD' | 'RUNNING';
  netStatus: 'UNLOAD' | 'LOAD';
  modelPaths: Array<ModelPath>;
  downloadProg: Array<ProgressMap>;
  result?: Array<number>;
}
