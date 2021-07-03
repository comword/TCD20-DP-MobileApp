import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RadioButton, Text } from 'react-native-paper';
import tailwind from 'tailwind-rn';

type CameraType = {
  id: string;
  name: string;
};

interface Props {
  cameras: Array<CameraType>;
  value: string;
  onSelect: (value: string) => void;
}

const CameraPref: React.FC<Props> = ({ cameras, value, onSelect }) => {
  const styles = StyleSheet.create({
    container: tailwind('flex flex-row'),
    item: tailwind('flex flex-row items-center justify-center mx-2'),
  });

  return (
    <RadioButton.Group onValueChange={onSelect} value={value}>
      <View style={styles.container}>
        {cameras.map(it => (
          <View key={`CameraPref-${it.name}`} style={styles.item}>
            <Text>{it.name}</Text>
            <RadioButton value={it.id} />
          </View>
        ))}
      </View>
    </RadioButton.Group>
  );
};

export default CameraPref;
