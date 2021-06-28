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
import { RootState } from 'store/types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { selectUserDetail, userSlice } from 'store/UserDetail';
import { injectReducer } from 'redux-injectors';
import { MaterialIcons } from '@expo/vector-icons';

type ComponentProps = {} & DrawerContentComponentProps<DrawerContentOptions>;

type Props = ComponentProps & ReturnType<typeof mapStateToProps>;

const DrawerContent: React.FC<Props> = ({ userDetail, ...rest }) => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    container: { ...tailwind('flex'), backgroundColor: theme.colors.surface },
    userCard: tailwind('pl-4 py-4'),
    userNameText: tailwind('mt-4 text-2xl font-semibold'),
    emailText: tailwind('text-sm'),
    drawerSection: tailwind('mt-4'),
    themeSwitch: tailwind('ml-2'),
  });

  const getFocused = (name: string) => {
    const { state } = rest;
    const { routes, index } = state;
    const focusedRoute = routes[index].name;
    return focusedRoute === name;
  };

  return (
    <DrawerContentScrollView style={styles.container} {...rest}>
      <View style={styles.userCard}>
        {(userDetail.firstName || userDetail.lastName) && (
          <React.Fragment>
            <Avatar.Text
              size={60}
              label={userDetail.firstName[0] + userDetail.lastName[0]}
            />
            <Title style={styles.userNameText}>
              {userDetail.firstName + ' ' + userDetail.lastName}
            </Title>
            <Caption style={styles.emailText}>{userDetail.email}</Caption>
          </React.Fragment>
        )}
        {!userDetail.firstName && !userDetail.lastName && (
          <React.Fragment>
            <Avatar.Icon
              size={60}
              icon={ic => <MaterialIcons name="person" {...ic} />}
            />
            <Title style={styles.userNameText}>Unknown user</Title>
            <Caption style={styles.emailText}>Unknown email</Caption>
          </React.Fragment>
        )}
      </View>
      <Drawer.Section style={styles.drawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <MaterialCommunityIcons
              name="file-check-outline"
              color={color}
              size={size}
            />
          )}
          label="Exams"
          focused={getFocused('Exams')}
          onPress={() => {}}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <MaterialCommunityIcons
              name="account-outline"
              color={color}
              size={size}
            />
          )}
          label="Profile"
          focused={getFocused('Profile')}
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

const mapStateToProps = (state: RootState) => {
  return {
    userDetail: selectUserDetail(state),
  };
};

const withConnect = connect(mapStateToProps, null);
const withReducer = injectReducer({
  key: userSlice.name,
  reducer: userSlice.reducer,
});

export default compose(
  withConnect,
  withReducer
)(DrawerContent) as React.ComponentType<ComponentProps>;
