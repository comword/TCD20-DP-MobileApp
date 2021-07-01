import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ErrorMsg } from 'services/types';
import { RootState } from 'store/types';
import { ModelPath, PCState, ProgressMap } from './types';

const initialState: PCState = {
  status: 'UNLOAD',
  netStatus: 'UNLOAD',
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
    setStatus: (
      state,
      action: PayloadAction<'UNLOAD' | 'LOAD' | 'RUNNING'>
    ) => {
      state.status = action.payload;
    },
    setNetStatus: (state, action: PayloadAction<'UNLOAD' | 'LOAD'>) => {
      state.netStatus = action.payload;
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
    setResult: (state, action: PayloadAction<Array<number>>) => {
      state.result = action.payload;
    },
    setModelLoaded: (state, action: PayloadAction<string>) => {
      const newModelPaths = state.modelPaths.map(it =>
        it.path === action.payload ? { ...it, loaded: true } : it
      );
      state.modelPaths = newModelPaths;
      if (newModelPaths.every(it => it.loaded)) state.status = 'LOAD';
    },
  },
});

export const selectPCSrv = createSelector(
  [(state: RootState) => state.PCSrv || initialState],
  PCSrv => PCSrv
);
