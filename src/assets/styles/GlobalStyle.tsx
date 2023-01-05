import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

export const GlobalStyle = StyleSheet.create({
  buttonContainer: {
    width: widthPercentageToDP(100),
    paddingTop: heightPercentageToDP(0.7),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    height: heightPercentageToDP(7),
  },
  buttonContainerStyle: {
    borderRadius: 14,
  },
  buttonTitleStyle: {
    fontWeight: 'bold',
    fontSize: 18.8,
  },
});
