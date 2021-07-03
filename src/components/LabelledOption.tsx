import * as React from 'react';
import { View, ViewProps } from 'react-native';
import { Text } from 'react-native-paper';
import tailwind from 'tailwind-rn';

type Props = {
  label: string;
} & ViewProps;

const LabelledOption: React.FC<Props> = ({ label, children, ...rest }) => {
  return (
    <View
      style={tailwind('flex flex-row justify-between items-center px-4 py-2')}
      {...rest}
    >
      <Text>{label}</Text>
      {children}
    </View>
  );
};

export default LabelledOption;
