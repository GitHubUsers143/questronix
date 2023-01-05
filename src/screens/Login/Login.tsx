import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, View, Image, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import loginService from '../../services/api/Authentication/LoginService';
import LoginStyles from './LoginStyles';
import StatusModal from '../../components/Login/StatusModal';
import {
  failButtonText,
  failDescription,
  failMessage,
} from '../../constants/loginFailMessages';
import { GlobalContext } from '../../context/GlobalProviderContext';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import { GlobalStyle } from '../../assets/styles/GlobalStyle';
import { COLORS } from '../../constants/colors';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { loginValidationSchema } from '../../interfaces/LoginValidationSchema';
import { debugLogger } from '../../library/debug';
import { useToggle } from '../../hooks/useToggle';

interface LogInInterface {
  email: string;
  password: string;
}

interface GoogleSignInInterface {
  id: string;
  email: string;
  name: string | null;
  token: string | null;
}

const LoginScreen = ({ navigation }: any) => {
  const [showFail, setShowFail] = useState(false);
  const [logging, setLogging] = useToggle();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<LogInInterface>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
    resolver: yupResolver(loginValidationSchema),
  });

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '356313555814-7o4lrbe4tg2hlhl2eb9fi1rc1s059hgg.apps.googleusercontent.com',
      iosClientId:
        '356313555814-rl2gr45kpl150g084am5uqoghsk074ng.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  const login = async (data: LogInInterface) => {
    setLogging();
    const response = await debugLogger(
      loginService.loginService,
      'Login'
    )(data);
    if (response) {
      navigation.replace('Dashboard');
    } else {
      setShowFail(true);
      setLogging();
    }
  };

  const onSubmit = (data: LogInInterface) => login(data);

  const googleSignIn = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      let data: GoogleSignInInterface = {
        id: userInfo.user.id,
        email: userInfo.user.email,
        name: userInfo.user.name,
        token: userInfo.idToken,
      };
      setLogging();
      const response = await debugLogger(
        loginService.googleSignInService,
        'Login'
      )(data);
      if (response) {
        navigation.replace('Dashboard');
      } else {
        setShowFail(true);
        setLogging();
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <SafeAreaView style={LoginStyles.root}>
      <View style={LoginStyles.container}>
        <StatusModal
          showing={showFail}
          setShowing={setShowFail}
          message={failMessage}
          description={failDescription}
          buttonText={failButtonText}
        />
        <View style={LoginStyles.headerContainer}>
          <GlobalContext.Consumer>
            {(context) =>
              context.logo && (
                <>
                  <Image
                    style={LoginStyles.headerLogo}
                    source={{
                      uri: context.logo,
                    }}
                  />
                  <Text style={LoginStyles.headerLogoText}>
                    {context.appName}
                  </Text>
                </>
              )
            }
          </GlobalContext.Consumer>
        </View>
        <View style={LoginStyles.loginTextContainer}>
          <Text style={LoginStyles.loginText}>LOG IN</Text>
        </View>
        <View style={LoginStyles.loginFormContainer}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={LoginStyles.inputContainer}>
                <Input
                  testID='email-input'
                  placeholder='Email'
                  containerStyle={LoginStyles.containerStyle}
                  inputContainerStyle={LoginStyles.inputContainerStyle}
                  inputStyle={LoginStyles.inputStyle}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  keyboardType='email-address'
                  autoCompleteType={undefined}
                />
              </View>
            )}
            name='email'
          />
          {errors.email && (
            <Text testID='email-error' style={LoginStyles.errorInput}>
              {errors.email?.message}
            </Text>
          )}
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={LoginStyles.inputContainer}>
                <Input
                  testID='password-input'
                  placeholder='Password'
                  containerStyle={LoginStyles.containerStyle}
                  inputContainerStyle={LoginStyles.inputContainerStyle}
                  inputStyle={LoginStyles.inputStyle}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  secureTextEntry
                  autoCompleteType={undefined}
                />
              </View>
            )}
            name='password'
          />
          {errors.password && (
            <Text testID='password-error' style={LoginStyles.errorInput}>
              {errors.password?.message}
            </Text>
          )}
          <View style={LoginStyles.buttonContainer}>
            <Button
              testID='login-button'
              onPress={handleSubmit(onSubmit)}
              title='Login'
              buttonStyle={[
                GlobalStyle.buttonStyle,
                {
                  backgroundColor: COLORS.ROYALBLUE,
                },
              ]}
              containerStyle={[
                GlobalStyle.buttonContainerStyle,
                {
                  width: widthPercentageToDP(88),
                },
              ]}
              titleStyle={GlobalStyle.buttonTitleStyle}
              disabled={!isDirty || !isValid || logging}
            />
            <GoogleSigninButton
              style={LoginStyles.googleButtonStyle}
              color={GoogleSigninButton.Color.Dark}
              size={GoogleSigninButton.Size.Wide}
              onPress={googleSignIn}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
