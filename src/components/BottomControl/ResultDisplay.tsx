import React from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import tailwind from 'tailwind-rn';
import { List } from 'react-native-paper';
import { DefaultTheme, useTheme } from 'styled-components/native';
import { DefaultAlertMap, InferResult, MLActionTypes } from 'services/ml/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import UnknownIcon from './assets/unknown.svg';

type Props = {
  results: Array<InferResult>;
  alertMap?: Map<MLActionTypes, number>;
};

export const ResultDisplay: React.FC<Props> = ({ results, alertMap }) => {
  const theme = useTheme();
  const alertMapDef = alertMap ? alertMap : DefaultAlertMap;
  const topResult = results.reduce((prev, current) => {
    return prev.prob > current.prob ? prev : current;
  });
  const topColor = getTextColorMap(theme, topResult.type, alertMapDef);
  const styles = StyleSheet.create({
    topItemText: {
      ...tailwind('text-4xl ml-2'),
      color: topColor,
    },
    iconContainer: {
      height: 64,
      width: 64,
    },
  });

  return (
    <View style={tailwind('flex flex-col pb-4')}>
      <View
        style={tailwind(
          'flex flex-row items-center w-full justify-center my-2'
        )}
      >
        <View style={styles.iconContainer}>
          {alertMapDef.get(topResult.type) === 0 && (
            <MaterialCommunityIcons
              name="check-circle"
              size={64}
              color={topColor}
            />
          )}
          {alertMapDef.get(topResult.type) === 1 && (
            <UnknownIcon height="100%" width="100%" color={topColor} />
          )}
          {alertMapDef.get(topResult.type) === 2 && (
            <MaterialCommunityIcons
              name="head-alert"
              size={64}
              color={topColor}
            />
          )}
        </View>
        <View>
          <Text style={styles.topItemText}>{topResult.type.toString()}</Text>
        </View>
      </View>
      <FlatList
        data={results}
        renderItem={it => <Item item={it.item} alertMap={alertMapDef} />}
        keyExtractor={it => it.type}
      />
    </View>
  );
};

function Item({
  item,
  alertMap,
}: {
  item: InferResult;
  alertMap: Map<MLActionTypes, number>;
}) {
  const theme = useTheme();
  const styles = StyleSheet.create({
    listItemContainer: {
      ...tailwind('w-full'),
      backgroundColor: theme.colors.surface,
    },
  });

  return (
    <List.Item
      title={
        <Text style={{ color: getTextColorMap(theme, item.type, alertMap) }}>
          {item.type}
        </Text>
      }
      right={props => <Text {...props}>{item.prob}</Text>}
      style={styles.listItemContainer}
    />
  );
}

const getTextColorMap = (
  theme: DefaultTheme,
  type: MLActionTypes,
  alertMap: Map<MLActionTypes, number>
) => {
  let textColor = '';
  switch (alertMap.get(type)) {
    case 0:
      textColor = theme.colors.success;
      break;
    case 2:
      textColor = theme.colors.error;
      break;
    case 1:
    default:
      textColor = theme.colors.warning;
      break;
  }
  return textColor;
};
