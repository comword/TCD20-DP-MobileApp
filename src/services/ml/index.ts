import { SagaIterator } from 'redux-saga';
import { all, takeLatest } from 'redux-saga/effects';
import { downloadAction, sagaDownload } from './download';
import { PCSlice, selectPCSrv } from './slice';

import { Dispatch } from '@reduxjs/toolkit';
import {
  NativeModulesProxy,
  EventEmitter,
  Platform,
  Subscription,
} from '@unimodules/core';
const { PostureClassify } = NativeModulesProxy;

function* rootMLSaga(): SagaIterator {
  yield all([takeLatest(downloadAction, sagaDownload)]);
}

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

export { rootMLSaga, selectPCSrv, PCSlice };
export { downloadAction };
