import React from 'react';
import { Avatar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { ImageSourcePropType } from 'react-native';

interface Props {
  size: number;
  img?: ImageSourcePropType;
  uName?: string;
}

const MultiAvatar: React.FC<Props> = ({ size, img, uName }) => {
  if (img) return <Avatar.Image size={size} source={img} />;
  else if (uName) return <Avatar.Text size={size} label={uName} />;
  else
    return (
      <Avatar.Icon
        size={size}
        icon={ic => <MaterialIcons name="person" {...ic} />}
      />
    );
};

export default MultiAvatar;
