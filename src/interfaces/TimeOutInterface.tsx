import { PhotoFile, VideoFile } from 'react-native-vision-camera';

export interface TimeOutInterface {
  _default:
    | {
        time: string;
        address: string;
        ipAddress: string;
      }
    | undefined;
  onMediaCaptured: (media: PhotoFile | VideoFile) => void;
  setIsPressingButton: (_isPressingButton: boolean) => void;
  enableCapture: boolean;
  timeOutDetails:
    | {
        timeOut: string;
        out_location: string;
        timeout_image: string;
      }
    | undefined;
}
