import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/states/store/authStore';
import { useRoomStore } from '@/states/store/roomStore';

const socket: Socket = io('ws://localhost:3000', {
  transports: ['websocket'],
});

interface IUseCreateRoom {
  createRoom: () => void;
}

function useCreateRoom(): IUseCreateRoom {
  const navigate = useNavigate();
  const usid = useAuthStore((state) => state.usid);
  const setGsid = useRoomStore((state) => state.setGsid);

  useEffect(() => {
    socket.on('join_room_success', (data: { gsid: string }) => {
      const { gsid } = data;
      setGsid(gsid);
      navigate(`/game/${gsid}`);
    });

    return () => {
      socket.off('join_room_success');
    };
  }, [navigate, setGsid]);

  function createRoom() {
    if (usid) {
      socket.emit('join_room', { usid });
    }
  }

  return { createRoom };
}

export default useCreateRoom;
