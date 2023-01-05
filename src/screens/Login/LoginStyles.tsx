import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import { COLORS } from '../../constants/colors';

const LoginStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.EBONYCLAY,
    justifyContent: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginTextContainer: {
    paddingBottom: heightPercentageToDP(4.8),
  },
  loginText: {
    textAlign: 'center',
    color: COLORS.WHITE,
    fontSize: 18.8,
    fontWeight: 'bold',
  },
  loginFormContainer: { width: widthPercentageToDP(88) },
  inputContainer: {
    paddingBottom: heightPercentageToDP(2.8),
  },
  containerStyle: {
    backgroundColor: COLORS.WHITE,
    height: heightPercentageToDP(7),
    borderRadius: 14,
  },
  inputContainerStyle: {
    borderBottomWidth: 0,
    height: heightPercentageToDP(7),
    paddingLeft: widthPercentageToDP(3.5),
    paddingRight: widthPercentageToDP(3.5),
  },
  inputStyle: {
    fontSize: 18.9,
  },
  errorInput: {
    padding: heightPercentageToDP(1),
    fontSize: 10,
    color: COLORS.RED,
  },
  buttonContainer: {
    paddingTop: heightPercentageToDP(0.7),
  },
  buttonStyle: {
    backgroundColor: COLORS.ROYALBLUE,
    height: heightPercentageToDP(7),
  },
  buttonContainerStyle: {
    borderRadius: 14,
  },
  buttonTitleStyle: {
    fontWeight: 'bold',
    fontSize: 18.8,
  },
  headerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    margin: 0,
  },
  headerLogo: {
    width: 250,
    height: 150,
    alignSelf: 'center',
    margin: 0,
    padding: 0,
  },
  headerLogoText: {
    textAlign: 'center',
    color: COLORS.WHITE,
    fontSize: 40,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    margin: 0,
    padding: 0,
  },
  googleButtonStyle: {
    marginTop: heightPercentageToDP(0.7),
    width: widthPercentageToDP(88),
  },
});

export default LoginStyles;
