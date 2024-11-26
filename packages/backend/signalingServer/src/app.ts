import express, { Request, Response } from 'express';
import https from 'https';
import cors from 'cors';
import corsConfig from '@/middleware/cors';
import dotenv from 'dotenv';
import initSocket from '@/socket/initSocket';
import { SERVER_CONSTANTS, SERVER_MESSAGES } from '@/constants/serverConstants';
import fs from 'fs';

dotenv.config();

interface IOptions {
  cert: Buffer;
  key: Buffer;
}
const isWindows = process.platform === 'win32';
const options: IOptions = {
  cert: isWindows
    ? fs.readFileSync(process.env.WIN_SSL_CERT_PATH || '')
    : fs.readFileSync(process.env.SSL_CERT_PATH || ''),
  key: isWindows
    ? fs.readFileSync(process.env.WIN_SSL_KEY_PATH || '')
    : fs.readFileSync(process.env.SSL_KEY_PATH || ''),
};

const app = express();
const httpsServer = https.createServer(options, app);
const PORT = process.env.SIGNALING_SERVER_PORT || SERVER_CONSTANTS.port;

app.use(cors(corsConfig));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello');
});

const io = initSocket(httpsServer);

httpsServer.listen(PORT, () => {
  console.log(`${SERVER_MESSAGES.running} ${PORT}`);
});
