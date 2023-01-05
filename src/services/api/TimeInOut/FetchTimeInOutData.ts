import { httpRequest } from '../../../library/api';

const fetchTimeInOutData = async () => {
  return await httpRequest({
    url: 'v1/user/load/user-dashboard',
    method: 'POST',
  })
    .then((response) => {
      return Promise.resolve(response);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export default fetchTimeInOutData;
