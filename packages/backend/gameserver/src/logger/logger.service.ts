import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

interface LogMessage {
  type: 'socket' | 'http' | 'error';
  event?: string;
  method?: string;
  url?: string;
  status?: number;
  data?: any;
  error?: string;
  direction?: 'send' | 'receive';
}

@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.DailyRotateFile({
          dirname: 'logs',
          filename: 'gameserver-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '14d',
        }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf((info) => {
              const message = info.message as LogMessage;

              if (message.type === 'socket') {
                const direction = message.direction?.toUpperCase() || '';
                return `🔌 [${message.type.toUpperCase()}][${direction}] ${
                  message.event
                } - ${JSON.stringify(message.data)}`;
              }

              if (message.type === 'http') {
                return `🌐 [${message.type.toUpperCase()}] ${message.method} ${
                  message.url
                } ${message.status}`;
              }

              if (message.type === 'error') {
                return `❌ [ERROR] ${message.event} - ${message.error}`;
              }

              return JSON.stringify(message);
            }),
          ),
        }),
      ],
    });
  }

  logSocketEvent(direction: 'receive' | 'send', event: string, payload: any) {
    this.logger.info({
      message: {
        type: 'socket',
        event,
        data: payload,
        direction,
      } as LogMessage,
    });
  }

  logHttp(method: string, url: string, status: number, data: any) {
    this.logger.info({
      message: {
        type: 'http',
        method,
        status,
        url,
        data,
      } as LogMessage,
    });
  }

  logError(event: string, error: any) {
    this.logger.error({
      message: {
        type: 'error',
        event,
        error: error.message || error,
        stack: error.stack,
      } as LogMessage,
    });
  }
}
