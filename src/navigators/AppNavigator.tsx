import React, { useContext } from 'react';
import { compose, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { injectReducer, injectSaga } from 'redux-injectors';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { AppScreens } from './ScreenDefs';
import { ThemeContext } from 'styled-components/native';
import WelcomeScreen from 'containers/WelcomeScreen';
import RegisterScreen from 'containers/RegisterScreen';
import LoginScreen from 'containers/LoginScreen';

import { RootState } from 'store/types';
import { authSlice, rootAuthSaga, selectAuth } from 'services/auth';

const TransitionScreenOptions = {
  ...TransitionPresets.SlideFromRightIOS,
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const AppNavigator: React.FC<Props> = ({ authKey }) => {
  const themeContext = useContext(ThemeContext);
  const Stack = createStackNavigator();
  const navOptions = {
    headerStyle: {
      backgroundColor: themeContext.colors.primary,
    },
  };
  return (
    <Stack.Navigator screenOptions={TransitionScreenOptions}>
      {!authKey && (
        <>
          <Stack.Screen
            name={AppScreens.Welcome}
            options={{ headerShown: false, ...navOptions }}
            component={WelcomeScreen}
          />
          <Stack.Screen
            name={AppScreens.Register}
            options={navOptions}
            component={RegisterScreen}
          />
          <Stack.Screen
            name={AppScreens.Login}
            options={navOptions}
            component={LoginScreen}
          />
        </>
      )}
      {authKey && (
        <>
          <Stack.Screen
            name={AppScreens.Welcome}
            options={{ headerShown: false, ...navOptions }}
            component={WelcomeScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    authKey: selectAuth(state).authKey,
  };
};

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators({}, dispatch);
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({
  key: authSlice.name,
  reducer: authSlice.reducer,
});
const withSaga = injectSaga({ key: authSlice.name, saga: rootAuthSaga });

export default compose(withConnect, withReducer, withSaga)(AppNavigator);
