import axios from 'axios';

export const instance = axios.create({
  baseURL: 'localhost:3000',
  withCredentials: true,
});

export default instance;
