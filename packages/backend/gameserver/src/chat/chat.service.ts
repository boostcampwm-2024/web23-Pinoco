import { Injectable } from '@nestjs/common';

interface ChatMessage {
  userId: string;
  message: string;
  timestamp: number;
}

@Injectable()
export class ChatService {
  private chatRooms: Map<string, ChatMessage[]> = new Map();

  saveMessage(gsid: string, userId: string, message: string): void {
    const messages = this.getChatRoom(gsid);

    messages.push({
      userId,
      message,
      timestamp: Date.now(),
    });

    this.chatRooms.set(gsid, messages);
  }

  getMessages(gsid: string): ChatMessage[] {
    return this.getChatRoom(gsid);
  }

  private getChatRoom(gsid: string): ChatMessage[] {
    return this.chatRooms.get(gsid) || [];
  }

  clearRoom(gsid: string): void {
    this.chatRooms.delete(gsid);
  }
}
