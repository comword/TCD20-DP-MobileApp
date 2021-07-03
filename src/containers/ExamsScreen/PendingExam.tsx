import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { connect } from 'react-redux';
import { bindActionCreators, compose, Dispatch } from 'redux';
import { injectReducer } from 'utils/redux-injectors';
import { AppScreens } from 'navigators/ScreenDefs';
import { RootState } from 'store/types';
import { examSlice, selectExam } from './slice';
import ExamList from 'components/ExamList';

type ComponentProps = {
  navigation: StackNavigationProp<any, AppScreens.PendingExams>;
};

type Props = ComponentProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const PendingExam: React.FC<Props> = ({ navigation, exams }) => {
  const mockExams = [0, 1, 2, 3, 4].map(it => ({
    accessible: it < 2,
    icon: 'file-check-outline',
    id: it.toString(),
    name: `Mock exam ${it}`,
    description: '',
  }));
  return (
    <ExamList
      exams={mockExams}
      onSelect={id =>
        navigation.navigate(AppScreens.ExamDetails, { examId: id })
      }
    />
  );
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
)(PendingExam) as React.ComponentType<ComponentProps>;
