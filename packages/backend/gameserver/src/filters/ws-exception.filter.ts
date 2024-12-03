import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch()
export class WebSocketExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();

    let errorMessage: string;

    if (exception instanceof WsException) {
      errorMessage = exception.message;
    } else {
      errorMessage = exception.message || '알 수 없는 오류가 발생했습니다.';
    }

    client.emit('error', { errorMessage });
  }
}
