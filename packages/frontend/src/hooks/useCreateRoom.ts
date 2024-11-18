import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/states/store/authStore';
import { useRoomStore } from '@/states/store/roomStore';

export default function useCreateRoom() {
  const navigate = useNavigate();
  const usid = useAuthStore((state) => state.usid);
  const setRoomData = useRoomStore((state) => state.setRoomData);

  function handleCreateRoom() {
    if (!usid) return;

    const socket = io('http://localhost:3000');
    socket.emit('create_room', { usid });
    socket.on('roomCreated', (data) => {
      setRoomData(data.gsid, data.isHost);
      navigate(`/game/${data.gsid}`);
    });
  }

  return { handleCreateRoom };
}
