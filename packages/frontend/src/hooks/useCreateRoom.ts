import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const socket: Socket = io('ws://localhost:3000', {
  transports: ['websocket'],
});

interface IUseCreateRoom {
  createRoom: () => void;
}

function useCreateRoom(): IUseCreateRoom {
  const navigate = useNavigate();
  const [usid, setUsid] = useState<string>('');
  const [gsid, setGsid] = useState<string>('');

  useEffect(() => {
    const storedUsid = localStorage.getItem('usid');
    if (storedUsid) setUsid(storedUsid);

    socket.on('join_room_success', (data: { gsid: string }) => {
      const { gsid } = data;
      setGsid(gsid);
      localStorage.setItem('gsid', gsid);
      navigate(`/game/${gsid}`);
    });

    return () => {
      socket.off('join_room_success');
    };
  }, [navigate]);

  function createRoom() {
    if (usid) {
      socket.emit('join_room', { usid });
    }
  }

  return { createRoom };
}

export default useCreateRoom;
