import React from 'react';
import { View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { connect } from 'react-redux';
import { bindActionCreators, compose, Dispatch } from 'redux';
import { injectReducer } from 'utils/redux-injectors';
import { AppScreens } from 'navigators/ScreenDefs';
import { RootState } from 'store/types';
import { examSlice, selectExam } from './slice';

type ComponentProps = {
  navigation: StackNavigationProp<any, AppScreens.PastExams>;
};

type Props = ComponentProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const PastExam: React.FC<Props> = ({ exams }) => {
  return <View />;
};

const mapStateToProps = (state: RootState) => {
  return {
    exams: selectExam(state).exams,
  };
};

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators({}, dispatch);
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({
  key: examSlice.name,
  reducer: examSlice.reducer,
});

export default compose(
  withConnect,
  withReducer
)(PastExam) as React.ComponentType<ComponentProps>;
