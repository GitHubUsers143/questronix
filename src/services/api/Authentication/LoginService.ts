import { httpRequest, setToken } from '../../../library/api';

const loginService = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return httpRequest({
    url: 'v1/login-api',
    method: 'POST',
    data: {
      email: email,
      password: password,
    },
  })
    .then(async (response) => {
      await setToken(response.token);
      return Promise.resolve(response.token);
    })
    .catch((error) => {
      return Promise.reject(error || {});
    });
};

const googleSignInService = async ({
  id,
  email,
  name,
  token,
}: {
  id: string;
  email: string;
  name: string | null;
  token: string | null;
}) => {
  return httpRequest({
    url: 'v1/google-login',
    method: 'POST',
    data: {
      id: id,
      email: email,
      name: name,
      token: token,
    },
  })
    .then(async (response) => {
      console.log(response);
      await setToken(response.token);
      return Promise.resolve(response);
    })
    .catch((error) => {
      return Promise.reject(error || {});
    });
};

export default { loginService, googleSignInService };
