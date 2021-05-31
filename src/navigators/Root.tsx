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
import AppNavigator from './AppNavigator';
import { ThemeContext } from 'styled-components/native';
import LoadingIndicator from 'components/LoadingIndicator';
import { compose, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

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

type Props = ReturnType<typeof mapDispatchToProps>;

const RootNavigator: React.FC<Props> = ({}) => {
  const themeContext = useContext(ThemeContext);
  // const dispatch = useDispatch();

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <NavigationContainer ref={navigatorRef} theme={themeContext}>
        <AppNavigator />
      </NavigationContainer>
    </Suspense>
  );
};

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators({}, dispatch);
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(RootNavigator);
