import { createAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import {
  CommonGetRequest,
  CommonGetResponse,
} from 'services/gen-proto/student_pb';
import { rpcStudentAppClient } from 'services/rpc';
import { userSlice } from './slice';
import { UserDetailState } from './state';

export const fetchDetailAction = createAction('user/fetchDetail');

function* sagaFetchDetail(): SagaIterator {
  try {
    const param = new CommonGetRequest();
    const result = (yield call(
      [rpcStudentAppClient, rpcStudentAppClient.getUserDetail!],
      param
    )) as CommonGetResponse;
    if (result.getCode() === 0) {
      const details = JSON.parse(result.getMsg()) as UserDetailState;
      yield put(userSlice.actions.setState(details));
    } else
      yield put(
        userSlice.actions.setError({
          code: result.getCode(),
          msg: result.getMsg(),
          show: true,
        })
      );
  } catch (e) {
    yield put(
      userSlice.actions.setError({
        code: -1,
        msg: e.toString(),
        show: true,
      })
    );
  }
}

export function* rootExamsSaga(): SagaIterator {
  yield all([takeLatest(fetchDetailAction, sagaFetchDetail)]);
}
