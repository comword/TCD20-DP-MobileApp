import {
  createSelector,
  createSlice,
  Dispatch,
  PayloadAction,
} from '@reduxjs/toolkit';
// import { NativeModulesProxy } from '@unimodules/core';
// const { PostureClassify } = NativeModulesProxy;
import { RootState } from 'store/types';

export interface CameraState {
  detectModel: string;
  landmarkModel: string;
}

const initialState: CameraState = {
  detectModel: '',
  landmarkModel: '',
};

export const CameraSlice = createSlice({
  name: 'CameraSrv',
  initialState,
  reducers: {
    setDetectModel: (state, action: PayloadAction<string> ) => {
      state.detectModel = action.payload;
    },
    setlandmarkModel: (state, action: PayloadAction<string> ) => {
      state.landmarkModel = action.payload;
    },
  },
});

export const selectCameraSrv = createSelector(
  [(state: RootState) => state.CameraSrv || initialState],
  CameraSrv => CameraSrv
);

export const initFaceModels = async (dispatch: Dispatch) => {

};
