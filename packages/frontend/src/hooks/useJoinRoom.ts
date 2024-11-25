import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/states/store/authStore';
import { useRoomStore } from '@/states/store/roomStore';
import { useSocketStore } from '@/states/store/socketStore';
import { useSignalingSocketStore } from '@/states/store/signalingSocketStore';

export default function useJoinRoom() {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.userId);
  const setRoomData = useRoomStore((state) => state.setRoomData);
  const setAllUsers = useRoomStore((state) => state.setAllUsers);
  const socket = useSocketStore((state) => state.socket);
  const signalingSocket = useSignalingSocketStore((state) => state.signalingSocket);

  function handleJoinRoom(gsid: string) {
    if (!userId || !socket || !signalingSocket) return;

    socket.emit('join_room', { gsid });
    signalingSocket.emit('join_room', { gsid });

    socket.on('join_room_success', (data) => {
      setRoomData(gsid, data.isHost, false);
      setAllUsers(data.userIds);
      navigate(`/game/${gsid}`);
    });

    socket.on('error', (data: { errorMessage: string }) => {
      alert(`방 참가에 실패했습니다: ${data.errorMessage}`);
    });

    return () => {
      socket.off('join_room_success');
      socket.off('error');
    };
  }

  return { handleJoinRoom };
}
