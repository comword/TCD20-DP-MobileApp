import { createAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import {
  CommonGetResponse,
  SignInRequest,
  SignOutRequest,
  SignUpInResponse,
  SignUpRequest,
} from 'services/gen-proto/signUpIn_pb';
import { rpcSignUpInClient } from 'services/rpc';
import { authSlice, selectAuth } from './slice';
import { AuthState } from './state';
import * as Crypto from 'expo-crypto';

export const signUpAction = createAction<SignUpRequest.AsObject>('auth/signUp');

export function* sagaSignUp(
  action: ReturnType<typeof signUpAction>
): SagaIterator {
  try {
    const param = new SignUpRequest();
    const req = action.payload;
    param.setFirstname(req.firstname);
    param.setLastname(req.lastname);
    param.setEmail(req.email);
    const digest = (yield call(
      Crypto.digestStringAsync,
      Crypto.CryptoDigestAlgorithm.SHA256,
      req.email + req.password
    )) as string;
    param.setPassword(digest);
    const result = (yield call(
      [rpcSignUpInClient, rpcSignUpInClient.signUp!],
      param
    )) as SignUpInResponse;
    if (result.getCode() === 0) {
      yield put(authSlice.actions.setRefreshKey(result.getRefreshkey()));
      yield put(authSlice.actions.setAuthKey(result.getAuthkey()));
    } else
      yield put(
        authSlice.actions.setError({
          code: result.getCode(),
          msg: result.getMsg(),
          show: true,
        })
      );
  } catch (err) {
    yield put(
      authSlice.actions.setError({ code: -1, msg: err.toString(), show: true })
    );
  }
}

export const signInAction = createAction<SignInRequest.AsObject>('auth/signIn');

export function* sagaSignIn(
  action: ReturnType<typeof signInAction>
): SagaIterator {
  try {
    const param = new SignInRequest();
    const req = action.payload;
    param.setEmail(req.email);
    const digest = (yield call(
      Crypto.digestStringAsync,
      Crypto.CryptoDigestAlgorithm.SHA256,
      req.email + req.password
    )) as string;
    param.setPassword(digest);
    const result = (yield call(
      [rpcSignUpInClient, rpcSignUpInClient.signIn!],
      param
    )) as SignUpInResponse;
    if (result.getCode() === 0) {
      yield put(authSlice.actions.setRefreshKey(result.getRefreshkey()));
      yield put(authSlice.actions.setAuthKey(result.getAuthkey()));
    } else
      yield put(
        authSlice.actions.setError({
          code: result.getCode(),
          msg: result.getMsg(),
          show: true,
        })
      );
  } catch (err) {
    yield put(
      authSlice.actions.setError({ code: -1, msg: err.toString(), show: true })
    );
  }
}

export const signOutAction = createAction('auth/signOut');

export function* sagaSignOut(): SagaIterator {
  try {
    const auth = (yield select(selectAuth)) as AuthState;
    if (auth.authKey || auth.refreshKey) {
      const param = new SignOutRequest();
      if (auth.authKey) param.setAuthkey(auth.authKey);
      if (auth.refreshKey) param.setRefreshkey(auth.refreshKey);
      const result = (yield call(
        [rpcSignUpInClient, rpcSignUpInClient.signOut!],
        param
      )) as CommonGetResponse;
      if (result.getCode() === 0) {
        yield put(authSlice.actions.setAuthKey(''));
        yield put(authSlice.actions.setRefreshKey(''));
        yield put(authSlice.actions.setError(undefined));
      } else {
        yield put(
          authSlice.actions.setError({
            code: result.getCode(),
            msg: result.getMsg(),
            show: true,
          })
        );
      }
    }
  } catch (err) {
    yield put(
      authSlice.actions.setError({ code: -1, msg: err.toString(), show: true })
    );
  }
}
