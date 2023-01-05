import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

const SplashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.EBONYCLAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 400,
    height: 400,
  },
});

export default SplashStyles;
