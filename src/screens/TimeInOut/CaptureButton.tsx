import React, { useCallback, useRef } from 'react';
import { StyleSheet, View, ViewProps, Text } from 'react-native';
import { Camera } from 'react-native-camera-kit';
import {
  PanGestureHandler,
  State,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import { cancelAnimation, useSharedValue } from 'react-native-reanimated';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import { COLORS } from '../../constants/colors';
import { SCREEN_WIDTH } from './../../Constants';
import TimeInOutStyles from './TimeInOutStyles';

const PAN_GESTURE_HANDLER_FAIL_X = [-SCREEN_WIDTH, SCREEN_WIDTH];
const PAN_GESTURE_HANDLER_ACTIVE_Y = [-2, 2];

const START_RECORDING_DELAY = 200;
interface Props extends ViewProps {
  camera: React.MutableRefObject<Camera>;
  onMediaCaptured: (media: any) => void;
  timeInOut: boolean;
  flash: 'off' | 'on';
  enabled: boolean;
  setIsPressingButton: (isPressingButton: boolean) => void;
}

const _CaptureButton: React.FC<Props> = ({
  camera,
  onMediaCaptured,
  timeInOut,
  flash,
  enabled,
  setIsPressingButton,
}): React.ReactElement => {
  const pressDownDate = useRef<Date | undefined>(undefined);
  const isRecording = useRef(false);
  const recordingProgress = useSharedValue(0);
  // const takePhotoOptions = useMemo<TakePhotoOptions & TakeSnapshotOptions>(
  //   () => ({
  //     photoCodec: 'jpeg',
  //     qualityPrioritization: 'speed',
  //     flash: flash,
  //     quality: 90,
  //     skipMetadata: true,
  //   }),
  //   [flash]
  // );
  const isPressingButton = useSharedValue(false);

  //#region Camera Capture
  const takePhoto = useCallback(async () => {
    try {
      if (camera.current == null) throw new Error('Camera ref is null!');

      console.log('Taking photo...');
      const photo = await camera.current.capture();
      onMediaCaptured(photo);
    } catch (e) {
      console.error('takePhoto Failed to take photo!', e);
    }
  }, [camera, onMediaCaptured]);

  const onStoppedRecording = useCallback(() => {
    isRecording.current = false;
    cancelAnimation(recordingProgress);
    console.log('stopped recording video!');
  }, [recordingProgress]);
  const stopRecording = useCallback(async () => {
    try {
      if (camera.current == null) throw new Error('Camera ref is null!');

      console.log('calling stopRecording()...');
      await camera.current.stopRecording();
      console.log('called stopRecording()!');
    } catch (e) {
      console.error('stopRecording failed to stop recording!', e);
    }
  }, [camera]);
  const startRecording = useCallback(() => {
    try {
      if (camera.current == null) throw new Error('Camera ref is null!');

      console.log('calling startRecording()...');
      camera.current.startRecording({
        flash: flash,
        onRecordingError: (error: any) => {
          console.error('startRecording Recording failed!', error);
          onStoppedRecording();
        },
        onRecordingFinished: (video: any) => {
          console.log(`Recording successfully finished! ${video.path}`);
          onMediaCaptured(video);
          onStoppedRecording();
        },
      });
      console.log('called startRecording()!');
      isRecording.current = true;
    } catch (e) {
      console.error('startRecording failed to start recording!', e, 'camera');
    }
  }, [camera, flash, onMediaCaptured, onStoppedRecording]);
  const tapHandler = useRef<TapGestureHandler>();
  const onHandlerStateChanged = useCallback(
    async ({ nativeEvent: event }: TapGestureHandlerStateChangeEvent) => {
      console.debug(`state: ${Object.keys(State)[event.state]}`);
      switch (event.state) {
        case State.BEGAN: {
          recordingProgress.value = 0;
          isPressingButton.value = true;
          const now = new Date();
          pressDownDate.current = now;
          setTimeout(() => {
            if (pressDownDate.current === now) {
              // user is still pressing down after 200ms, so his intention is to create a video
              // startRecording();
            }
          }, START_RECORDING_DELAY);
          setIsPressingButton(true);
          return;
        }
        case State.END:
        case State.FAILED:
        case State.CANCELLED: {
          try {
            if (pressDownDate.current == null)
              throw new Error('PressDownDate ref .current was null!');
            const now = new Date();
            const diff = now.getTime() - pressDownDate.current.getTime();
            pressDownDate.current = undefined;
            if (diff < START_RECORDING_DELAY) {
              await takePhoto();
            } else {
              await stopRecording();
            }
          } finally {
            setTimeout(() => {
              isPressingButton.value = false;
              setIsPressingButton(false);
            }, 500);
          }
          return;
        }
        default:
          break;
      }
    },
    [
      isPressingButton,
      recordingProgress,
      setIsPressingButton,
      startRecording,
      stopRecording,
      takePhoto,
    ]
  );
  const panHandler = useRef<PanGestureHandler>();
  return (
    <TapGestureHandler
      enabled={enabled}
      ref={tapHandler}
      onHandlerStateChange={(nativeEvent) => onHandlerStateChanged(nativeEvent)}
      shouldCancelWhenOutside={false}
      maxDurationMs={99999999}
      simultaneousHandlers={panHandler}
    >
      <PanGestureHandler
        ref={panHandler}
        failOffsetX={PAN_GESTURE_HANDLER_FAIL_X}
        activeOffsetY={PAN_GESTURE_HANDLER_ACTIVE_Y}
        simultaneousHandlers={tapHandler}
      >
        <View
          style={[
            styles.view,
            timeInOut
              ? TimeInOutStyles.captureButtonIn
              : TimeInOutStyles.captureButtonOut,
          ]}
        >
          <Text style={styles.text}>{timeInOut ? 'Time In' : 'Time Out'}</Text>
        </View>
      </PanGestureHandler>
    </TapGestureHandler>
  );
};
export const CaptureButton = React.memo(_CaptureButton);
const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    width: widthPercentageToDP(61.5),
    height: heightPercentageToDP(7),
    borderRadius: 14,
  },
  text: {
    textAlign: 'center',
    color: COLORS.WHITE,
    fontSize: 22,
    fontWeight: 'bold',
  },
});
