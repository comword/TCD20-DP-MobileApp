import { SagaIterator } from 'redux-saga';
import { all, call, take, takeEvery, takeLatest } from 'redux-saga/effects';
import {
  downloadAction,
  loadAssetAction,
  sagaDownload,
  sagaLoadAsset,
} from './download';
import {
  modelInitAction,
  sagaLoadModel,
  sagaStartInvigilate,
  startInvigilateAction,
} from './modelLoad';
import { PCSlice, selectPCSrv } from './slice';

function* sagaLoadModelWatcher() {
  const action = (yield take(modelInitAction)) as ReturnType<
    typeof modelInitAction
  >;
  yield call(sagaLoadModel, action);
}

function* rootMLSaga(): SagaIterator {
  yield all([
    takeEvery(downloadAction, sagaDownload),
    takeEvery(loadAssetAction, sagaLoadAsset),
    takeLatest(startInvigilateAction, sagaStartInvigilate),
    call(sagaLoadModelWatcher),
  ]);
}

export { rootMLSaga, selectPCSrv, PCSlice };
export {
  downloadAction,
  loadAssetAction,
  modelInitAction,
  startInvigilateAction,
};
