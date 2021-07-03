import { combineReducers } from 'redux';
import { PCSlice } from 'services/ml';
import { authSlice } from 'services/auth';

import { InjectedReducersType } from './injector-typings';
import { preferenceSlice } from './preferences';
import { reducer as themeReducer } from 'theme/slice';

export default function createReducer(
  injectedReducers: InjectedReducersType = {}
) {
  return combineReducers({
    auth: authSlice.reducer,
    PCSrv: PCSlice.reducer,
    pref: preferenceSlice.reducer,
    theme: themeReducer,
    ...injectedReducers,
  });
}
