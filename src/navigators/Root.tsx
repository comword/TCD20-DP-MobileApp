/**
 * Used to navigating without the navigation prop
 * @see https://reactnavigation.org/docs/navigating-without-navigation-prop/
 *
 * You can add other navigation functions that you need and export them
 */
import React, { Suspense, useContext } from 'react';
import {
  CommonActions,
  NavigationContainer,
  NavigationContainerRef,
  ParamListBase,
  StackActions,
} from '@react-navigation/native';
import PreLoginNavigator from './PreLoginNavigator';
import PostLoginNavigator from './PostLoginNavigator';
import LoadingIndicator from 'components/LoadingIndicator';
import { selectAuth } from 'services/auth';
import { RootState } from 'store/types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { ThemeContext } from 'styled-components/native';

export const navigatorRef = React.createRef<NavigationContainerRef>();
let stack: Array<object> = [];

export const RouterActions = {
  push: (screen: string, props: object = {}): void => {
    stack.push({
      name: screen,
      params: props,
    });

    navigatorRef.current?.dispatch(
      CommonActions.navigate({
        params: props,
        name: screen,
      })
    );
  },
  replace: (screen: string, props: object = {}): void => {
    stack = [
      {
        name: screen,
        params: props,
      },
    ];
    const replaceAction = StackActions.replace(screen, props);
    navigatorRef.current?.dispatch(replaceAction);
  },
  pop: (): void => {
    stack.pop();

    const backAction = CommonActions.goBack();
    navigatorRef.current?.dispatch(backAction);
  },
  currentState: (): object => stack[stack.length - 1],
  navigate: (name: string, params: ParamListBase): void => {
    navigatorRef.current?.navigate(name, params);
  },
  navigateAndReset: (routes = [], index = 0): void => {
    navigatorRef.current?.dispatch(
      CommonActions.reset({
        index,
        routes,
      })
    );
  },
};

type Props = {} & ReturnType<typeof mapStateToProps>;

const RootNavigator: React.FC<Props> = ({ authKey }) => {
  const themeContext = useContext(ThemeContext);

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <NavigationContainer ref={navigatorRef} theme={themeContext}>
        {!authKey && <PreLoginNavigator />}
        {authKey.length !== 0 && <PostLoginNavigator />}
      </NavigationContainer>
    </Suspense>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    authKey: selectAuth(state).authKey,
  };
};

export default connect(mapStateToProps, null)(RootNavigator);
