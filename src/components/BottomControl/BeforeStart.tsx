import React from 'react';
import { GestureResponderEvent, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useTheme } from 'styled-components/native';
import tailwind from 'tailwind-rn';

interface Props {
  onClickStart: (e: GestureResponderEvent) => void;
}

const BeforeStart: React.FC<Props> = ({ onClickStart }) => {
  const theme = useTheme();
  return (
    <View>
      <IconButton
        icon="play"
        size={50}
        style={{ ...tailwind('m-8'), backgroundColor: theme.colors.success }}
        color={theme.colors.text}
        onPress={onClickStart}
      />
    </View>
  );
};

export default BeforeStart;
