import { Injectable } from '@nestjs/common';

interface ChatMessage {
  userId: string;
  message: string;
  timestamp: number;
}

@Injectable()
export class ChatService {
  private chatRooms: Map<string, ChatMessage[]> = new Map();

  async saveMessage(
    gsid: string,
    userId: string,
    message: string,
  ): Promise<void> {
    const messages = this.getChatRoom(gsid);

    messages.push({
      userId,
      message,
      timestamp: Date.now(),
    });

    this.chatRooms.set(gsid, messages);
  }

  async getMessages(gsid: string): Promise<ChatMessage[]> {
    return this.getChatRoom(gsid);
  }

  private getChatRoom(gsid: string): ChatMessage[] {
    return this.chatRooms.get(gsid) || [];
  }

  clearRoom(gsid: string): void {
    this.chatRooms.delete(gsid);
  }
}
