import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/states/store/authStore';
import { useRoomStore } from '@/states/store/roomStore';

export default function useJoinRoom() {
  const navigate = useNavigate();
  const usid = useAuthStore((state) => state.usid);
  const setRoomData = useRoomStore((state) => state.setRoomData);

  function handleJoinRoom(gsid: string) {
    if (!usid) return;

    const socket = io('ws://localhost:8080');
    socket.emit('join_room', { usid, gsid });
    socket.on('join_room_success', (data) => {
      setRoomData(data.gsid, data.isHost);
      navigate(`/game/${data.gsid}`);
    });

    socket.on('join_room_fail', (data) => {
      alert(`방 참가에 실패했습니다: ${data.errorMessage}`);
    });
  }

  return { handleJoinRoom };
}
