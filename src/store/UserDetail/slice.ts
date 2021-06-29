import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/types';
import { UserDetailState } from './state';

const initialState: UserDetailState = {
  firstName: '',
  lastName: '',
  studentId: '',
  birthday: '01-01-1970', //DD-MM-yyyy
  email: '',
  avatar: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setState(state, action: PayloadAction<UserDetailState>) {
      state = action.payload;
    },
    setFirstName(state, action: PayloadAction<string>) {
      state.firstName = action.payload;
    },
    setLastName(state, action: PayloadAction<string>) {
      state.lastName = action.payload;
    },
    setStudentId(state, action: PayloadAction<string>) {
      state.studentId = action.payload;
    },
    setBirthday(state, action: PayloadAction<string>) {
      state.birthday = action.payload;
    },
  },
});

export const selectUserDetail = createSelector(
  [(state: RootState) => state.user || initialState],
  user => user
);
