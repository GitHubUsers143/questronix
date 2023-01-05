import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { removeInterceptor } from '../../library/api';
import React, { useCallback } from 'react';
import { SafeAreaView, View, Text, Image } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ProfileStyles from './ProfileStyles';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { COLORS } from '../../constants/colors';
import { Button } from 'react-native-elements';
import { GlobalStyle } from '../../assets/styles/GlobalStyle';
import { widthPercentageToDP } from 'react-native-responsive-screen';

type mainScreenNavigationType = NativeStackNavigationProp<
  MainStackParamList,
  'Login'
>;
type profileScreenRouteType = RouteProp<MainStackParamList, 'Profile'>;
const ProfileScreen = () => {
  const navigation = useNavigation<mainScreenNavigationType>();
  const { email, name, profileImg } = useRoute<profileScreenRouteType>().params;

  const logout = useCallback(async () => {
    try {
      removeInterceptor();
      const isGoogleSignIn = await GoogleSignin.isSignedIn();
      if (isGoogleSignIn) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
      navigation.navigate('Login');
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <SafeAreaView style={ProfileStyles.root}>
      <View style={ProfileStyles.backButtonContainer}>
        <TouchableWithoutFeedback
          style={ProfileStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name={'chevron-left'} color='white' size={32} />
        </TouchableWithoutFeedback>
      </View>
      <View style={ProfileStyles.container}>
        <View style={ProfileStyles.iconContainer}>
          {profileImg === '' ? (
            <FontAwesome5 name={'user-circle'} color='white' size={250} />
          ) : (
            <Image
              source={{
                uri: profileImg,
              }}
              style={{
                width: 250,
                height: 250,
                borderRadius: 250 / 2,
                borderColor: COLORS.WHITE,
                borderWidth: 1,
              }}
            />
          )}
        </View>
        <View style={ProfileStyles.nameContainer}>
          <Text style={ProfileStyles.nameText}>{name}</Text>
        </View>
        <View style={ProfileStyles.emailContainer}>
          <Text style={ProfileStyles.emailText}>{email}</Text>
        </View>
        <View style={GlobalStyle.buttonContainer}>
          <Button
            title='Logout'
            buttonStyle={[
              GlobalStyle.buttonStyle,
              { backgroundColor: COLORS.STPATRICKSBLUE },
            ]}
            containerStyle={[
              GlobalStyle.buttonContainerStyle,
              {
                width: widthPercentageToDP(75),
              },
            ]}
            titleStyle={GlobalStyle.buttonTitleStyle}
            style={{ backgroundColor: COLORS.STPATRICKSBLUE }}
            onPress={logout}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
