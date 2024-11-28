import Leave from '@/assets/images/Leave.svg?react';
import { useNavigate } from 'react-router-dom';
import { useSocketStore } from '@/states/store/socketStore';
import { useChatStore } from '@/states/store/chatStore';
import { useRoomStore } from '@/states/store/roomStore';
import { useSignalingSocketStore } from '@/states/store/signalingSocketStore';

export default function LeaveButton() {
  const navigate = useNavigate();
  const socket = useSocketStore((state) => state.socket);
  const setChatHistory = useChatStore((state) => state.setChatHistory);
  const setRoomData = useRoomStore((state) => state.setRoomData);
  const signalingSocket = useSignalingSocketStore((state) => state.signalingSocket);
  function handleLeave() {
    if (!socket || !signalingSocket) return;
    socket.emit('leave_room');
    signalingSocket.emit('leave_room');
    setChatHistory([]);
    setRoomData(null, false, false);
    navigate('/lobby');
  }
  return (
    <button
      className="w-[120px] px-4 py-4 bg-transparent rounded-lg flex flex-col items-center justify-center gap-2"
      onClick={handleLeave}
    >
      <Leave className="text-white-default pr-2" />
      <p className="text-white-default text-lg">방 나가기</p>
    </button>
  );
}
