import React, { useEffect } from 'react';
import { ThemeProvider as SCThemeProvider } from 'styled-components/native';
import { Appearance } from 'react-native-appearance';
import { compose, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  selectTheme,
  changeDisplay,
  selectDisplay,
  selectThemeKey,
} from './slice';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { RootState } from 'store/types';

type ComponentProps = {};

type Props = ComponentProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const ThemeProvider: React.FC<Props> = ({
  theme,
  themeDisplay,
  changeDisplay,
  themeKey,
  children,
}) => {
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (themeKey === 'system')
        changeDisplay(colorScheme === 'dark' ? 'dark' : 'light');
    });
    return () => subscription.remove();
  }, [changeDisplay, themeKey]);

  return (
    <PaperProvider theme={theme}>
      <SCThemeProvider theme={theme}>
        <StatusBar
          backgroundColor="transparent"
          animated
          translucent
          style={themeDisplay === 'dark' ? 'light' : 'dark'}
        />
        {React.Children.only(children)}
      </SCThemeProvider>
    </PaperProvider>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    themeDisplay: selectDisplay(state),
    theme: selectTheme(state),
    themeKey: selectThemeKey(state),
  };
};

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      changeDisplay,
    },
    dispatch
  );
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(
  ThemeProvider
) as React.ComponentType<ComponentProps>;
