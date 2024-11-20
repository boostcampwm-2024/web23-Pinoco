export enum LogType {
  create = 'create_room',
  join = 'join_room',
}

interface ILogRoomStatus {
  type: LogType;
  roomList: Map<string, Set<string>>;
  room?: Set<string>;
  gsid: string;
}

export const logRoomStatus = ({ type, roomList, room = new Set(), gsid }: ILogRoomStatus) => {
  console.log(`[ROOMS] ${JSON.stringify(Array.from(roomList.entries()))}`);
  console.log(`[${type}] gsid: ${gsid}, room: ${JSON.stringify(Array.from(room))}`);
};
