import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useRoomStore } from '@/store/roomStore';
import { useSocketStore } from '@/store/socketStore';
import { useSignalingSocketStore } from '@/store/signalingSocketStore';

export default function useCreateRoom() {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.userId);
  const { setRoomData, setAllUsers, allUsers } = useRoomStore();
  const socket = useSocketStore((state) => state.socket);
  const signalingSocket = useSignalingSocketStore((state) => state.signalingSocket);

  function handleCreateRoom() {
    if (!userId || !socket || !signalingSocket) return;

    socket.emit('create_room');

    socket.on('create_room_success', (data: { gsid: string; isHost: boolean }) => {
      setRoomData(data.gsid, data.isHost, false);
      setAllUsers([userId]);
      signalingSocket.emit('create_room', { gsid: data.gsid });
      navigate(`/game/${data.gsid}`);
    });

    socket.on('error', (data: { errorMessage: string }) => {
      alert(data.errorMessage);
    });

    return () => {
      socket.off('create_room_success');
      socket.off('error');
    };
  }

  return { handleCreateRoom };
}
function setAllUsers(arg0: string[]) {
  throw new Error('Function not implemented.');
}
