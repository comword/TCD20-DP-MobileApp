import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppScreens } from 'navigators/ScreenDefs';
import { View, Text as RNText } from 'react-native';
import tailwind from 'tailwind-rn';

import { useTheme } from 'styled-components/native';
import { Button, Text } from 'react-native-paper';

import IntroIcon from './assets/intro.svg';
import DownloadModal from 'components/DownloadModal';

type Props = {
  navigation: StackNavigationProp<any, AppScreens.Welcome>;
};

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  return (
    <>
      <View style={tailwind('flex h-full w-full')}>
        <View style={tailwind('flex-1 pt-16 px-8')}>
          <Text style={tailwind('text-left text-2xl')}>Invigilator</Text>
          <Text style={tailwind('text-center text-4xl mt-3')}>
            <RNText style={{ color: theme.colors.accent }}>Veritas</RNText>{' '}
            Exams
          </Text>
          <IntroIcon
            width={tailwind('w-full').width}
            height={tailwind('h-1/4').height}
          />
          <Button
            mode="contained"
            uppercase={false}
            onPress={() => {
              navigation.navigate(AppScreens.Register);
            }}
            color={theme.colors.primary}
            style={tailwind('mt-6')}
          >
            <Text style={tailwind('text-lg')}>Sign up</Text>
          </Button>
          <Button
            mode="outlined"
            uppercase={false}
            onPress={() => {
              navigation.navigate(AppScreens.Login);
            }}
            style={tailwind('mt-6')}
          >
            <Text style={tailwind('text-lg')}>Log in</Text>
          </Button>
          <Button
            mode="outlined"
            uppercase={false}
            onPress={() => {
              navigation.navigate(AppScreens.Camera);
            }}
            style={tailwind('mt-6')}
          >
            <Text style={tailwind('text-lg')}>Test Camera</Text>
          </Button>
        </View>
      </View>
      <DownloadModal />
    </>
  );
};

export default WelcomeScreen;
