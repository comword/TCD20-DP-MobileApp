import { EventChannel, SagaIterator } from 'redux-saga';
import { put, take } from 'redux-saga/effects';
import { PCSlice } from './slice';

export function* sagaNativeEventHandler(
  channel: EventChannel<{ eventName: string; event: any }>
): SagaIterator {
  try {
    while (true) {
      const { eventName, event } = (yield take(channel)) as {
        eventName: string;
        event: any;
      };
      switch (eventName) {
        case 'OnPostureClassifyErr':
          yield put(
            PCSlice.actions.setError({
              code: event.code,
              msg: event.msg,
              show: event.show,
            })
          );
          break;
        case 'OnModelLoaded':
          yield put(PCSlice.actions.setModelLoaded(event.path));
          break;
        case 'OnModelResult':
          yield put(PCSlice.actions.setResult(event.result));
          break;
        case 'OnCameraFPS':
          yield put(PCSlice.actions.setFPS(event.fps));
          break;
      }
    }
  } catch (err) {
    yield put(
      PCSlice.actions.setError({
        code: -1,
        msg: err.toString(),
        show: true,
      })
    );
    channel.close();
  }
}
