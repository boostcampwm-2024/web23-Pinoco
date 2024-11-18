interface ChatMessage {
    userId: string;
    message: string;
    timestamp: number;
}
export declare class ChatService {
    private chatRooms;
    saveMessage(gsid: string, userId: string, message: string): Promise<void>;
    getMessages(gsid: string): Promise<ChatMessage[]>;
}
export {};
