import { PhotoFile, VideoFile } from 'react-native-vision-camera';

export interface TimeInInterface {
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
  timeInDetails:
    | {
        timeIn: string;
        in_location: string;
        timein_image: string;
      }
    | undefined;
}
