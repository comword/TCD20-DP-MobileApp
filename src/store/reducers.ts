import { combineReducers } from 'redux';
import { PCSlice } from 'services/ml';
// import { authSlice } from 'services/auth';

import { InjectedReducersType } from './injector-typings';

export default function createReducer(
  injectedReducers: InjectedReducersType = {}
) {
  return combineReducers({
    // auth: authSlice.reducer,
    PCSrv: PCSlice.reducer,
    ...injectedReducers,
  });
}
