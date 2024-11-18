import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import corsConfig from './middleware/cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.SIGNALING_SERVER_PORT || 8080;

app.use(cors(corsConfig));

const io = new Server(httpServer, {
  cors: corsConfig,
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
