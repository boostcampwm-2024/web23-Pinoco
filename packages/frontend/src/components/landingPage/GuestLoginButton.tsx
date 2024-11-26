import Button from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';
import { postGuestLogin } from '@/apis/login';
import { useAuthStore } from '@/states/store/authStore';
import { useSocketStore } from '@/states/store/socketStore';
import { useSignalingSocketStore } from '@/states/store/signalingSocketStore';

export default function GuestLoginButton() {
  const navigate = useNavigate();
  const { setUserData } = useAuthStore();
  const { connectSocket } = useSocketStore();
  const { connectSignalingSocket } = useSignalingSocketStore();

  async function handleClick() {
    try {
      localStorage.removeItem('auth-storage');
      localStorage.removeItem('room-storage');

      const { userId, password } = await postGuestLogin();
      await connectSocket(userId, password);
      await connectSignalingSocket(userId);
      setUserData(userId, password);
      navigate('/lobby');
    } catch (error) {
      console.error('Guest login failed:', error);
    }
  }

  return (
    <Button
      className="text-xl font-semibold text-black bg-white hover:bg-gray-300"
      onClick={handleClick}
      buttonText="비회원으로 시작하기"
    />
  );
}
