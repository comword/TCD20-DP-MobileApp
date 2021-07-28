import { ErrorMsg } from 'services/types';

export enum MLActionTypes {
  Unknown = 'Unknown', // 0
  LookScreen = 'Look screen', // 1
  LookDown = 'Look down', // 2
  LookSide = 'Look side', // 3
  LookBack = 'Look back', // 4
  Leave = 'Leave', // 5
  Speaking = 'Speaking', // 6
  LookUp = 'Look up', // 7
  UsePhone = 'Use phone', // 8
  Scratching = 'Scratching', // 9
  Drinking = 'Drinking', // 10
  Typing = 'Typing', // 11
}

export const DefaultAlertMap = new Map<MLActionTypes, number>([
  [MLActionTypes.Unknown, 1],
  [MLActionTypes.LookScreen, 0],
  [MLActionTypes.LookDown, 2],
  [MLActionTypes.LookSide, 1],
  [MLActionTypes.LookBack, 1],
  [MLActionTypes.Leave, 1],
  [MLActionTypes.Speaking, 2],
  [MLActionTypes.LookUp, 0],
  [MLActionTypes.UsePhone, 2],
  [MLActionTypes.Scratching, 0],
  [MLActionTypes.Drinking, 0],
  [MLActionTypes.Typing, 0],
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
  fps?: number;
}
