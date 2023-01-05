import { httpRequest } from '../../../library/api';

export const fetchLogo = async () => {
  try {
    const response = await httpRequest({
      url: 'get-logo?settings=company_logo',
      method: 'GET',
    });

    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};
