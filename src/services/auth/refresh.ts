import jwtDecode from 'jwt-decode';
import { SagaIterator } from 'redux-saga';
import { call, put, delay, cancelled, select } from 'redux-saga/effects';
import {
  CommonGetRequest,
  SignUpInResponse,
} from 'services/gen-proto/signUpIn_pb';
import { rpcSignUpInClient } from 'services/rpc';
import { authSlice, selectAuth } from './slice';
import { AuthState } from './state';

export interface AccessJwtPayload {
  email?: string;
  accessUUID?: string;
  exp?: number;
  iat?: number;
}

interface RefreshJwtPayload {
  refreshUUID?: string;
  exp?: number;
  iat?: number;
}

export function* sagaRefreshToken(
  action: ReturnType<typeof authSlice.actions.setRefreshKey>
): SagaIterator {
  try {
    if (action.payload === '')
      yield put(
        authSlice.actions.setError({ code: 0, msg: 'Logged out', show: true })
      );
    else {
      console.log('Refresh token task started.');
      yield delay(100);
      do {
        let doRefresh = true;
        const auth = (yield select(selectAuth)) as AuthState;
        if (auth.authKey !== '') {
          const accessToken = jwtDecode<AccessJwtPayload>(auth.authKey);
          if (
            accessToken.exp &&
            accessToken.exp > new Date().getTime() / 1000 + 180
          )
            doRefresh = false;
        }
        if (doRefresh) {
          const refreshToken = jwtDecode<RefreshJwtPayload>(auth.refreshKey);
          if (
            refreshToken.exp &&
            refreshToken.exp > new Date().getTime() / 1000
          ) {
            const param = new CommonGetRequest();
            param.setContent(auth.refreshKey);
            const result = (yield call(
              [rpcSignUpInClient, rpcSignUpInClient.refreshToken!],
              param
            )) as SignUpInResponse;
            if (result.getCode() === 0) {
              yield put(authSlice.actions.setAuthKey(result.getAuthkey()));
              yield put(
                authSlice.actions.setRefreshKey(result.getRefreshkey())
              );
            } else {
              yield put(
                authSlice.actions.setError({
                  code: result.getCode(),
                  msg: 'Token renew failed: ' + result.getMsg(),
                  show: true,
                })
              );
              yield put(authSlice.actions.setRefreshKey(''));
              break;
            }
          } else {
            yield put(
              authSlice.actions.setError({
                code: 0,
                msg: 'Token expired, please login again.',
                show: true,
              })
            );
            break;
          }
        }
        // do refresh
        yield delay(60000); // 1 min
      } while (true);
    }
  } finally {
    if (yield cancelled()) console.log('Refresh token task cancelled.');
  }
}
