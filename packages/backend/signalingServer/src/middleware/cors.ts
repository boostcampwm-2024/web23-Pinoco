import { CorsOptions } from 'cors';

const corsConfig: CorsOptions = {
  origin: process.env.ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST'],
};

export default corsConfig;
