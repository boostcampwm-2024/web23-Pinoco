import { CorsOptions } from 'cors';
import { SERVER_CONSTANTS } from '@/constants/serverConstants';

const corsConfig: CorsOptions = {
  origin: process.env.ORIGIN || SERVER_CONSTANTS.local,
  methods: ['GET', 'POST'],
};

export default corsConfig;
