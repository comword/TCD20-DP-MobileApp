import React from 'react';
import { AppScreens } from 'navigators/ScreenDefs';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { RootState } from 'store/types';
import { connect } from 'react-redux';
import { bindActionCreators, compose, Dispatch } from 'redux';
import { injectReducer } from 'redux-injectors';
import { selectUserDetail, userSlice } from 'services/userdetail';

import ExamDetails from './ExamDetails';
import ExamListScreen from './ExamListScreen';
import AppHeader from 'components/AppHeader';
import { WithInfoBanner } from 'components/InfoBanner';
import { examSlice, selectExam } from './slice';

type ComponentProps = {
  navigation: DrawerNavigationProp<any, AppScreens.Exams>;
};

type Props = ComponentProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const ExamsScreen: React.FC<Props> = ({
  navigation,
  userDetail,
  lastError,
  setError,
}) => {
  const Stack = createStackNavigator();
  return (
    <WithInfoBanner top={false} error={lastError} onDismiss={e => setError(e)}>
      <Stack.Navigator
        initialRouteName={AppScreens.ExamList}
        headerMode="screen"
        screenOptions={{
          header: props => (
            <AppHeader
              {...props}
              drawerNavigation={navigation}
              userDetail={userDetail}
            />
          ),
        }}
      >
        <Stack.Screen name={AppScreens.ExamList} component={ExamListScreen} />
        <Stack.Screen name={AppScreens.ExamDetails} component={ExamDetails} />
      </Stack.Navigator>
    </WithInfoBanner>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    userDetail: selectUserDetail(state),
    lastError: selectExam(state).lastError,
  };
};

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      ...examSlice.actions,
    },
    dispatch
  );
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withUserReducer = injectReducer({
  key: userSlice.name,
  reducer: userSlice.reducer,
});
const withExamReducer = injectReducer({
  key: examSlice.name,
  reducer: examSlice.reducer,
});

export default compose(
  withConnect,
  withUserReducer,
  withExamReducer
)(ExamsScreen) as React.ComponentType<ComponentProps>;
