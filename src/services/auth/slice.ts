import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { setParameter } from 'services/rpc/websocket';
import { ErrorMsg } from 'services/types';
import { RootState } from 'store/types';

import { AuthState } from './state';

const initialState: AuthState = {
  authKey: '',
  refreshKey: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthKey(state, action: PayloadAction<string>) {
      setParameter({ token: action.payload });
      state.authKey = action.payload;
    },
    setRefreshKey(state, action: PayloadAction<string>) {
      state.refreshKey = action.payload;
    },
    setError(state, action: PayloadAction<ErrorMsg | undefined>) {
      state.lastError = action.payload;
    },
  },
});

export const selectAuth = createSelector(
  [(state: RootState) => state.auth || initialState],
  auth => auth
);
