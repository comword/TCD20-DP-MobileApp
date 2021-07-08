import { createAction } from '@reduxjs/toolkit';
import { SagaIterator, eventChannel } from 'redux-saga';
import { call, put, fork, select } from 'redux-saga/effects';
import { PCSlice, selectPCSrv } from './slice';
import { sagaNativeEventHandler } from './nativeEvent';
import { PCState } from './types';
import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
} from '@unimodules/core';
const { CameraGLModule, PostureClassify } = NativeModulesProxy;

const initPCService = async (model: string) => {
  if (!(await PostureClassify.getTFInitialised()))
    await PostureClassify.initTFLite(model);
};

interface ModelPaths {
  haarCascade?: string;
  modelLBF?: string;
  posture?: string;
}

export const modelInitAction = createAction<ModelPaths>('modelInitAction');

export function* sagaLoadModel(
  action: ReturnType<typeof modelInitAction>
): SagaIterator {
  try {
    const channel = eventChannel<{ eventName: string; event: any }>(emitter => {
      let eventListeners: Subscription[] = [];
      const eventEmitter = new EventEmitter(PostureClassify);
      eventListeners.push(
        eventEmitter.addListener(
          'OnPostureClassifyErr',
          (event: { code: number; msg: string; show: boolean }) =>
            emitter({ eventName: 'OnPostureClassifyErr', event: event })
        ),
        eventEmitter.addListener('OnModelLoaded', (event: { path: string }) =>
          emitter({ eventName: 'OnModelLoaded', event: event })
        ),
        eventEmitter.addListener(
          'OnModelResult',
          (event: { result: number[] }) =>
            emitter({ eventName: 'OnModelResult', event: event })
        ),
        eventEmitter.addListener('OnCameraFPS', (event: { fps: number }) =>
          emitter({ eventName: 'OnCameraFPS', event: event })
        )
      );
      return () => {
        eventListeners.forEach(it => it.remove());
      };
    });
    yield fork(sagaNativeEventHandler, channel);
    if (action.payload.haarCascade && action.payload.modelLBF)
      yield call(
        CameraGLModule.initCamera,
        action.payload.haarCascade,
        action.payload.modelLBF
      );
    if (action.payload.posture)
      yield call(initPCService, action.payload.posture);
  } catch (e) {
    yield put(
      PCSlice.actions.setError({
        code: -1,
        msg: e.toString(),
        show: true,
      })
    );
  }
}

export const startInvigilateAction = createAction('startInvigilate');

export function* sagaStartInvigilate(): SagaIterator {
  try {
    const state = (yield select(selectPCSrv)) as PCState;
    if (state.status !== 'LOAD') {
      yield put(
        PCSlice.actions.setError({
          code: -1,
          msg: 'Deep models are not loaded, please clean caches of the App and try again.',
          show: true,
        })
      );
      return;
    }
    const result = (yield call(CameraGLModule.startInvigilate)) as boolean;
    if (!result)
      yield put(
        PCSlice.actions.setError({
          code: -1,
          msg: 'Native module startInvigilate returns false, please report the bug with logcat.',
          show: true,
        })
      );
    yield put(PCSlice.actions.setStatus('RUNNING'));
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
