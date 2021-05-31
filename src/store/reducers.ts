import { combineReducers } from 'redux';
import { authSlice } from 'services/auth';
import { bleSlice } from 'services/ble/slice';

import { InjectedReducersType } from './injector-typings';

export default function createReducer(
  injectedReducers: InjectedReducersType = {}
) {
  return combineReducers({
    auth: authSlice.reducer,
    ble: bleSlice.reducer,
    ...injectedReducers,
  });
}
