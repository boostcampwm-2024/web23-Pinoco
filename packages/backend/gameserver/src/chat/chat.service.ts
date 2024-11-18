import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  sendMessage(roomId: string, message: string): string {
    return `Message sent to room ${roomId}: ${message}`;
  }
}
