interface Room {
    gsid: string;
    hostUserId: string;
    userIds: Set<string>;
    readyUserIds: Set<string>;
}
export declare class RoomService {
    private rooms;
    createRoom(hostUserId: string): Promise<string>;
    joinRoom(gsid: string, userId: string): Promise<Room>;
    leaveRoom(gsid: string, userId: string): Promise<void>;
    getRoomInfo(gsid: string): Promise<Room>;
    getHostUserId(gsid: string): Promise<string | null>;
}
export {};
