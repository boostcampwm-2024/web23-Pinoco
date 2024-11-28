import { useState } from 'react';
import Button from '@/components/common/Button';
import NicknameModal from './NicknameModal';
import { useNavigate } from 'react-router-dom';
import { getGuestLogin } from '@/apis/login';
import { useAuthStore } from '@/states/store/authStore';
import { useSocketStore } from '@/states/store/socketStore';
import { useSignalingSocketStore } from '@/states/store/signalingSocketStore';

export default function GuestLoginButton() {
  const navigate = useNavigate();
  const { setUserData } = useAuthStore();
  const { connectSocket } = useSocketStore();
  const { connectSignalingSocket } = useSignalingSocketStore();
  const [showModal, setShowModal] = useState(false);

  const clearLocalStorage = () => {
    [
      'auth-storage',
      'room-storage',
      'lobbyPageVisited',
      'roomCreateTooltipShown',
      'modalTooltipShown',
      'gamePageVisited',
    ].forEach((key) => localStorage.removeItem(key));
  };

  const handleLogin = async (nickname: string) => {
    try {
      clearLocalStorage();
      const { userId, password } = await getGuestLogin(nickname);
      await connectSocket(userId, password);
      await connectSignalingSocket(userId);
      setUserData(userId, password);
      navigate('/lobby');
    } catch (error) {
      console.error('게스트 로그인에 실패하였습니다.', error);
    }
  };

  return (
    <>
      <Button
        className="text-xl font-semibold text-black bg-white hover:bg-gray-300"
        onClick={() => setShowModal(true)}
        buttonText="게임 시작하기"
      />
      {showModal && (
        <NicknameModal
          onConfirm={(nickname) => {
            setShowModal(false);
            handleLogin(nickname);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
