import { Dimensions, StyleSheet } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
const { width, height } = Dimensions.get('screen');
import { COLORS } from '../../constants/colors';
const TimeInOutStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.EBONYCLAY,
  },
  spinnerText: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    position: 'absolute',
    top: heightPercentageToDP(22),
    fontSize: 48,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.EBONYCLAY,
  },
  iconContainer: {
    alignItems: 'flex-end',
    marginRight: widthPercentageToDP(6),
    marginTop: heightPercentageToDP(2.2),
  },
  cameraContainer: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginBottom: heightPercentageToDP(5.0),
    borderRadius: 250 / 2,
    overflow: 'visible',
  },
  camera: {
    borderRadius: 250 / 2,
    height: '100%',
    width: '100%',
    overflow: 'hidden',
  },
  addressTextContainer: {
    alignItems: 'center',
    marginBottom: heightPercentageToDP(2.1),
  },
  addressText: {
    color: COLORS.WHITE,
    fontSize: 19,
  },
  timeTextContainer: {
    alignItems: 'center',
    marginBottom: heightPercentageToDP(2.7),
  },
  timeText: {
    color: COLORS.WHITE,
    fontSize: 59,
  },
  ipAddressTextContainer: {
    alignItems: 'center',
    marginBottom: heightPercentageToDP(5.2),
  },
  ipAddressText: {
    color: COLORS.WHITE,
    fontSize: 12.8,
  },
  buttonTimeInContainer: {
    alignItems: 'center',
  },
  captureButtonIn: {
    backgroundColor: COLORS.ROYALBLUE,
  },
  captureButtonOut: {
    backgroundColor: COLORS.CRAIL,
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    color: COLORS.WHITE,
    opacity: 0.5,
    height: height,
    width: width,
  },
});
export default TimeInOutStyles;
