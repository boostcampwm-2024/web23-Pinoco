import { useNavigate, useParams } from 'react-router-dom';
import { useSocketStore } from '@/states/store/socketStore';
import CameraOn from '@/assets/images/CameraOn.svg?react';
import MikeOn from '@/assets/images/MikeOn.svg?react';
import Leave from '@/assets/images/Leave.svg?react';
import { useChatStore } from '@/states/store/chatStore';
import { useRoomStore } from '@/states/store/roomStore';
import { useSignalingSocketStore } from '@/states/store/signalingSocketStore';

export default function SettingSection() {
  const navigate = useNavigate();
  const socket = useSocketStore((state) => state.socket);
  const setChatHistory = useChatStore((state) => state.setChatHistory);
  const setRoomData = useRoomStore((state) => state.setRoomData);
  const signalingSocket = useSignalingSocketStore((state) => state.signalingSocket);

  const handleLeave = () => {
    if (!socket || !signalingSocket) return;

    socket.emit('leave_room');
    signalingSocket.emit('leave_room');
    setChatHistory([]);
    setRoomData(null, false, false);
    navigate('/lobby');
  };

  return (
    <div className="flex justify-around p-4 bg-black rounded-lg opacity-80">
      <button className="px-4 py-4 bg-transparent rounded-lg">
        <MikeOn className="text-white-default" />
      </button>
      <button className="px-4 py-2 bg-transparent rounded-lg">
        <CameraOn className="text-white-default" />
      </button>
      <button className="px-4 py-2 bg-transparent rounded-lg" onClick={handleLeave}>
        <Leave className="text-white-default" />
      </button>
    </div>
  );
}
