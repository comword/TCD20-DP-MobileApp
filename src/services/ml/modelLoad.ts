import { createAction } from '@reduxjs/toolkit';
import { SagaIterator, eventChannel } from 'redux-saga';
import { call, put, fork } from 'redux-saga/effects';
import { PCSlice } from './slice';

import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
} from '@unimodules/core';
import { sagaNativeEventHandler } from './nativeEvent';
const { CameraGLModule, PostureClassify } = NativeModulesProxy;

const initPCService = async (model: string) => {
  if (!(await PostureClassify.getInitialised()))
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
