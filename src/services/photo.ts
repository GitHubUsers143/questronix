import { useMemo } from 'react';
import {
  Camera,
  TakePhotoOptions,
  TakeSnapshotOptions,
} from 'react-native-vision-camera';

const takePhotoOptions = useMemo<TakePhotoOptions & TakeSnapshotOptions>(
  () => ({
    photoCodec: 'jpeg',
    qualityPrioritization: 'speed',
    flash: 'off',
    quality: 90,
    skipMetadata: true,
  }),
  []
);

export const takePhoto = async (camera: React.MutableRefObject<Camera>) => {
  if (camera.current == null) return Promise.reject('Camera ref is null!');
  return camera.current
    .takePhoto(takePhotoOptions)
    .then((response) => Promise.resolve(response))
    .catch((error) => Promise.reject(error));
};
