import React from 'react';
import { View } from 'react-native';
import tailwind from 'tailwind-rn';
import {
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { Avatar, Title, Caption, Drawer } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeSwitch } from 'components/ThemeSwitch';

type Props = {} & DrawerContentComponentProps<DrawerContentOptions>;

const DrawerContent: React.FC<Props> = props => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    container: { ...tailwind('flex'), backgroundColor: theme.colors.surface },
    userCard: tailwind('pl-4 py-4'),
    userNameText: tailwind('mt-4 text-2xl font-semibold'),
    emailText: tailwind('text-sm'),
    drawerSection: tailwind('mt-4'),
    themeSwitch: tailwind('ml-2'),
  });

  return (
    <DrawerContentScrollView style={styles.container} {...props}>
      <View style={styles.userCard}>
        <Avatar.Text size={60} label="TG" />
        <Title style={styles.userNameText}>Tong Ge</Title>
        <Caption style={styles.emailText}>geto@tcd.ie</Caption>
      </View>
      <Drawer.Section style={styles.drawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <MaterialCommunityIcons
              name="account-outline"
              color={color}
              size={size}
            />
          )}
          label="Profile"
          onPress={() => {}}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="tune" color={color} size={size} />
          )}
          label="Preferences"
          onPress={() => {}}
        />
      </Drawer.Section>
      <Drawer.Section title="Theme">
        <View style={styles.themeSwitch}>
          <ThemeSwitch />
        </View>
      </Drawer.Section>
    </DrawerContentScrollView>
  );
};

export default DrawerContent;
