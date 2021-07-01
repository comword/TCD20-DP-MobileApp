import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExamDetail } from 'services/gen-proto/student_pb';
import { ErrorMsg } from 'services/types';
import { RootState } from 'store/types';

export type ExamDetailState = {
  lastError?: ErrorMsg;
  pendingExams: Array<ExamDetail.AsObject>;
  pastExams: Array<ExamDetail.AsObject>;
};

const initialState: ExamDetailState = {
  pendingExams: [],
  pastExams: [],
};

export const examSlice = createSlice({
  name: 'exams',
  initialState,
  reducers: {
    setState(state, action: PayloadAction<ExamDetailState>) {
      state = action.payload;
    },
    setError(state, action: PayloadAction<ErrorMsg | undefined>) {
      state.lastError = action.payload;
    },
    setPendingExams(state, action: PayloadAction<Array<ExamDetail.AsObject>>) {
      state.pendingExams = action.payload;
    },
    setPastExams(state, action: PayloadAction<Array<ExamDetail.AsObject>>) {
      state.pastExams = action.payload;
    },
  },
});

export const selectExam = createSelector(
  [(state: RootState) => state.exams || initialState],
  exams => exams
);
