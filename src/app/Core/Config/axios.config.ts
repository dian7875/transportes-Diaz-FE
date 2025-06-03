
import axios from 'axios';
import { environment } from '../../../environments/environments';

const axiosInstance = axios.create({
  baseURL: environment.API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAccessToken = (): string | null => {
  if (isIOS()) {
    return localStorage.getItem('accessToken');
  }
  return null;
};

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const isIOS = (): boolean => {
  const userAgent = navigator.userAgent || navigator.vendor;
  return /iPhone|iPad|iPod/i.test(userAgent);
};


export default axiosInstance;
