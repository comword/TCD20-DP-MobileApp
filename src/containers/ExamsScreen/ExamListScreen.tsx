import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AppScreens } from 'navigators/ScreenDefs';
import PendingExam from './PendingExam';
import PastExam from './PastExam';
import { useTheme } from 'react-native-paper';

const ExamListScreen: React.FC = () => {
  const theme = useTheme();
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName={AppScreens.PendingExams}
      tabBarOptions={{
        style: { backgroundColor: theme.colors.surface },
      }}
    >
      <Tab.Screen name={AppScreens.PendingExams} component={PendingExam} />
      <Tab.Screen name={AppScreens.PastExams} component={PastExam} />
    </Tab.Navigator>
  );
};

export default ExamListScreen;
