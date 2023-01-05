import { httpRequest } from '../../../library/api';
export interface PositionInterface {
  coords: {
    latitude: number;
    longitude: number;
  };
}

const postTimeInOut = async (
  isInOut: boolean,
  position: PositionInterface,
  img: string
) => {
  try {
    const response = await httpRequest({
      url: 'v5/time/time-in',
      method: 'POST',
      data: {
        api: true,
        action: isInOut ? 'in' : 'out',
        location: JSON.stringify({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
        img: img === '' ? '' : `data:image/png;base64,${img}`,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export default postTimeInOut;
