import {
  createSelector,
  createSlice,
  Dispatch,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  NativeModulesProxy,
  EventEmitter,
  Platform,
  Subscription,
} from '@unimodules/core';
const { PostureClassify } = NativeModulesProxy;
import { ErrorMsg } from 'services/types';
import { RootState } from 'store/types';

export interface PCState {
  lastError?: ErrorMsg;
  status: 'STOP' | 'RUN';
}

const initialState: PCState = {
  status: 'STOP',
};

export const PCSlice = createSlice({
  name: 'PCSrv',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<ErrorMsg | undefined>) => {
      state.lastError = action.payload;
    },
    setStatus: (state, action: PayloadAction<'STOP' | 'RUN'>) => {
      state.status = action.payload;
    },
  },
});

export const selectPCSrv = createSelector(
  [(state: RootState) => state.PCSrv || initialState],
  PCSrv => PCSrv
);

let eventListeners: Subscription[] = [];

export const initPCService = async (dispatch: Dispatch) => {
  if (!(await PostureClassify.getTFLiteInitialised()))
    if (Platform.OS === 'android') {
      const eventEmitter = new EventEmitter(PostureClassify);
      eventListeners.push(
        eventEmitter.addListener(
          'OnPostureClassifyMsg',
          (event: { code: number; msg: string }) =>
            dispatch(
              PCSlice.actions.setError({
                code: event.code,
                msg: event.msg,
                show: event.code < 0,
              })
            )
        )
      );
      await PostureClassify.initTFLite('');
    }
};
