import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { LoggerService } from '../logger/logger.service';

@Catch()
export class WebSocketExceptionFilter extends BaseWsExceptionFilter {
  constructor(private readonly logger: LoggerService) {
    super();
  }

  catch(exception: Error, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();

    let errorMessage: string;

    if (exception instanceof WsException) {
      errorMessage = exception.message;
    } else {
      errorMessage = exception.message || '알 수 없는 오류가 발생했습니다.';
    }

    this.logger.logError('websocket', exception);

    client.emit('error', { errorMessage });
  }
}
