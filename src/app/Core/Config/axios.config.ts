
import axios from 'axios';
import { environment } from '../../../environments/environments';

const axiosInstance = axios.create({
  baseURL: environment.API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
