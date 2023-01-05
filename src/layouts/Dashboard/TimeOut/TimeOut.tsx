import { View } from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import TimeInOutStyles from '../../../screens/TimeInOut/TimeInOutStyles';
import { Camera } from 'react-native-camera-kit';
import DashboardDetails from '../DashboardDetails';
import { DashboardContext } from '../../../context/DashboardProviderContext';
import { COLORS } from '../../../constants/colors';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import postTimeInOut, {
  PositionInterface,
} from '../../../services/api/TimeInOut/PostTimeInOut';
import fetchTimeInOutData from '../../../services/api/TimeInOut/FetchTimeInOutData';
import { debugLogger, logger } from '../../../library/debug';
import Toast from 'react-native-simple-toast';
import RNFS from 'react-native-fs';
import fetchTimesheet from '../../../services/api/timesheet/fetchTimesheet';
import { TimeOutInterface } from '../../../interfaces/UserDashboardInterface';
import { Button } from 'react-native-elements';
import { GlobalStyle } from '../../../assets/styles/GlobalStyle';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const TimeOut = () => {
  const camera = useRef<Camera>(null);
  const [loading, setLoading] = useState(false);
  const [captureTimer, setCaptureTimer] = useState<any>(3);
  const [capturing, setCapturing] = useState<boolean>(false);
  const { coords } = useContext(DashboardContext);
  const [timeOutData, setTimeOutData] = useState<TimeOutInterface | undefined>(
    undefined
  );
  const { time_out, id } = useContext(DashboardContext);

  const getTimeInOutData = useCallback(async () => {
    fetchTimeInOutData()
      .then((response) => {
        if (response) {
          setTimeOutData({
            timeOut: response.time_inout.timeOut,
            out_location: response.time_inout.out_location,
          });
          setLoading(false);
          setCaptureTimer(3);
        }
      })
      .catch((error) => {
        logger('TimeOut -> getTimeInOutData: error', error);
      });
  }, []);

  const saveTime = (coords: PositionInterface, img: any) => {
    postTimeInOut(false, coords, img)
      .then((response) => {
        if (response.data === 'success') {
          getTimeInOutData();
        }
      })
      .catch((error) => {
        setLoading(false);
        setCaptureTimer(3);
        logger('TimeOut -> saveTime: error', error);
        Toast.showWithGravity(
          `Something went wrong while trying to time out. Try again.`,
          Toast.LONG,
          Toast.BOTTOM
        );
      });
  };

  const onMediaCaptured = () => {
    if (camera.current == null) return Promise.reject('Camera ref is null!');
    camera.current
      .capture()
      .then((response: any) => {
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
      })
      .catch((error: any) => {
        logger('TimeIn -> onMediaCaptured: error', error);
        setLoading(false);
      });
  };

  const getTimeSheet = async () => {
    fetchTimesheet(id ? id : '')
      .then((response) => {
        if (
          response.today_total_hours.hours === null ||
          response.today_total_hours.hours < 8
        ) {
          Toast.showWithGravity(
            'Please complete your timesheet!',
            Toast.LONG,
            Toast.TOP
          );
        } else {
          setLoading(true);
          setCapturing(true);
        }
      })
      .catch((error) => {
        logger('TimeOut -> getTimeSheet', error);
      });
  };

  useEffect(() => {
    if (loading && capturing) {
      if (captureTimer > 0) {
        setTimeout(() => {
          setCaptureTimer((prevState: number) => prevState - 1);
        }, 1000);
      } else if (captureTimer <= 0) {
        debugLogger(onMediaCaptured, 'TimeOut')();
        setCapturing(false);
        setCaptureTimer('Saving Time Out...');
      }
    }
  }, [loading, capturing, captureTimer]);
  return (
    <>
      <View style={TimeInOutStyles.container}>
        <Spinner
          visible={loading}
          textContent={captureTimer}
          textStyle={TimeInOutStyles.spinnerText}
          color={'transparent'}
        />
        <DashboardDetails time_out={timeOutData} camera={camera} />
        <View style={GlobalStyle.buttonContainer}>
          <Button
            onPress={getTimeSheet}
            title={
              time_out?.timeOut !== 'NA' || timeOutData !== undefined
                ? 'Re-take'
                : 'Time Out'
            }
            buttonStyle={[
              GlobalStyle.buttonStyle,
              {
                backgroundColor:
                  time_out?.timeOut !== 'NA' || timeOutData !== undefined
                    ? COLORS.GRAY
                    : COLORS.CRAIL,
              },
            ]}
            containerStyle={[
              GlobalStyle.buttonContainerStyle,
              {
                backgroundColor:
                  time_out?.timeOut !== 'NA' || timeOutData !== undefined
                    ? COLORS.GRAY
                    : COLORS.CRAIL,
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

export default TimeOut;
