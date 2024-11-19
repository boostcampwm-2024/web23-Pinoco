export default function useJoinRoom() {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.userId);
  const setRoomData = useRoomStore((state) => state.setRoomData);
  const socket = useSocketStore((state) => state.socket);

  function handleJoinRoom(gsid: string) {
    if (!userId || !socket) return;

    socket.emit('join_room', { usid: userId, gsid });

    socket.on('join_room_success', (data) => {
      setRoomData(data.gsid, data.isHost);
      navigate(`/game/${data.gsid}`);
    });

    socket.on('error', (data) => {
      alert(`방 참가에 실패했습니다: ${data.errorMessage}`);
    });

    return () => {
      socket.off('join_room_success');
      socket.off('error');
    };
  }

  return { handleJoinRoom };
}
