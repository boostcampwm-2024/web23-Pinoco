import Button from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';

function GuestLoginButton() {
  const navigate = useNavigate();
  function handleClick() {
    navigate('/lobby');
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
