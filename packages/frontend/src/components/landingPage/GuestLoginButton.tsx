import Button from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';
import { postGuestLogin } from '@/apis/login';
import { useAuthStore } from '@/states/store/authStore';

function GuestLoginButton() {
  const navigate = useNavigate();
  const { setUserData } = useAuthStore();

  async function handleClick() {
    try {
      const { userId, usid } = await postGuestLogin();
      setUserData(userId, usid);
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
export default GuestLoginButton;
