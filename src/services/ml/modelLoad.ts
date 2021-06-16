import { createAction, Dispatch } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { PCSlice } from './slice';

import {
  NativeModulesProxy,
  Platform,
  EventEmitter,
  Subscription,
} from '@unimodules/core';
const { CameraGLModule, PostureClassify } = NativeModulesProxy;

let eventListeners: Subscription[] = [];

export const initPCService = async (dispatch: Dispatch, model?: string) => {
  if (!(await PostureClassify.getTFLiteInitialised()))
    if (Platform.OS === 'android') {
      const eventEmitter = new EventEmitter(PostureClassify);
      eventListeners.push(
        eventEmitter.addListener(
          'OnPostureClassifyErr',
          (event: { code: number; msg: string }) =>
            dispatch(
              PCSlice.actions.setError({
                code: event.code,
                msg: event.msg,
                show: event.code < 0,
              })
            )
        ),
        eventEmitter.addListener('OnModelLoaded', (event: { path: string }) =>
          dispatch(PCSlice.actions.setModelLoaded(event.path))
        )
      );
      await PostureClassify.initTFLite(model ? model : '');
    }
};

interface ModelPaths {
  haarCascade?: string;
  modelLBF?: string;
  posture?: string;
}

export const modelInitAction = createAction<ModelPaths>('modelInitAction');

export function* sagaLoadModel(
  dispatch: Dispatch,
  action: ReturnType<typeof modelInitAction>
): SagaIterator {
  try {
    if (Platform.OS === 'android') {
      yield call(
        CameraGLModule.initCamera,
        action.payload.haarCascade,
        action.payload.modelLBF
      );
      yield call(initPCService, dispatch, action.payload.posture);
      // yield put(PCSlice.actions.setStatus('LOAD'));
    }
  } catch (e) {
    console.log(e);
    yield put(
      PCSlice.actions.setError({
        code: -1,
        msg: e.toString(),
        show: true,
      })
    );
  }
}
