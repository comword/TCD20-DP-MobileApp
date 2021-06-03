import {
  createSelector,
  createSlice,
  Dispatch,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModule,
  Platform,
} from 'react-native';
import { ErrorMsg } from 'services/types';
import { RootState } from 'store/types';
import PCService from './wrapper';

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

let eventListeners: EmitterSubscription[] = [];

export const initPCService = (dispatch: Dispatch) => {
  if (Platform.OS === 'android') {
    const eventEmitter = new NativeEventEmitter(
      PCService as unknown as NativeModule
    );
    eventListeners.push(
      eventEmitter.addListener('OnServiceMsg', event =>
        dispatch(
          PCSlice.actions.setError({
            code: event.code,
            msg: event.msg,
            show: event.code < 0,
          })
        )
      )
    );
    PCService.initTFLite(result => {
      console.log(`Service start: ${result}`);
      PCSlice.actions.setStatus('RUN');
    });
  }
};
