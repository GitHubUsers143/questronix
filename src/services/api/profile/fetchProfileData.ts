import { httpRequest } from '../../../library/api';

const fetchProfileData = async () => {
  try {
    const response = await httpRequest({
      url: '/user',
      method: 'GET',
    });

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default fetchProfileData;
