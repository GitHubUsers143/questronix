import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import { COLORS } from '../../constants/colors';
const DashboardStyles = StyleSheet.create({
  addressTextContainer: {
    alignSelf: 'center',
    marginBottom: heightPercentageToDP(2.1),
    width: widthPercentageToDP(85),
  },
  addressText: {
    color: COLORS.WHITE,
    fontSize: 19,
    textAlign: 'justify',
  },
  timeTextContainer: {
    alignSelf: 'center',
    marginBottom: heightPercentageToDP(2.7),
    width: widthPercentageToDP(85),
  },
  timeText: {
    color: COLORS.WHITE,
    fontSize: 59,
    textAlign: 'center',
  },
});
export default DashboardStyles;
