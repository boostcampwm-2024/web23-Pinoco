import Leave from '@/assets/images/Leave.svg?react';
import { useNavigate } from 'react-router-dom';
import { useSocketStore } from '@/store/socketStore';
import { useChatStore } from '@/store/chatStore';
import { useRoomStore } from '@/store/roomStore';
import { useSignalingSocketStore } from '@/store/signalingSocketStore';
import { useState } from 'react';
import LeaveConfirmModal from './LeaveConfirmModal';

export default function LeaveButton() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const socket = useSocketStore((state) => state.socket);
  const setChatHistory = useChatStore((state) => state.setChatHistory);
  const setRoomData = useRoomStore((state) => state.setRoomData);
  const signalingSocket = useSignalingSocketStore((state) => state.signalingSocket);

  function handleLeave() {
    if (!socket || !signalingSocket) return;
    socket.emit('leave_room');
    signalingSocket.emit('leave_room');
    setChatHistory([]);
    setRoomData(null, false, false);
    navigate('/lobby');
  }

  return (
    <>
      <button
        className="w-[120px] px-4 py-4 bg-transparent rounded-lg flex flex-col items-center justify-center gap-2"
        onClick={() => setShowModal(true)}
      >
        <Leave className="pr-2 text-white-default" />
        <p className="text-lg text-white-default">방 나가기</p>
      </button>

      {showModal && (
        <LeaveConfirmModal onConfirm={handleLeave} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
