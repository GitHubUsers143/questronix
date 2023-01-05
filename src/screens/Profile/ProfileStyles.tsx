import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import { COLORS } from '../../constants/colors';

const ProfileStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.EBONYCLAY,
  },
  container: {
    flext: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonContainer: {
    maxWidth: widthPercentageToDP(15),
  },
  backButton: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft: widthPercentageToDP(6),
    paddingTop: heightPercentageToDP(2.2),
  },
  iconContainer: {
    marginTop: heightPercentageToDP(9.5),
    marginBottom: heightPercentageToDP(4.2),
  },
  nameContainer: {
    marginBottom: heightPercentageToDP(0.9),
  },
  nameText: {
    fontSize: 22,
    color: COLORS.WHITE,
  },
  emailContainer: {
    paddingBottom: heightPercentageToDP(7.0),
  },
  emailText: {
    fontSize: 19,
    color: COLORS.WHITE,
  },
});

export default ProfileStyles;
