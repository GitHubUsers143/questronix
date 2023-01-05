import { View } from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import RNFS from 'react-native-fs';
import Toast from 'react-native-simple-toast';

import DashboardDetails from '../DashboardDetails';
import TimeInOutStyles from '../../../screens/TimeInOut/TimeInOutStyles';
import { debugLogger, logger } from '../../../library/debug';
import postTimeInOut, {
  PositionInterface,
} from '../../../services/api/TimeInOut/PostTimeInOut';
import { DashboardContext } from '../../../context/DashboardProviderContext';
import { Camera } from 'react-native-camera-kit';
import fetchTimeInOutData from '../../../services/api/TimeInOut/FetchTimeInOutData';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { TimeInInterface } from '../../../interfaces/UserDashboardInterface';
import { Button } from 'react-native-elements';
import { COLORS } from '../../../constants/colors';
import { GlobalStyle } from '../../../assets/styles/GlobalStyle';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const TimeIn = () => {
  const camera = useRef<Camera | null>(null);
  const [loading, setLoading] = useState(false);
  const { time_in, coords, setProfileImage } = useContext(DashboardContext);
  const [captureTimer, setCaptureTimer] = useState<any>(3);
  const [capturing, setCapturing] = useState<boolean>(false);
  const [timeInData, setTimeInData] = useState<TimeInInterface | undefined>(
    undefined
  );

  const getTimeInOutData = useCallback(async () => {
    fetchTimeInOutData()
      .then((response) => {
        if (response) {
          if (response.time_inout.timeIn !== 'NA') {
            setProfileImage(response.time_inout.timein_image);
          }
          setTimeInData({
            timeIn: response.time_inout.timeIn,
            in_location: response.time_inout.in_location,
            timein_image: response.time_inout.timein_image,
          });
          setLoading(false);
          setCaptureTimer(3);
        }
      })
      .catch((error) => {
        logger('TimeIn -> getTimeInOutData: error', error);
      });
  }, []);

  const saveTime = (coords: PositionInterface, img: any) => {
    postTimeInOut(true, coords, img)
      .then((response) => {
        if (response.data === 'success') {
          getTimeInOutData();
        }
      })
      .catch((error) => {
        setLoading(false);
        setCaptureTimer(3);
        logger('TimeIn -> saveTime: error', error);
        Toast.showWithGravity(
          `Something went wrong while trying to time in. Try again.`,
          Toast.LONG,
          Toast.BOTTOM
        );
        setLoading(false);
      });
  };

  const onMediaCaptured = async () => {
    if (camera.current !== null) {
      const response = await camera.current.capture();
      if (response) {
        RNFS.readFile(response.uri, 'base64').then((img: any) => {
          saveTime(
            {
              coords: {
                latitude: coords.latitude,
                longitude: coords.longitude,
              },
            },
            img
          );
        });
      }
    }
  };

  useEffect(() => {
    if (loading && capturing) {
      if (captureTimer > 0) {
        setTimeout(() => {
          setCaptureTimer((prevState: number) => prevState - 1);
        }, 1000);
      } else if (captureTimer <= 0) {
        debugLogger(onMediaCaptured, 'TimeIn')();
        setCapturing(false);
        setCaptureTimer('Saving Time In...');
      }
    }
  }, [loading, capturing, captureTimer]);

  return (
    <>
      <View style={TimeInOutStyles.container}>
        <Spinner
          visible={loading}
          textContent={captureTimer.toString()}
          textStyle={TimeInOutStyles.spinnerText}
          color={'transparent'}
        />
        <DashboardDetails time_in={timeInData} camera={camera} timeIn />
        <View style={[GlobalStyle.buttonContainer]}>
          <Button
            onPress={() => {
              setLoading(true);
              setCapturing(true);
            }}
            title={
              time_in?.timeIn !== 'NA' || timeInData !== undefined
                ? 'Re-take'
                : 'Time In'
            }
            buttonStyle={[
              GlobalStyle.buttonStyle,
              {
                backgroundColor:
                  time_in?.timeIn !== 'NA' || timeInData !== undefined
                    ? COLORS.GRAY
                    : COLORS.ROYALBLUE,
              },
            ]}
            containerStyle={[
              GlobalStyle.buttonContainerStyle,
              {
                backgroundColor:
                  time_in?.timeIn !== 'NA' || timeInData !== undefined
                    ? COLORS.GRAY
                    : COLORS.ROYALBLUE,
                width: widthPercentageToDP(75),
              },
            ]}
            titleStyle={[
              GlobalStyle.buttonTitleStyle,
              {
                color: COLORS.WHITE,
              },
            ]}
            disabled={loading}
          />
        </View>
      </View>
    </>
  );
};

export default TimeIn;
