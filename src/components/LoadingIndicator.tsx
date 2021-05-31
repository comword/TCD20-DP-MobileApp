import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useTheme } from 'styled-components/native';
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
