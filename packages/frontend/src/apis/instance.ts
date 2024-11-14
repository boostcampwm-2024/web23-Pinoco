import axios from 'axios';

export const instance = axios.create({
  baseURL: '',
  withCredentials: true,
});

export default instance;
