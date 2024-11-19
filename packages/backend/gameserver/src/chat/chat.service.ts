import { Injectable } from '@nestjs/common';

interface ChatMessage {
  userId: string;
  message: string;
  timestamp: number;
}

@Injectable()
export class ChatService {
  private chatRooms: Map<string, ChatMessage[]> = new Map();

  // 채팅 메시지 저장
  async saveMessage(
    gsid: string,
    userId: string,
    message: string,
  ): Promise<void> {
    const chatMessages = this.chatRooms.get(gsid) || [];
    chatMessages.push({
      userId,
      message,
      timestamp: Date.now(),
    });
    this.chatRooms.set(gsid, chatMessages);
  }

  // 채팅 메시지 가져오기
  async getMessages(gsid: string): Promise<ChatMessage[]> {
    return this.chatRooms.get(gsid) || [];
  }
}
