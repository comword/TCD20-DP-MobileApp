import { ErrorMsg } from 'services/types';

export enum MLActionTypes {
  Unknown = 'Unknown',
  LookScreen = 'LookScreen',
  Typing = 'Typing',
  // alerting actions
  LookSide = 'LookSide',
  LookBack = 'LookBack',
  Leave = 'Leave',
  // prohibited actions
  Speaking = 'Speaking',
  MultiPersons = 'MultiPersons',
  UsePhone = 'UsePhone',
}

export type InferResult = {
  type: MLActionTypes;
  prob: number;
};

export interface PCState {
  lastError?: ErrorMsg;
  status: 'STOP' | 'RUN';
  result?: Array<InferResult>;
}
