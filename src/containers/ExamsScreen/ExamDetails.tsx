import React from 'react';
import { View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { injectReducer } from 'utils/redux-injectors';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { AppScreens } from 'navigators/ScreenDefs';
import { RootState } from 'store/types';
import { examSlice, selectExam } from './slice';
import { Title } from 'react-native-paper';
import tailwind from 'tailwind-rn';

type RouteParamList = {
  [AppScreens.ExamDetails]: { examId: string };
};

type ComponentProps = {
  navigation: StackNavigationProp<RouteParamList, AppScreens.ExamDetails>;
  route: RouteProp<RouteParamList, AppScreens.ExamDetails>;
};

type Props = ComponentProps & ReturnType<typeof mapStateToProps>;

const ExamDetails: React.FC<Props> = ({ route, exams }) => {
  const { examId } = route.params;
  return (
    <View style={tailwind('flex h-full w-full items-center justify-center')}>
      <Title>ExamId: {examId}</Title>
    </View>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    exams: selectExam(state).exams,
  };
};

const withConnect = connect(mapStateToProps, null);
const withReducer = injectReducer({
  key: examSlice.name,
  reducer: examSlice.reducer,
});

export default compose(
  withConnect,
  withReducer
)(ExamDetails) as React.ComponentType<ComponentProps>;
