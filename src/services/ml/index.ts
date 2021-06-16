import { Dispatch } from 'redux';
import { SagaIterator } from 'redux-saga';
import { all, call, take, takeEvery } from 'redux-saga/effects';
import { downloadAction, sagaDownload } from './download';
import { modelInitAction, sagaLoadModel } from './modelLoad';
import { PCSlice, selectPCSrv } from './slice';

function* sagaLoadModelWatcher(dispatch: Dispatch) {
  const action = (yield take(modelInitAction)) as ReturnType<
    typeof modelInitAction
  >;
  yield call(sagaLoadModel, dispatch, action);
}

function* rootMLSaga(dispatch: Dispatch): SagaIterator {
  yield all([
    takeEvery(downloadAction, sagaDownload),
    call(sagaLoadModelWatcher, dispatch),
  ]);
}

export { rootMLSaga, selectPCSrv, PCSlice };
export { downloadAction, modelInitAction };
