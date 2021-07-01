import { createAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { CommonGetRequest, ExamResponse } from 'services/gen-proto/student_pb';
import { rpcStudentAppClient } from 'services/rpc';
import { examSlice } from './slice';

export const fetchExamsAction = createAction('exams/fetchExams');

function* sagaFetchExams(): SagaIterator {
  try {
    const param = new CommonGetRequest();
    const result = (yield call(
      [rpcStudentAppClient, rpcStudentAppClient.getExams!],
      param
    )) as ExamResponse;
    if (result.getCode() === 0) {
      const objify = result.toObject();
      yield put(examSlice.actions.setPendingExams(objify.pendingexamsList));
      yield put(examSlice.actions.setPastExams(objify.pastexamsList));
    } else
      yield put(
        examSlice.actions.setError({
          code: result.getCode(),
          msg: result.getMsg(),
          show: true,
        })
      );
  } catch (e) {}
}

export function* rootExamsSaga(): SagaIterator {
  yield all([takeLatest(fetchExamsAction, sagaFetchExams)]);
}
