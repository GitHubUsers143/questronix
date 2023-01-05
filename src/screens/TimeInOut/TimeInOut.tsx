// README
// Split Components / CDD
// Will have to recreate this into a 1 module 2 components build
// Dashboard > Time In and Time Out
// This is to properly show both pages and details
// Readability and Scalability too.
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  Platform,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Geolocation from 'react-native-geolocation-service';
import fetchTimeInOutData from '../../services/api/TimeInOut/FetchTimeInOutData';
import postTimeInOut from '../../services/api/TimeInOut/PostTimeInOut';
import TimeInOutStyles from './TimeInOutStyles';
import Reanimated, { useSharedValue } from 'react-native-reanimated';
// import { useIsFocused } from '@react-navigation/core';
// import { useIsForeground } from './../../hooks/useIsForeground';
import { CaptureButton } from './CaptureButton';
import RNFS from 'react-native-fs';
import Spinner from 'react-native-loading-spinner-overlay';
import { COLORS } from '../../constants/colors';
import fetchTimesheet from '../../services/api/timesheet/fetchTimesheet';
import Toast from 'react-native-simple-toast';
import moment from 'moment-timezone';
import { getToken, httpRequest } from '../../library/api';
import { logger } from '../../library/debug';
import { RNHoleView } from 'react-native-hole-view';
import { env } from '../../constants/constants';
import { Camera, CameraType } from 'react-native-camera-kit';

type mainScreenNavigationType = NativeStackNavigationProp<
  MainStackParamList,
  'Login',
  'Profile'
>;
interface UserDashboardInterface {
  time_inout: {
    timeIn: string;
    timeOut: string;
    in_location: string;
    out_location: string;
    timein_image: string;
    timeout_image: string;
  };
  details: {
    id: string | undefined;
    name: string | undefined;
    email: string | undefined;
  };
  ip: string;
}

interface PositionInterface {
  coords: {
    latitude: number;
    longitude: number;
  };
}
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

let lastPress = 0;

const TimeInOut = () => {
  const navigation = useNavigation<mainScreenNavigationType>();
  const [defaultTime, setDefaultTime] = useState<String>('Loading Time...');
  const [defaultAddress, setDefaultAddress] =
    useState<String>('Loading Address...');
  const [userDashboard, setUserDashboard] = useState<UserDashboardInterface>({
    time_inout: {
      timeIn: 'N/A',
      timeOut: 'N/A',
      in_location: 'N/A',
      out_location: 'N/A',
      timein_image: 'N/A',
      timeout_image: 'N/A',
    },
    details: {
      id: undefined,
      name: undefined,
      email: undefined,
    },
    ip: 'N/A',
  });
  const [timeInOut, setTimeInOut] = useState<boolean>(true);
  const [enableCapture, setEnableCapture] = useState<boolean>(true);
  const [profileImg, setProfileImg] = useState<string>('');
  const [cameraPosition, setCameraPosition] = useState<CameraType>(
    CameraType.Front
  );
  const [capture, setCapture] = useState<boolean>(true);
  const camera = useRef<Camera>(null);

  const icon = <FontAwesome5 name={'user-circle'} color='white' size={36} />;
  const cameraFlipIcon = (
    <FontAwesome5 name={'sync-alt'} color='white' size={30} />
  );

  const getTimeInOutData = useCallback(async () => {
    fetchTimeInOutData()
      .then((response) => {
        if (response) {
          setUserDashboard((prevState) => ({
            ...prevState,
            time_inout: {
              timeIn: response.time_inout.timeIn,
              timeOut: response.time_inout.timeOut,
              in_location: response.time_inout.in_location,
              out_location: response.time_inout.out_location,
              timein_image: response.time_inout.timein_image,
              timeout_image: response.time_inout.timeout_image,
            },
            details: {
              id: response.time_inout.details.id,
              name: response.time_inout.details.full_name,
              email: response.time_inout.details.email_work,
            },
            ip: response.ip,
          }));
          if (response.time_inout.timeIn !== 'NA') {
            setTimeInOut((prevState) => !prevState);
            setProfileImg(response.time_inout.timein_image);
          }
        }
      })
      .catch((error) => {
        console.log('[DEBUG] error', error);
      });
  }, []);

  const _postTimeInOut = useCallback(
    async (
      position: PositionInterface,
      img: string,
      time_in: boolean = true
    ) => {
      setEnableCapture(false);
      postTimeInOut(time_in, position, img)
        .then((response) => {
          setProfileImg(response.timein_image);
          setEnableCapture(true);
          if (timeInOut === true) {
            setTimeInOut((prevState) => !prevState);
          }
          if (
            response.data === 'success' &&
            response.action === 'time-out' &&
            response.done_timeout
          )
            setCapture(false);
        })
        .catch((error) => {
          logger('error', error);
          Toast.showWithGravity(
            `Something went wrong while trying to time ${
              timeInOut ? 'in' : 'out'
            }. Try again.`,
            Toast.LONG,
            Toast.BOTTOM
          );
          setEnableCapture(true);
        });
    },
    []
  );

  const _timeInOut = (imagePath: string, time_in: boolean = true) => {
    Geolocation.getCurrentPosition(
      (position) => {
        if (imagePath !== '') {
          RNFS.readFile(imagePath, 'base64').then((img) => {
            _postTimeInOut(position, img, time_in);
          });
        } else {
          getDefaultDashboard(position);
        }
      },
      (error) => {
        console.log('[DEBUG] error', error.message);
      },
      Platform.OS === 'ios'
        ? { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
        : {}
    );
  };

  const checkToken = useCallback(async () => {
    const response = await getToken();
    if (response) _timeInOut('');
    else navigation.navigate('Login');
  }, []);

  const getAddress = async (lat: number, long: number) => {
    return await httpRequest({
      url: 'v1/time-inout/get-geo-address',
      method: 'POST',
      data: {
        api: true,
        location: {
          lat: lat,
          lng: long,
        },
      },
    })
      .then((response) => {
        return Promise.resolve(response);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };

  const getDefaultTime = async () => {
    const time = moment().tz(env.timezone).format('h:mm a');
    setDefaultTime(time);
  };

  const getDefaultDashboard = async (position: PositionInterface) => {
    getDefaultTime();
    setEnableCapture(false);
    await getAddress(position.coords.latitude, position.coords.longitude)
      .then(async (response) => {
        setDefaultAddress(response.address);
        setEnableCapture(true);
      })
      .catch((error) => {
        logger('error', error);
        setDefaultAddress('Address Not Found!');
        setEnableCapture(true);
      });
    setInterval(getDefaultTime, 1000 * 60);
  };

  useEffect(() => {
    getTimeInOutData();
    checkToken();
  }, []);

  // const devices = useCameraDevices();
  // const device = devices[cameraPosition];
  // const formats = useMemo<CameraDeviceFormat[]>(() => {
  //   if (device?.formats == null) return [];
  //   return device.formats.sort(sortFormats);
  // }, [device?.formats]);
  // const enableHdr = false;
  // const is60Fps = true;
  // const enableNightMode = false;
  // const isFocussed = useIsFocused();
  // const isForeground = useIsForeground();
  // const isActive = isFocussed && isForeground;
  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition((p) =>
      p === CameraType.Front ? CameraType.Back : CameraType.Front
    );
  }, []);
  const isPressingButton = useSharedValue(false);
  const onSingleTap = useCallback(() => {
    onFlipCameraPressed();
  }, [onFlipCameraPressed]);
  const onDoubleTap = useCallback(() => {
    const time = new Date().getTime();
    const delta = time - lastPress;
    const DOUBLE_PRESS_DELAY = 400;
    if (delta < DOUBLE_PRESS_DELAY) {
      onFlipCameraPressed();
    }
    lastPress = time;
  }, [onFlipCameraPressed]);
  // const fps = useMemo(() => {
  //   if (!is60Fps) return 30;
  //   if (enableNightMode && !device?.supportsLowLightBoost) {
  //     return 30;
  //   }
  //   const supportsHdrAt60Fps = formats.some(
  //     (f) =>
  //       f.supportsVideoHDR &&
  //       f.frameRateRanges.some((r) => frameRateIncluded(r, 60))
  //   );
  //   if (enableHdr && !supportsHdrAt60Fps) {
  //     return 30;
  //   }
  //   const supports60Fps = formats.some((f) =>
  //     f.frameRateRanges.some((r) => frameRateIncluded(r, 60))
  //   );
  //   if (!supports60Fps) {
  //     return 30;
  //   }
  //   return 60;
  // }, [
  //   device?.supportsLowLightBoost,
  //   enableHdr,
  //   enableNightMode,
  //   formats,
  //   is60Fps,
  // ]);
  // const format = useMemo(() => {
  //   let result = formats;
  //   if (enableHdr) {
  //     result = result.filter((f) => f.supportsVideoHDR || f.supportsPhotoHDR);
  //   }
  //   return result.find((f) =>
  //     f.frameRateRanges.some((r) => frameRateIncluded(r, fps))
  //   );
  // }, [formats, fps, enableHdr]);
  // const onInitialized = useCallback(() => {
  //   console.log('Camera initialized!');
  // }, []);
  // const onError = useCallback((error: CameraRuntimeError) => {
  //   console.error(error);
  // }, []);
  const _fetchTimesheet = useCallback(
    async (mediaPath: any, time_in: boolean) => {
      const response = await fetchTimesheet(
        userDashboard.details.id ? userDashboard.details.id : ''
      );
      if (response) {
        if (
          response.today_total_hours.hours === null ||
          response.today_total_hours.hours < 8
        )
          Toast.showWithGravity(
            'Please complete your timesheet!',
            Toast.LONG,
            Toast.TOP
          );
        else {
          _timeInOut(mediaPath, time_in);
        }
      }
    },
    []
  );
  const onMediaCaptured = useCallback(
    (media: any) => {
      if (!timeInOut) {
        _fetchTimesheet(media.uri, timeInOut);
      } else {
        _timeInOut(media.uri);
      }
    },
    [_timeInOut]
  );
  const setIsPressingButton = useCallback(
    (_isPressingButton: boolean) => {
      isPressingButton.value = _isPressingButton;
    },
    [isPressingButton]
  );
  return (
    <SafeAreaView style={TimeInOutStyles.root}>
      <Spinner
        visible={!enableCapture}
        textContent={'Loading...'}
        textStyle={TimeInOutStyles.spinnerText}
        color={'transparent'}
      />
      <View style={TimeInOutStyles.container}>
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate('Profile', {
              profileImg: profileImg,
              name: userDashboard.details.name,
              email: userDashboard.details.email,
            })
          }
        >
          <View style={TimeInOutStyles.iconContainer}>
            {profileImg === '' ? (
              icon
            ) : (
              <Image
                source={{
                  uri: profileImg,
                }}
                style={{ width: 36, height: 36, borderRadius: 36 / 2 }}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
        {/* {device != null && ( */}
        <View style={TimeInOutStyles.cameraContainer}>
          <TouchableWithoutFeedback onPress={onDoubleTap}>
            <Camera
              ref={camera}
              cameraType={cameraPosition}
              style={TimeInOutStyles.camera}
            />
            {/* <ReanimatedCamera
              ref={camera}
              style={[StyleSheet.absoluteFill, TimeInOutStyles.camera]}
              device={device}
              format={format}
              fps={fps}
              isActive={isActive}
              onInitialized={onInitialized}
              onError={onError}
              photo={true}
              orientation='portrait'
            /> */}
          </TouchableWithoutFeedback>
          {Platform.OS !== 'ios' && (
            <RNHoleView
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: COLORS.EBONYCLAY,
              }}
              holes={[
                {
                  x: 0,
                  y: 0,
                  width: 250,
                  height: 250,
                  borderRadius: 250 / 2,
                },
              ]}
            ></RNHoleView>
          )}
          <TouchableWithoutFeedback onPress={onSingleTap}>
            <View
              style={{
                position: 'absolute',
                backgroundColor: COLORS.EBONYCLAY,
                bottom: 0,
                left: 220,
              }}
            >
              {cameraFlipIcon}
            </View>
          </TouchableWithoutFeedback>
        </View>
        {/* )} */}
        <View style={TimeInOutStyles.addressTextContainer}>
          <Text style={TimeInOutStyles.addressText}>
            {/* {userDashboard.time_inout.in_location !== 'No Address'
              ? userDashboard.time_inout.in_location
              : userDashboard.time_inout.out_location !== 'No Address'
              ? userDashboard.time_inout.out_location
              : dashboardDefault.address} */}
            {defaultAddress}
          </Text>
        </View>
        <View style={TimeInOutStyles.timeTextContainer}>
          <Text style={TimeInOutStyles.timeText}>
            {/* {userDashboard.time_inout.timeOut !== 'NA'
              ? userDashboard.time_inout.timeOut
              : userDashboard.time_inout.timeIn !== 'NA'
              ? userDashboard.time_inout.timeIn
              : dashboardDefault.time} */}
            {defaultTime}
          </Text>
        </View>
        <View style={TimeInOutStyles.buttonTimeInContainer}>
          <CaptureButton
            camera={camera}
            onMediaCaptured={onMediaCaptured}
            setIsPressingButton={setIsPressingButton}
            timeInOut={timeInOut}
            flash={'off'}
            enabled={capture}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TimeInOut;
