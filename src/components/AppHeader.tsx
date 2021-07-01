import React from 'react';
import { TouchableOpacity } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Appbar, useTheme } from 'react-native-paper';
import { AppScreens } from 'navigators/ScreenDefs';
import { StackHeaderProps } from '@react-navigation/stack';
import MultiAvatar from 'components/MultiAvatar';
import { UserDetailState } from 'services/userdetail';
import tailwind from 'tailwind-rn';
import { StyleSheet } from 'react-native';

type Props = StackHeaderProps & {
  drawerNavigation: DrawerNavigationProp<any, AppScreens.Exams>;
  userDetail: UserDetailState;
};

const AppHeader: React.FC<Props> = ({
  scene,
  previous,
  navigation,
  drawerNavigation,
  userDetail,
}) => {
  const theme = useTheme();
  const { options } = scene.descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.name;

  const userName =
    userDetail.firstName.length !== 0 && userDetail.lastName.length !== 0
      ? userDetail.firstName[0] + userDetail.lastName[0]
      : undefined;

  const styles = StyleSheet.create({
    header: { elevation: 0 },
  });

  return (
    <Appbar.Header
      style={styles.header}
      theme={{ colors: { primary: theme.colors.surface } }}
    >
      {previous ? (
        <Appbar.BackAction
          onPress={() => navigation.pop()}
          color={theme.colors.primary}
        />
      ) : (
        <TouchableOpacity
          style={tailwind('ml-2')}
          onPress={() => {
            drawerNavigation.openDrawer();
          }}
        >
          <MultiAvatar
            size={40}
            img={
              userDetail.avatar.length !== 0
                ? { uri: userDetail.avatar }
                : undefined
            }
            uName={userName}
          />
        </TouchableOpacity>
      )}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

export default AppHeader;
