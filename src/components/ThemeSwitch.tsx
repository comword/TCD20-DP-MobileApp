import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RadioButton, Text } from 'react-native-paper';

import { changeTheme, selectThemeKey } from 'theme/slice';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeKeyType } from 'theme/types';
import tailwind from 'tailwind-rn';

export function ThemeSwitch() {
  const theme = useSelector(selectThemeKey);
  const dispatch = useDispatch();

  const handleThemeChange = (value: string) => {
    dispatch(changeTheme(value as ThemeKeyType));
  };

  const styles = StyleSheet.create({
    container: tailwind('flex flex-row'),
    item: tailwind('flex flex-row items-center justify-center mx-2'),
  });

  return (
    <RadioButton.Group onValueChange={handleThemeChange} value={theme}>
      <View style={styles.container}>
        <View style={styles.item}>
          <Text>System</Text>
          <RadioButton value="system" />
        </View>
        <View style={styles.item}>
          <Text>Light</Text>
          <RadioButton value="light" />
        </View>
        <View style={styles.item}>
          <Text>Dark</Text>
          <RadioButton value="dark" />
        </View>
      </View>
    </RadioButton.Group>
  );
}
