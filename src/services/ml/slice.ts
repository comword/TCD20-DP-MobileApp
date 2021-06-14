import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ErrorMsg } from 'services/types';
import { RootState } from 'store/types';
import { PCState } from './types';

const initialState: PCState = {
  status: 'STOP',
  detectModel: '',
  landmarkModel: '',
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
