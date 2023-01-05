import { Platform, TouchableWithoutFeedback, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import TimeInOutStyles from '../../../screens/TimeInOut/TimeInOutStyles';
import { Camera, CameraType } from 'react-native-camera-kit';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { COLORS } from '../../../constants/colors';
import { useIsFocused } from '@react-navigation/native';
import { RNHoleView } from 'react-native-hole-view';

interface CameraPreviewInterface {
  camera: React.MutableRefObject<any>;
  countdown?: number;
}

const CameraPreview: React.FC<CameraPreviewInterface> = ({ camera }) => {
  const [cameraPosition, setCameraPosition] = useState<CameraType>(
    CameraType.Front
  );
  const isFocused = useIsFocused();

  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition((p: string) =>
      p === CameraType.Back ? CameraType.Front : CameraType.Back
    );
  }, []);

  const onSingleTap = useCallback(() => {
    onFlipCameraPressed();
  }, [onFlipCameraPressed]);

  return (
    <View
      style={[
        TimeInOutStyles.cameraContainer,
        {
          borderColor: COLORS.WHITE,
          borderWidth: Platform.OS === 'ios' ? 1 : 0,
        },
      ]}
    >
      {/* README:
       * Please do not remove isFocused. It helps to re-init the camera when changing the tabs.
       */}
      {isFocused && (
        <>
          <Camera
            ref={camera}
            cameraType={cameraPosition}
            style={TimeInOutStyles.camera}
          />
          {Platform.OS !== 'ios' && (
            <RNHoleView
              style={{
                position: 'absolute',
                width: 250,
                height: 250,
                backgroundColor: COLORS.EBONYCLAY,
              }}
              holes={[
                {
                  x: 0,
                  y: 0,
                  width: 250,
                  height: 250,
                  borderRadius: 250 / 2,
                },
              ]}
            />
          )}
        </>
      )}
      <TouchableWithoutFeedback onPress={onSingleTap}>
        <View
          style={{
            position: 'absolute',
            backgroundColor: COLORS.EBONYCLAY,
            bottom: 0,
            left: 220,
          }}
        >
          <FontAwesome5 name={'sync-alt'} color='white' size={30} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default CameraPreview;
