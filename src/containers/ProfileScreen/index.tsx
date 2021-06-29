import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { compose, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppScreens } from 'navigators/ScreenDefs';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import tailwind from 'tailwind-rn';

import {
  Divider,
  TextInput,
  Text,
  useTheme,
  Portal,
  Appbar,
} from 'react-native-paper';
import { DatePickerModalContent } from 'react-native-paper-dates';
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/src/Date/Calendar';
import { RootState } from 'store/types';
import { selectUserDetail, userSlice } from 'store/UserDetail';
import { injectReducer } from 'redux-injectors';
import moment from 'moment';
import AppHeader from 'components/AppHeader';

type ComponentProps = {
  navigation: DrawerNavigationProp<any, AppScreens.Exams>;
};

type Props = ComponentProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const ProfileScreen: React.FC<Props> = ({
  userDetail,
  setFirstName,
  setLastName,
  setBirthday,
  navigation,
}) => {
  const theme = useTheme();
  const [openBirthday, setOpenBirthday] = useState(false);
  const styles = StyleSheet.create({
    sectionText: tailwind('text-sm mt-5 mb-2 px-4'),
    textBox: tailwind('my-2 px-4'),
    textBoxDuo: tailwind('my-2 px-4 w-1/2'),
    dateModal: {
      backgroundColor: theme.colors.surface,
    },
  });

  const onConfirmBirthday = useCallback(
    (params: { date: CalendarDate }) => {
      setOpenBirthday(false);
      setBirthday(moment(params.date).format('DD-MM-yyyy'));
    },
    [setBirthday]
  );

  return (
    <React.Fragment>
      <AppHeader
        scene={{
          //@ts-ignore
          descriptor: {
            options: { headerTitle: AppScreens.Profile },
          },
        }}
        drawerNavigation={navigation}
        userDetail={userDetail}
      />
      <ScrollView
        style={tailwind('flex h-full w-full')}
        scrollEventThrottle={1}
      >
        <Text style={styles.sectionText}>About you</Text>
        <Divider />
        <View style={tailwind('flex-row justify-between')}>
          <TextInput
            style={styles.textBoxDuo}
            testID="firstName"
            label="First name"
            mode="outlined"
            textAlign="left"
            value={userDetail.firstName}
            onChangeText={t => setFirstName(t)}
          />
          <TextInput
            style={styles.textBoxDuo}
            testID="lastName"
            label="Last name"
            mode="outlined"
            textAlign="left"
            value={userDetail.lastName}
            onChangeText={t => setLastName(t)}
          />
        </View>
        <TouchableOpacity onPress={() => setOpenBirthday(true)}>
          <TextInput
            style={styles.textBox}
            testID="birthday"
            editable={false}
            textAlign="left"
            label="Birthday"
            mode="outlined"
            value={moment(userDetail.birthday, 'DD-MM-yyyy').format(
              'DD-MMM-YYYY'
            )}
          />
        </TouchableOpacity>
        <Text style={styles.sectionText}>Options</Text>
        <Divider />
      </ScrollView>
      <Portal>
        {openBirthday && (
          <View style={[StyleSheet.absoluteFill, styles.dateModal]}>
            <StatusBar
              translucent
              barStyle={theme.dark ? 'dark-content' : 'light-content'}
            />
            <View
              style={[
                {
                  height: StatusBar.currentHeight,
                  backgroundColor: theme.colors.primary,
                },
              ]}
            />
            <DatePickerModalContent
              mode="single"
              onDismiss={() => setOpenBirthday(false)}
              date={moment(userDetail.birthday, 'DD-MM-yyyy').toDate()}
              onConfirm={onConfirmBirthday}
              saveLabel="Confirm"
              label="Your birthday"
            />
          </View>
        )}
      </Portal>
    </React.Fragment>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    userDetail: selectUserDetail(state),
  };
};

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      ...userSlice.actions,
    },
    dispatch
  );
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({
  key: userSlice.name,
  reducer: userSlice.reducer,
});

export default compose(
  withConnect,
  withReducer
)(ProfileScreen) as React.ComponentType<ComponentProps>;
