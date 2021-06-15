import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ErrorMsg } from 'services/types';
import { RootState } from 'store/types';
import { InferResult, ModelPath, PCState, ProgressMap } from './types';

const initialState: PCState = {
  status: 'STOP',
  modelPaths: [],
  downloadProg: [],
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
    setModelPaths: (state, action: PayloadAction<Array<ModelPath>>) => {
      state.modelPaths = action.payload;
    },
    setDownloadProg: (state, action: PayloadAction<ProgressMap>) => {
      if (!state.downloadProg.find(it => it.name === action.payload.name))
        state.downloadProg = [...state.downloadProg, action.payload];
      else
        state.downloadProg = state.downloadProg.map(it =>
          it.name === action.payload.name ? action.payload : it
        );
    },
    setResult: (state, action: PayloadAction<Array<InferResult>>) => {
      state.result = action.payload;
    },
  },
});

export const selectPCSrv = createSelector(
  [(state: RootState) => state.PCSrv || initialState],
  PCSrv => PCSrv
);
