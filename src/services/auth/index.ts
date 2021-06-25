import { SagaIterator } from 'redux-saga';
import { all, put, select, takeLatest } from 'redux-saga/effects';
import { authSlice, selectAuth } from './slice';
import {
  signUpAction,
  sagaSignUp,
  signInAction,
  sagaSignIn,
  signOutAction,
  sagaSignOut,
} from './signupinout';

import { sagaRefreshToken } from './refresh';
import { AuthState } from './state';

function* rootAuthSaga(): SagaIterator {
  yield all([
    takeLatest(signUpAction, sagaSignUp),
    takeLatest(signInAction, sagaSignIn),
    takeLatest(signOutAction, sagaSignOut),
    takeLatest(authSlice.actions.setRefreshKey, sagaRefreshToken),
  ]);
  const auth = (yield select(selectAuth)) as AuthState;
  if (auth.refreshKey && auth.refreshKey !== '')
    yield put(authSlice.actions.setRefreshKey(auth.refreshKey));
}

export { authSlice, rootAuthSaga, selectAuth };
export { signUpAction, signInAction, signOutAction };
export const { setError } = authSlice.actions;
