import { httpRequest } from '../../../library/api';

export const getAddress = async (lat: number, long: number) => {
  return await httpRequest({
    url: 'v1/time-inout/get-geo-address',
    method: 'POST',
    data: {
      api: true,
      location: {
        lat: lat,
        lng: long,
      },
    },
  })
    .then((response) => {
      return Promise.resolve(response);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
