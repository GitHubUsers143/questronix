import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from '../screens/Splash/Splash';
import Login from '../screens/Login/Login';
import TimeInOut from '../screens/TimeInOut/TimeInOut';
import Profile from '../screens/Profile/Profile';
import Dashboard from '../screens/Dashboard/Dashboard';
import Timesheet from '../screens/Timesheet/Timesheet';

export type MainStackParamList = {
  Splash: undefined;
  Login: undefined;
  TimeInOut: undefined;
  Dashboard: undefined;
  Profile: {
    profileImg: string;
    name: string | undefined;
    email: string | undefined;
  };
  Timesheet: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
        initialRouteName='Splash'
      >
        <Stack.Screen
          name='Splash'
          component={Splash}
          options={{ title: 'Splash' }}
        />
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='TimeInOut' component={TimeInOut} />
        <Stack.Screen name='Dashboard' component={Dashboard} />
        <Stack.Screen name='Profile' component={Profile} />
        <Stack.Screen name='Timesheet' component={Timesheet} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
