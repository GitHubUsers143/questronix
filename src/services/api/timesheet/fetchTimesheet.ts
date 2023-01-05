const moment = require('moment');
import { httpRequest } from '../../../library/api';

const fetchTimesheet = async (id: string) => {
  try {
    const response = await httpRequest({
      url: 'v5/timesheet/get-timesheet-week',
      method: 'POST',
      data: {
        id: id,
        year: moment().format('YYYY'),
        date: moment().format('YYYY/MM/DD'),
      },
    });

    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
};

export default fetchTimesheet;
