import Button from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';

export default function RoomCreationButton() {
  const navigate = useNavigate();
  function handleClick() {
    navigate('/game');
  }
  return (
    <Button
      className="w-4/5 text-xl font-semibold text-black bg-white hover:bg-gray-300"
      onClick={handleClick}
      buttonText="게임 생성하기"
    />
  );
}
