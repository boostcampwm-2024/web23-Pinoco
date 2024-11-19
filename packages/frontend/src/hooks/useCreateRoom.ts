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

    socket.on('error', (data) => {
      alert(`방 생성에 실패했습니다: ${data.errorMessage}`);
    });

    return () => {
      socket.off('create_room_success');
      socket.off('error');
    };
  }

  return { handleCreateRoom };
}
