import axios, { AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { env } from '../constants/constants';

export const setToken = async (token: string, expires_at?: string) => {
  await AsyncStorage.setItem('token', token);
  if (expires_at) {
    await AsyncStorage.setItem('expires_at', expires_at);
  }
};

export const getToken = () => {
  return AsyncStorage.getItem('token');
};

export const instance = axios.create({
  baseURL: env.api,
});

let instanceInterceptor: number;

const interceptors = async () => {
  const token = await getToken();
  if (token) {
    instanceInterceptor = instance.interceptors.request.use(
      (config) => {
        config.headers.common.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    instanceInterceptor = instance.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        if (error.response.status === 401) {
          console.log('401', error);
          logout();
        } else {
          return Promise.reject(error);
        }
      }
    );
  }
};

interceptors();

export const assignInterceptor = async () => {
  await interceptors();
};

export const removeInterceptor = () => {
  logout();
  instance.interceptors.request.eject(instanceInterceptor);
};

export const logout = () => {
  AsyncStorage.removeItem('token');
};

export const withToken = async (config: AxiosRequestConfig) => {
  const token = await getToken();

  const newConfig: AxiosRequestConfig = {
    ...config,
    headers: {
      ...config.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  return newConfig;
};

export const httpRequest = async (req: any): Promise<any> => {
  instance.interceptors.request.use(withToken);

  try {
    const { data } = await instance(req);
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error || {});
  }
};
