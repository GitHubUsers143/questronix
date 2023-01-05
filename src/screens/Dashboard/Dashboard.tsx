import { SafeAreaView } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import TimeInOutStyles from '../TimeInOut/TimeInOutStyles';
import TimeIn from '../../layouts/Dashboard/TimeIn/TimeIn';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { COLORS } from '../../constants/colors';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TimeOut from '../../layouts/Dashboard/TimeOut/TimeOut';
import DashboardHeader from '../../layouts/Dashboard/DashboardHeader';
import fetchTimeInOutData from '../../services/api/TimeInOut/FetchTimeInOutData';
import { UserDashboardInterface } from '../../interfaces/UserDashboardInterface';
import { DashboardContext } from '../../context/DashboardProviderContext';
import { logger } from '../../library/debug';
import Geolocation from 'react-native-geolocation-service';
import { getToken } from '../../library/api';
import moment from 'moment-timezone';
import { env } from '../../constants/constants';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { getAddress } from '../../services/api/Dashboard/GetAddress';
// import Timesheet from '../../layouts/Dashboard/Timesheet/Timesheet';
type DashboardTabStackList = {
  TimeIn: undefined;
  TimeOut: undefined;
  Timesheet: undefined;
};
type mainScreenNavigationType = NativeStackNavigationProp<
  MainStackParamList,
  'Login'
>;

export default function Dashboard() {
  const navigation = useNavigation<mainScreenNavigationType>();
  const TabStack = createMaterialTopTabNavigator<DashboardTabStackList>();
  const [profileImg, setProfileImg] = useState('');
  const [userDashboard, setUserDashboard] = useState<UserDashboardInterface>({
    id: undefined,
    time_in: {
      timeIn: 'N/A',
      in_location: 'N/A',
      timein_image: 'N/A',
    },
    time_out: {
      timeOut: 'N/A',
      out_location: 'N/A',
      timeout_image: 'N/A',
    },
    coords: {
      latitude: 0.0,
      longitude: 0.0,
    },
    setProfileImage: () => {},
    address: undefined,
    time: undefined,
  });

  const getTimeInOutData = useCallback(async () => {
    fetchTimeInOutData()
      .then((response) => {
        if (response) {
          if (response.time_inout.timeIn !== 'NA') {
            setProfileImg(response.time_inout.timein_image);
          }
          Geolocation.getCurrentPosition(
            async (position) => {
              const data = await getAddress(
                position.coords.latitude,
                position.coords.longitude
              );
              setUserDashboard((prevState) => ({
                ...prevState,
                id: response.time_inout.details.id,
                time_in: {
                  timeIn: response.time_inout.timeIn,
                  in_location: response.time_inout.in_location,
                  timein_image: response.time_inout.timein_image,
                },
                time_out: {
                  timeOut: response.time_inout.timeOut,
                  out_location: response.time_inout.out_location,
                  timeout_image: response.time_inout.timeout_image,
                },
                coords: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                },
                address: data.address,
              }));
            },
            (error) => {
              setUserDashboard((prevState) => ({
                ...prevState,
                id: response.time_inout.details.id,
                time_in: {
                  timeIn: response.time_inout.timeIn,
                  in_location: response.time_inout.in_location,
                  timein_image: response.time_inout.timein_image,
                },
                time_out: {
                  timeOut: response.time_inout.timeOut,
                  out_location: response.time_inout.out_location,
                  timeout_image: response.time_inout.timeout_image,
                },
              }));
              logger('error', error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        }
      })
      .catch((error) => {
        logger('error', error);
      });
  }, []);

  const getTime = () => {
    const time = moment.tz(env.timezone).format('h:mm a');
    setUserDashboard((prevState) => ({
      ...prevState,
      time: time,
    }));
  };

  useEffect(() => {
    getToken()
      .then((response: any) => {
        if (!response) navigation.navigate('Login');
        getTime();
        getTimeInOutData();

        const timer = setInterval(getTime, 1000 * 30);
        () => {
          clearInterval(timer);
        };
      })
      .catch(() => {
        navigation.navigate('Login');
      });
  }, []);

  return (
    <SafeAreaView style={TimeInOutStyles.root}>
      <Spinner
        visible={false}
        textContent={'Loading...'}
        textStyle={{ color: COLORS.RED }}
      />
      <DashboardHeader profileImg={profileImg} />
      <DashboardContext.Provider
        value={{
          id: userDashboard.id,
          time_in: userDashboard.time_in,
          time_out: userDashboard.time_out,
          coords: {
            latitude: userDashboard?.coords?.latitude,
            longitude: userDashboard?.coords?.longitude,
          },
          setProfileImage: setProfileImg,
          address: userDashboard.address,
          time: userDashboard.time,
        }}
      >
        <TabStack.Navigator
          screenOptions={{
            tabBarActiveTintColor: COLORS.STPATRICKSBLUE,
            tabBarIndicatorStyle: {
              borderBottomColor: COLORS.STPATRICKSBLUE,
            },
          }}
          tabBarPosition='bottom'
        >
          <TabStack.Screen name='TimeIn' component={TimeIn} />
          <TabStack.Screen name='TimeOut' component={TimeOut} />
          {/* <TabStack.Screen name='Timesheet' component={Timesheet} /> */}
        </TabStack.Navigator>
      </DashboardContext.Provider>
    </SafeAreaView>
  );
}
