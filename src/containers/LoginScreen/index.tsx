import React, { useEffect, useState } from 'react';
import { compose, bindActionCreators, Dispatch } from 'redux';
import { ScrollView, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, ProgressBar, Text, TextInput } from 'react-native-paper';
import { useFormField } from 'utils/FormFields';
import tailwind from 'tailwind-rn';
import { MAX_LEN } from 'components/PassMeter';

import { AppScreens } from 'navigators/ScreenDefs';
import { connect } from 'react-redux';
import { authSlice, selectAuth, signInAction } from 'services/auth';
import { useTheme } from 'styled-components/native';
import InfoBanner, { getInfoLevel } from 'components/InfoBanner';
import { RootState } from 'store/types';

type ComponentProps = {
  navigation: StackNavigationProp<any, AppScreens.Login>;
};

type Props = ComponentProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const LoginScreen: React.FC<Props> = ({
  navigation,
  authKey,
  lastError,
  signInAction,
  setError,
}) => {
  const emailRegexp = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  const theme = useTheme();
  const emailField = useFormField();
  const passwordField = useFormField();
  const [emailErr, setEmailErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
    if (authKey) {
      // navigation.navigate(AppScreens.Map);
    }
  }, [authKey, lastError]);

  const onLoginClick = () => {
    // validate email address
    if (emailField.value.length === 0) {
      setEmailErr('Please input your email address');
      return;
    } else if (!emailRegexp.test(String(emailField.value).toLowerCase())) {
      setEmailErr('Wrong email format, please try again');
      return;
    }
    setEmailErr('');
    // validate password
    if (passwordField.value.length === 0) {
      setPasswordErr('Please input your password');
      return;
    }
    setPasswordErr('');
    setError({ ...lastError!, show: false });
    setIsLoading(true);
    signInAction({
      email: emailField.value,
      password: passwordField.value,
    });
  };

  return (
    <View>
      {isLoading && <ProgressBar indeterminate color={theme.colors.accent} />}
      {lastError && (
        <InfoBanner
          msg={lastError.msg}
          show={lastError.show}
          level={getInfoLevel(lastError?.code)}
          onDismiss={() => {
            setError({ ...lastError!, show: false });
          }}
        />
      )}
      <ScrollView>
        <Text style={tailwind('text-center text-3xl mt-8')}>Invigilator</Text>
        <Text style={tailwind('text-center text-2xl font-bold my-4')}>
          Login
        </Text>
        <View style={tailwind('flex flex-col justify-center px-8')}>
          <TextInput
            mode="outlined"
            style={tailwind('my-2')}
            label="Email"
            autoCompleteType="email"
            keyboardType="email-address"
            testID="email"
            {...emailField}
          />
          {emailErr !== '' && (
            <Text style={{ color: theme.colors.error }}>{emailErr}</Text>
          )}
          <TextInput
            mode="outlined"
            style={tailwind('my-2')}
            label="Password"
            maxLength={MAX_LEN}
            secureTextEntry
            testID="password"
            {...passwordField}
          />
          {passwordErr !== '' && (
            <Text style={{ color: theme.colors.error }}>{passwordErr}</Text>
          )}
          <View style={tailwind('flex-row justify-around my-4')}>
            <Button
              mode="outlined"
              onPress={() => {
                navigation.goBack();
              }}
            >
              Back
            </Button>
            <Button mode="contained" onPress={onLoginClick} testID="Login">
              Login
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    lastError: selectAuth(state).lastError,
    authKey: selectAuth(state).authKey,
  };
};

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      signInAction,
      ...authSlice.actions,
    },
    dispatch
  );
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(
  LoginScreen
) as React.ComponentType<ComponentProps>;
