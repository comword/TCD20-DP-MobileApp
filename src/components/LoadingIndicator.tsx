import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
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
