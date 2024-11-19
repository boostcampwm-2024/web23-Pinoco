import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import corsConfig from '@/middleware/cors';
import dotenv from 'dotenv';
import initSocket from '@/socket/initSocket';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.SIGNALING_SERVER_PORT || 8080;

app.use(cors(corsConfig));

const io = initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
