import { getToken } from '../../library/api';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { SafeAreaView, Image } from 'react-native';
import SplashStyles from './SplashStyles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { GlobalContext } from '../../context/GlobalProviderContext';
import { requestPermissions } from '../../services/permissions';
import { debugLogger, logger } from '../../library/debug';

type mainScreenNavigationType = NativeStackNavigationProp<
  MainStackParamList,
  'Login',
  'Dashboard'
>;
const SplashScreen = () => {
  const navigation = useNavigation<mainScreenNavigationType>();

  const splash = async () => {
    const response = await debugLogger(getToken, 'Splash')();

    if (response) navigation.navigate('Dashboard');
    else navigation.navigate('Login');
  };

  useEffect(() => {
    debugLogger(requestPermissions, 'Splash')();

    setTimeout(() => {
      splash();
    }, 5000);
  }, [navigation]);

  return (
    <SafeAreaView style={SplashStyles.container}>
      <GlobalContext.Consumer>
        {(context) =>
          context.logo && (
            <Image
              style={SplashStyles.logo}
              source={{
                uri: context.logo,
              }}
              onError={(error) => {
                logger('error', error);
              }}
            />
          )
        }
      </GlobalContext.Consumer>
    </SafeAreaView>
  );
};

export default SplashScreen;
