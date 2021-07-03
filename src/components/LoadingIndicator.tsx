import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';
import tailwind from 'tailwind-rn';

const LoadingIndicator = () => {
  const theme = useTheme();
  return (
    <View
      style={tailwind(
        'flex flex-col overflow-hidden text-center justify-center items-center'
      )}
    >
      <ActivityIndicator animating color={theme.colors.primary} />
    </View>
  );
};

export default LoadingIndicator;

export const FullscreenLoading = styled(LoadingIndicator)`
  ${tailwind(
    'flex flex-col overflow-hidden h-full w-full text-center justify-center items-center'
  )}
`;
