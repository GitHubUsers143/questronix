import { Image, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { useNavigation } from '@react-navigation/native';
import fetchProfileData from '../../services/api/profile/fetchProfileData';
import { logger } from '../../library/debug';
import TimeInOutStyles from '../../screens/TimeInOut/TimeInOutStyles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { COLORS } from '../../constants/colors';
type mainScreenNavigationType = NativeStackNavigationProp<
  MainStackParamList,
  'Login',
  'Profile'
>;

interface DashboardHeaderInterface {
  profileImg: string;
}

interface DashboardHeaderProfileInterface {
  name: string | undefined;
  email: string | undefined;
}

const DashboardHeader: React.FC<DashboardHeaderInterface> = ({
  profileImg,
}) => {
  const navigation = useNavigation<mainScreenNavigationType>();
  const [profile, setProfile] = useState<DashboardHeaderProfileInterface>({
    name: undefined,
    email: undefined,
  });

  const getProfileData = () => {
    fetchProfileData()
      .then((response) => {
        setProfile((prevState) => ({
          ...prevState,
          name: response.name,
          email: response.email,
        }));
      })
      .catch((error) => {
        logger('Dashboard -> DashboardHeader -> getProfileData: error', error);
      });
  };

  useEffect(() => {
    getProfileData();
  }, []);
  return (
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate('Profile', {
          profileImg: profileImg,
          name: profile.name,
          email: profile.email,
        })
      }
    >
      <View style={TimeInOutStyles.iconContainer}>
        {profileImg === '' ? (
          <FontAwesome5 name={'user-circle'} color='white' size={32} />
        ) : (
          <Image
            source={{
              uri: profileImg,
            }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 32 / 2,
              borderColor: COLORS.WHITE,
              borderWidth: 1,
            }}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default DashboardHeader;
