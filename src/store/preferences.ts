import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/types';

export interface UserPreferenceState {
  useCamera: string;
}

const initialState: UserPreferenceState = {
  useCamera: '1',
};

export const preferenceSlice = createSlice({
  name: 'pref',
  initialState,
  reducers: {
    setUseCamera(state, action: PayloadAction<string>) {
      state.useCamera = action.payload;
    },
  },
});

export const selectPreference = createSelector(
  [(state: RootState) => state.pref || initialState],
  pref => {
    return pref;
  }
);

export const reducer = preferenceSlice.reducer;
export const preferenceSliceKey = preferenceSlice.name;
