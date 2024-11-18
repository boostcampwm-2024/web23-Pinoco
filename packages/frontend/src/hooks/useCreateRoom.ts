import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/states/store/authStore';
import { useRoomStore } from '@/states/store/roomStore';
import { useSocketStore } from '@/states/store/socketStore';

export default function useCreateRoom() {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.userId);
  const setRoomData = useRoomStore((state) => state.setRoomData);
  const socket = useSocketStore((state) => state.socket);

  function handleCreateRoom() {
    if (!userId || !socket) return;

    socket.emit('create_room', { usid: userId });
    socket.on('create_room_success', (data) => {
      setRoomData(data.gsid, data.isHost);
      navigate(`/game/${data.gsid}`);
    });

    return () => {
      socket.off('create_room_success');
    };
  }

  return { handleCreateRoom };
}
