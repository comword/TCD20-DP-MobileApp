import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDetailState } from './state';

const initialState: UserDetailState = {
  firstName: '',
  lastName: '',
  studentId: '',
  birthday: '01-01-1970', //DD-MM-yyyy
  class: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setFirstName(state, action: PayloadAction<string>) {
      state.firstName = action.payload;
    },
    setLastName(state, action: PayloadAction<string>) {
      state.lastName = action.payload;
    },
    setBirthday(state, action: PayloadAction<string>) {
      state.birthday = action.payload;
    },
  },
});
