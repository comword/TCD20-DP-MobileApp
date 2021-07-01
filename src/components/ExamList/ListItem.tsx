import React from 'react';
import { StyleSheet } from 'react-native';
import { List, useTheme } from 'react-native-paper';
import tailwind from 'tailwind-rn';

export type ExamsType = {
  accessible: boolean;
  icon?: string;
  id: string;
  name: string;
  description: string;
  result?: string;
};

interface Props {
  item: ExamsType;
  right?: (props: {
    color: string;
    style?: {
      marginRight: number;
      marginVertical?: number;
    };
  }) => React.ReactNode;
  onSelect?: (id: string) => void;
}

const ListItem: React.FC<Props> = ({ item, right, onSelect }) => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    listItemContainer: tailwind('w-full'),
    listItemDisabled: {
      ...tailwind('w-full'),
      backgroundColor: theme.colors.disabled,
    },
    listItemTitle: {
      color: theme.colors.text,
    },
    listItemTitleDisabled: {
      color: theme.colors.disabled,
    },
  });
  return (
    <List.Item
      disabled={!item.accessible}
      left={
        item.icon
          ? props => <List.Icon {...props} icon={item.icon!} />
          : undefined
      }
      title={item.name}
      description={item.description}
      style={
        item.accessible ? styles.listItemContainer : styles.listItemDisabled
      }
      titleStyle={
        item.accessible ? styles.listItemTitle : styles.listItemTitleDisabled
      }
      right={right}
      onPress={() => {
        if (onSelect) onSelect(item.id);
      }}
    />
  );
};

export default ListItem;
