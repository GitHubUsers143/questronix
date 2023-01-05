import { httpRequest } from '../../../library/api';

export const fetchCompanyName = async () => {
  try {
    const response = await httpRequest({
      url: 'get-logo?settings=company_name',
    });
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};
