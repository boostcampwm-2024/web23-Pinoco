import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import corsConfig from '@/middleware/cors';
import dotenv from 'dotenv';
import initSocket from '@/socket/initSocket';
import { SERVER_CONSTANTS, SERVER_MESSAGES } from '@/constants/serverConstants';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.SIGNALING_SERVER_PORT || SERVER_CONSTANTS.port;

app.use(cors(corsConfig));

const io = initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`${SERVER_MESSAGES.running} ${PORT}`);
});
