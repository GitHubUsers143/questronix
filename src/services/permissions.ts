// README
// Separating this file for one reason readability and quick scalability

import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';

export const requestPermissions = async () => {
  const os = Platform.OS;

  if (os === 'android') {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
    );
  }

  if (os === 'ios') {
    Geolocation.requestAuthorization('whenInUse');
  }
};
