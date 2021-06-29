import React from 'react';
import { AppScreens } from 'navigators/ScreenDefs';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { RootState } from 'store/types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { selectUserDetail, userSlice } from 'store/UserDetail';

import ExamDetails from './ExamDetails';
import ExamListScreen from './ExamListScreen';
import { injectReducer } from 'redux-injectors';
import AppHeader from 'components/AppHeader';

type ComponentProps = {
  navigation: DrawerNavigationProp<any, AppScreens.Exams>;
};

type Props = ComponentProps & ReturnType<typeof mapStateToProps>;

const ExamsScreen: React.FC<Props> = ({ navigation, userDetail }) => {
  const Stack = createStackNavigator();
  return (
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
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    userDetail: selectUserDetail(state),
  };
};

const withConnect = connect(mapStateToProps, null);
const withReducer = injectReducer({
  key: userSlice.name,
  reducer: userSlice.reducer,
});

export default compose(
  withConnect,
  withReducer
)(ExamsScreen) as React.ComponentType<ComponentProps>;
